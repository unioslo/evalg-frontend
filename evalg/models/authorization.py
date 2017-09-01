#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Authorization module

Basic idea:

* A user holds zero or more principals (i.e. has a user, and are member
  of groups)
* A principal maps to zero or more roles (e.g. being member of group
  «election board» leads to role «election board member».
* A role grants one or more permission.
* When doing a task, a permission is checked.
"""


import uuid
from evalg import db
from evalg.models import Base
from evalg.models.ou import OrganizationalUnit
from sqlalchemy_utils import UUIDType, JSONType

Column = db.Column
String = db.String
ForeignKey = db.ForeignKey


class Principal(Base):
    """ Principals. """
    principal_id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    principal_type = db.Column(String, nullable=False)
    roles = db.relationship('Role', back_populates='principal')

    __mapper_args__ = {
        'polymorphic_identity': 'principal',
        'polymorphic_on': principal_type,
    }


class PersonPrincipal(Principal):
    """ Principal based on person/user. """
    principal_id = db.Column(UUIDType, db.ForeignKey('principal.principal_id'),
                             default=uuid.uuid4,
                             primary_key=True)
    person_id = db.Column(UUIDType,
                          db.ForeignKey('person.id'),
                          nullable=False)
    person = db.relationship('Person', back_populates='principal')

    __mapper_args__ = {
        'polymorphic_identity': 'person_principal',
        'inherit_condition': principal_id == Principal.principal_id,
    }


class GroupPrincipal(Principal):
    """ Principal for group memberships. """
    principal_id = db.Column(UUIDType, db.ForeignKey('principal.principal_id'),
                             default=uuid.uuid4,
                             primary_key=True)
    group_id = db.Column(db.String, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'group_principal',
        'inherit_condition': principal_id == Principal.principal_id,
    }


class RolePermission(Base):
    """ Permissions granted by role. """
    code = db.Column(db.String, db.ForeignKey('permission.code'),
                     primary_key=True)
    role = db.Column(db.String, db.ForeignKey('role_list.role'),
                     primary_key=True)


class RoleList(Base):
    """ List of roles in system. """
    role = db.Column(db.String, primary_key=True)
    role_type = db.Column(db.String(50), nullable=False)
    name = db.Column(JSONType, nullable=False)
    perms = db.relationship('Permission',
                            secondary=RolePermission.__table__,
                            back_populates='roles')

    __mapper_args__ = {
        'polymorphic_identity': 'role',
        'polymorphic_on': role_type
    }

    def makerole(self, **kw):
        """Get a matching role."""
        return Role(trait=self, **kw)


class Role(Base):
    """ Roles granted to a principal. """
    grant_id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    role = db.Column(db.String, db.ForeignKey('role_list.role'), nullable=False)
    role_type = db.Column(db.String(50), nullable=False)
    trait = db.relationship('RoleList', foreign_keys=(role, role_type))
    principal_id = db.Column(UUIDType, db.ForeignKey('principal.principal_id'),
                             nullable=False)
    principal = db.relationship('Principal', back_populates='roles')

    __mapper_args__ = {
        'polymorphic_identity': 'role',
        'polymorphic_on': role_type
    }

    def supports(self, perm, **kw):
        return perm in (x.code for x in self.trait.perms)


class OuRoleList(RoleList):
    """ Roles based on OU. """
    role = db.Column(db.String, db.ForeignKey('role_list.role'),
                     primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'ou_role',
        'inherit_condition': role == RoleList.role,
    }

    def makerole(self, **kw):
        """Get a matching role."""
        return OuRole(trait=self, **kw)


class OuRole(Role):
    """ Roles granted to principal on OU. """
    grant_id = db.Column(UUIDType, db.ForeignKey('role.grant_id'),
                         default=uuid.uuid4, primary_key=True)
    role = db.Column(db.String, db.ForeignKey('ou_role_list.role'),
                     nullable=False)
    ou_id = db.Column(UUIDType, db.ForeignKey('organizational_unit.id'),
                      nullable=False)
    ou = db.relationship(OrganizationalUnit)
    principal_id = db.Column(UUIDType, db.ForeignKey('principal.principal_id'),
                             nullable=False)

    db.UniqueConstraint('role', 'ou_id', 'principal_id')

    __mapper_args__ = {
        'polymorphic_identity': 'ou_role',
    }

    def supports(self, perm, ou=None, **kw):
        if ou is None:
            return False
        if self.ou > ou:
            return False
        return super().supports(perm, **kw)


class ElectionRoleList(RoleList):
    """ Roles given on election (group). """
    role = db.Column(String, db.ForeignKey('role_list.role'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'election_role',
        'inherit_condition': role == RoleList.role,
    }

    def makerole(self, **kw):
        """Get a matching role."""
        return ElectionRole(trait=self, **kw)


class ElectionRole(Role):
    """ Roles granted on election. """
    grant_id = db.Column(UUIDType, db.ForeignKey('role.grant_id'),
                         default=uuid.uuid4, primary_key=True)
    role = db.Column(db.String, db.ForeignKey('election_role_list.role'),
                     nullable=False)
    election_id = db.Column(db.String, nullable=False)
    principal_id = db.Column(UUIDType, db.ForeignKey('principal.principal_id'),
                             nullable=False)

    db.UniqueConstraint('role', 'election_id', 'principal_id')

    __mapper_args__ = {
        'polymorphic_identity': 'election_role',
    }

    def supports(self, perm, election_id=None, **kw):
        if election_id != self.election_id:  # or election_id == election group
            return False
        return super().supports(perm, **kw)


class Permission(Base):
    """Permission."""
    code = db.Column(db.String, primary_key=True)
    doc = db.Column(db.String)
    roles = db.relationship('RoleList',
                            secondary=RolePermission.__table__,
                            back_populates='perms')


def get_principals_for(person_id, groups=[]):
    try:
        p = PersonPrincipal.query.filter(
            PersonPrincipal.person_id == person_id).one()
    except:
        p = PersonPrincipal(person_id=person_id)
        PersonPrincipal.session.add(p)
        rg = []
        for grp in groups:
            try:
                rg.append(GroupPrincipal.query
                          .filter(GroupPrincipal.group_id == grp).one())
            except:
                g = GroupPrincipal(group_id=grp)
                GroupPrincipal.session.add(g)
                rg.append(g)
    return p, rg


def list_roles():
    """ List all roles. """
    return RoleList.query.all()


def get_role(role):
    """ Get role. """
    return RoleList.query.filter(RoleList.role == role).one()


def get_principal(principal_id, Principal):
    """ Get principal. """
    return Principal.query.filter(
        Principal.principal_id == principal_id).one()
