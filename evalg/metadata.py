#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Functional API for handling election metadata."""

from flask import current_app
from functools import wraps
from .models.election import ElectionGroup, Election
from .models.election_list import ElectionList
from .api import NotFoundError, BadRequest
from .authorization import check_perms, all_perms, PermissionDenied
from evalg import db


def eperm(permission, arg=0):
    """Check perms function for election"""
    assert permission in all_perms, '{} not valid'.format(permission)
    if isinstance(arg, int):
        def election(args, kw):
            return args[arg]
    else:
        def election(args, kw):
            return kw[arg]

    def fun(f):
        @wraps(f)
        def gun(*args, **kw):
            if 'principals' in kw:
                principals = kw['principals']
                del kw['principals']
            else:
                principals = ()
            e = election(args, kw)
            if not check_perms(principals, permission, election=e, ou=e.ou):
                raise PermissionDenied()
            return f(*args, **kw)

        gun.is_protected = True
        return gun
    return fun


def rperm(*permission):
    """Check if user has perms on return value. """
    for perm in permission:
        assert perm in all_perms

    def fun(f):
        @wraps(f)
        def gun(*args, **kw):
            if 'principals' in kw:
                principals = kw['principals']
                del kw['principals']
            else:
                principals = ()
            ret = f(*args, **kw)
            if ret is not None:
                if not check_perms(principals, permission, election=ret,
                                   ou=ret.ou):
                    raise PermissionDenied()
            return ret
        gun.is_protected = True
        return gun
    return fun


@rperm('view-election')
def get_group(group_id):
    """Look up election group."""
    group = ElectionGroup.query.get(group_id)
    if group is None:
        raise NotFoundError(
            details="No such election group with id={uuid}".format(
                uuid=group_id))
    return group


@rperm('view-election')
def get_election(election_id):
    """Look up election."""
    election = Election.query.get(election_id)
    if election is None:
        raise NotFoundError(
            details="No such election with id={uuid}".format(
                uuid=election_id))
    return election


def list_elections(group=None):
    """List all elections or elections in group."""
    if group is None:
        return Election.query.filter(Election.deleted_at.is_(None)).all()
    else:
        return group.elections


@eperm('change-election-metadata')
def update_election(election, **fields):
    """Update election fields"""
    for k, v in fields.items():
        if not hasattr(election, k):
            continue
        if getattr(election, k) != v:
            setattr(election, k, v)
    db.session.commit()
    return election


@eperm('publish-election')
def publish_election(election, **fields):
    """Publish an election."""
    if election.published:
        raise BadRequest(details='already-published')
    if not election.start or not election.end:
        raise BadRequest(details='missing-start-or-end')
    if election.start > election.end:
        raise BadRequest(details='start-must-be-before-end')
    election.publish()
    db.session.commit()
    return election


@eperm('change-election-metadata')
def update_group(group, **fields):
    """Update group fields. """
    for k, v in fields.items():
        if not hasattr(group, k):
            continue
        if getattr(group, k) != v:
            setattr(group, k, v)
    db.session.commit()
    return group


@eperm('change-election-metadata')
def delete_election(election):
    """Delete election"""
    election.delete()
    db.session.commit()


@eperm('change-election-metadata')
def delete_group(group):
    """Delete election"""
    group.delete()
    db.session.commit()


def list_groups(running=None):
    """List election groups"""
    return ElectionGroup.query.all()


@rperm('create-election')
def make_election(**kw):
    """Create election."""
    return Election(**kw)


@rperm('create-election')
def make_group(**kw):
    """Create election group."""
    return ElectionGroup(**kw)


def make_group_from_template(template_name, ou, principals=()):
    """Create election with elections from template"""
    current_app.logger.info('MAKE', template_name, ou)
    from instance.evalg_template_config import election_templates
    import datetime
    from dateutil.relativedelta import relativedelta
    import functools

    if not check_perms(principals, 'create-election', ou=ou):
        current_app.logger.info('Testing %s', principals)
        raise PermissionDenied()
    template = election_templates[template_name]
    name = template['name']
    group_type = template['settings']['group_type']
    elections = template['settings']['elections']
    metadata = template['settings']['rule_set']

    now = datetime.datetime.now()

    def candidate_type(e):
        return metadata['candidate-type']

    def common_candidate_type():
        return functools.reduce(lambda x, y: x if x == y else None,
                                map(candidate_type, elections))

    def default_start():
        return datetime.datetime.combine(
            now.date(),
            datetime.time(8, 0))

    def default_end():
        return datetime.datetime.combine(
            (now + datetime.timedelta(days=7)).date(), datetime.time(12, 0))

    def mandate_period_start(e):
        start = e['mandate_period'].get('start', '01-01')
        lst = start.split('-')
        month = int(lst[0], base=10)
        if len(lst) == 1:
            date = 1
        elif len(lst) == 2:
            date = int(lst[1], base=10)
        year = now.year
        ret = datetime.date(year, month, date)
        if ret < now.date():
            ret = datetime.date(year+1, month, date)
        return ret

    def mandate_period_end(e):
        start = mandate_period_start(e)
        length = e['mandate_period'].get('length')
        if length is None:
            return None
        l = length.split()
        size = int(l[0])
        unit = l[1] if len(l) == 2 else 'y'
        kw = dict(y='years', m='months', d='days')[unit]
        return start + relativedelta(**{kw: size})

    grp_name = dict()
    for lang in name.keys():
        grp_name[lang] = name[lang].format(ou.name[lang])

    group = ElectionGroup(name=grp_name,
                          description=None,  # Set this?
                          type=group_type,
                          meta=metadata,
                          ou=ou)

    def make_candidate_list(c):
        cand_list = ElectionList(name=c['name'])
        return cand_list

    def make_election(e):
        election = Election(name=e['name'],
                            sequence=e['sequence'],
                            group=group,
                            start=default_start(),
                            end=default_end(),
                            mandate_period_start=mandate_period_start(e),
                            mandate_period_end=mandate_period_end(e),
                            candidate_type=metadata['candidate_type'],
                            meta=metadata,
                            active=group_type == 'single_election',
                            status='draft')
        election.lists = list(map(make_candidate_list, e['voter_groups']))
        return election

    group.elections = list(map(make_election, elections))

    db.session.add(group)
    db.session.commit()
    return group

make_group_from_template.is_protected = True
