#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Functional API for handling election metadata."""

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


@rperm('seeelection')
def get_group(eg_id):
    """Look up election group."""
    return ElectionGroup.query.get(eg_id)


@rperm('seeelection')
def get_election(e_id):
    """Look up election."""
    return Election.query.get(e_id)


def list_elections(group=None):
    """List all elections or elections in group."""
    if group is None:
        return Election.query.filter(Election.deleted is False)
    else:
        return group.elections


@eperm('changemetadata')
def update_election(election, **fields):
    """Update election fields"""
    for k, v in fields.items():
        if not hasattr(election, k):
            continue
        if getattr(election, k) != v:
            setattr(election, k, v)
    db.session.commit()
    return election


@eperm('changemetadata')
def update_group(group, **fields):
    """Update group fields. """
    for k, v in fields.items():
        if not hasattr(group, k):
            continue
        if getattr(group, k) != v:
            setattr(group, k, v)
    db.session.commit()
    return group


@eperm('changemetadata')
def delete_election(election):
    """Delete election"""
    election.deleted = True
    db.session.commit()


@eperm('changemetadata')
def delete_group(group):
    """Delete election"""
    group.deleted = True
    db.session.commit()


def list_groups(running=None):
    """List election groups"""
    return ElectionGroup.query.all()


@rperm('createelection')
def make_election(**kw):
    """Create election."""
    return Election(**kw)


@rperm('createelection')
def make_group(**kw):
    """Create election group."""
    return ElectionGroup(**kw)
