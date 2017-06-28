#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Business logic for authz."""


from functools import wraps
from evalg import db
from .models.ou import OrganizationalUnit
from .models.authorization import (Permission,
                                   get_principals_for,
                                   list_roles,
                                   get_role,
                                   get_principal)
from .auth import check_perms, all_permissions


class PermissionDenied(RuntimeError):
    pass

all_perms = set(all_permissions.keys())
_cp = check_perms


def add_perm(perm, fun):
    assert perm in all_perms, 'Perm {} does not exist'.format(perm)

    @wraps(fun)
    def gun(principals=None, *rest, **kw):
        assert principals is not None, "Add authz"
        if not check_perms(principals, (perm, )):
            raise PermissionDenied()
        return fun(*rest, **kw)
    gun.is_protected = True
    return gun


def perm(perm):
    def fun(f):
        add_perm(perm, f)
        return f
    return fun


def get_perms():
    """ Get all perms. """
    return Permission.query.all()


get_principals_for = add_perm('grant-role', get_principals_for)


def list_ous():
    """ List all ous. """

    return OrganizationalUnit.query.all()


# get_principal, list_roles, get_role = (add_perm((), x) for x in (get_principal,
#                                                                list_roles,
#                                                                get_role))


@perm('grant-role')
def make_role(cls, *rest, **kw):
    ret = cls(*rest, **kw)
    cls.session.add(ret)
    cls.session.commit()
    return ret


@perm('grant-role')
def update_role(role, args):
    for k, v in args.items():
        setattr(role, k, v)
    db.session.commit()
    return role


@perm('grant-role')
def delete_role(role):
    db.session.delete(role)
    db.session.commit()
    return role


@perm('grant-role')
def add_perm_to_role(role, perm):
    role.perms.append(perm)
    db.session.commit()
    return role.perms


@perm('grant-role')
def remove_perm_from_role(role, perm):
    role.perms.remove(perm)
    db.session.commit()
    return True


def list_perms():
    return Permission.query.all()