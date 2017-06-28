#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Functional API for handling election metadata."""

from flask import current_app
from functools import wraps
from .models.election import ElectionGroup, Election
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
def get_group(eg_id):
    """Look up election group."""
    return ElectionGroup.query.get(eg_id)


@rperm('view-election')
def get_election(e_id):
    """Look up election."""
    return Election.query.get(e_id)


def list_elections(group=None):
    """List all elections or elections in group."""
    if group is None:
        return Election.query.filter(Election.deleted is False)
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
    election.deleted = True
    db.session.commit()


@eperm('change-election-metadata')
def delete_group(group):
    """Delete election"""
    group.deleted = True
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


def make_group_from_template(name=None, template=None, ou=None, principals=()):
    """Create election with elections from template"""
    from instance.evalg_template_config import election_types
    import datetime
    from dateutil.relativedelta import relativedelta
    from collections import defaultdict
    import functools

    if not check_perms(principals, 'create-election', ou=ou):
        current_app.logger.info('Testing %s', principals)
        raise PermissionDenied()

    grouptype = template['grouptype']
    elections = template['elections']

    now = datetime.datetime.now()

    def candidate_type(e):
        return election_types[e['rules']]['candidate-type']

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
        start = e['mandate-period'].get('start', '01-01')
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
        length = e['mandate-period'].get('length')
        if length is None:
            return None
        l = length.split()
        size = int(l[0])
        unit = l[1] if len(l) == 2 else 'y'
        kw = dict(y='years', m='months', d='days')[unit]
        return start + relativedelta(**{kw: size})

    def common_date(dates):
        counts = defaultdict(int)
        for d in dates:
            counts[d] += 1
        for date, count in sorted(counts.items(), key=lambda x: x[1]):
            return date
        return None

    def common_mandate_period_start():
        return common_date(map(mandate_period_start, elections))

    def common_mandate_period_end():
        return common_date(map(mandate_period_end, elections))

    group = ElectionGroup(name=name,
                          description=None,  # Set this?
                          type=grouptype,
                          candidate_type=common_candidate_type(),
                          meta=template,
                          deleted=False,
                          status='draft',
                          start=default_start(),
                          end=default_end(),
                          ou=ou,
                          information_url=None,
                          contact=None,
                          mandate_period_start=common_mandate_period_start(),
                          mandate_period_end=common_mandate_period_end())

    def election(e):
        candtype = (candidate_type(e)
                    if common_candidate_type() is None
                    else None)
        election = Election(name=e['name'],
                            sequence=e['sequence'],
                            group=group,
                            _mandate_period_start=mandate_period_start(e),
                            _mandate_period_end=mandate_period_end(e),
                            type=e['rules'],
                            candidate_type=candtype,
                            meta=e,
                            status=None)
        return election

    group.elections = list(map(election, elections))
    db.session.add(group)
    db.session.commit()

    return group

make_group_from_template.is_protected = True