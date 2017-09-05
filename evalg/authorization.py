#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""Business logic for authz."""


from functools import wraps
from evalg import db
from .models.ou import OrganizationalUnit
from .models.authorization import (Permission,
                                   ElectionRole,
                                   ElectionGroupRole,
                                   Principal,
                                   RoleList,
                                   get_principals_for)
from .auth import check_perms, all_permissions
from .apierror import ApiError


class PermissionDenied(ApiError):
    code = 401

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


@perm('grant-role')
def grant_role(role_list, **kw):
    ret = role_list.makerole(**kw)
    db.session.add(ret)
    db.session.commit()
    return ret


@perm('grant-role')
def get_grant(role, principal_type, principal_id, **kw):
    role = get_role(role) if isinstance(role, str) else role
    c = role.role_class
    if c is ElectionRole and 'group_id' in kw:
        c = ElectionGroupRole
    more = [getattr(c, k) == v for k, v in kw.items()]
    return c.query.filter(c.trait == role, c.principal_id == principal_id,
                          *more).one()


@perm('grant-role')
def delete_grant(grant):
    db.session.delete(grant)
    db.session.commit()


def list_perms():
    return Permission.query.all()


def list_roles():
    return RoleList.query.all()


def list_election_roles(election):
    return ElectionRole.query.filter(ElectionRole.election_id == election.id)


def list_election_group_roles(group):
    return ElectionGroupRole.query.filter(
        ElectionGroupRole.group_id == group.id)


def get_principal(principal_id):
    return Principal.query.get(principal_id)


def get_role(role):
    return RoleList.query.get(role)
