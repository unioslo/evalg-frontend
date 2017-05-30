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

    __tablename__ = 'principal'
    principalid = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    principaltype = db.Column(String, nullable=False)
    roles = db.relationship('Role', back_populates='principal')

    __mapper_args__ = {
        'polymorphic_identity': 'principal',
        'polymorphic_on': principaltype,
    }


class PersonPrincipal(Principal):
    """ Principal based on person/user. """

    __tablename__ = 'personprincipal'
    principalid = db.Column(UUIDType, db.ForeignKey('principal.principalid'),
                            default=uuid.uuid4,
                            primary_key=True)
    personid = db.Column(String, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'personprincipal',
        'inherit_condition': principalid == Principal.principalid,
    }


class GroupPrincipal(Principal):
    """ Principal for group memberships. """

    __tablename__ = 'groupprincipal'
    principalid = db.Column(UUIDType, db.ForeignKey('principal.principalid'),
                            default=uuid.uuid4,
                            primary_key=True)
    groupid = db.Column(db.String, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'groupprincipal',
        'inherit_condition': principalid == Principal.principalid,
    }


class RolePermission(Base):
    """ Permissions granted by role. """

    __tablename__ = 'rolepermission'
    code = db.Column(db.String, db.ForeignKey('permission.code'),
                     primary_key=True)
    role = db.Column(db.String, db.ForeignKey('rolelist.role'),
                     primary_key=True)


class RoleList(Base):
    """ List of roles in system. """

    __tablename__ = 'rolelist'
    role = db.Column(db.String, primary_key=True)
    roletype = db.Column(db.String(50), nullable=False)
    name = db.Column(JSONType, nullable=False)
    perms = db.relationship('Permission',
                            secondary=RolePermission.__table__,
                            back_populates='roles')

    __mapper_args__ = {
        'polymorphic_identity': 'role',
        'polymorphic_on': roletype
    }

    def makerole(self, **kw):
        """Get a matching role."""
        return Role(trait=self, **kw)


class Role(Base):
    """ Roles granted to a principal. """

    __tablename__ = 'role'
    role = db.Column(db.String, db.ForeignKey('rolelist.role'),
                     primary_key=True)
    trait = db.relationship('RoleList', foreign_keys=role)
    roletype = db.Column(db.String(50), db.ForeignKey('rolelist.roletype'))
    principalid = db.Column(UUIDType, db.ForeignKey('principal.principalid'),
                            primary_key=True)
    principal = db.relationship('Principal', back_populates='roles')

    __mapper_args__ = {
        'polymorphic_identity': 'role',
        'polymorphic_on': roletype
    }

    def supports(self, perm, **kw):
        return perm in (x.code for x in self.trait.perms)


class OuRoleList(RoleList):
    """ Roles based on OU. """

    __tablename__ = 'ourolelist'
    role = db.Column(db.String, db.ForeignKey('rolelist.role'),
                     primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'ourole',
        'inherit_condition': role == RoleList.role,
    }

    def makerole(self, **kw):
        """Get a matching role."""
        return OuRole(trait=self, **kw)


class OuRole(Role):
    """ Roles granted to principal on OU. """

    __tablename__ = 'ourole'
    role = db.Column(db.String, db.ForeignKey('ourolelist.role'),
                     primary_key=True)
    ouid = db.Column(UUIDType, db.ForeignKey('organizational_unit.id'),
                     primary_key=True)
    ou = db.relationship(OrganizationalUnit)
    principalid = db.Column(db.String, db.ForeignKey('principal.principalid'),
                            primary_key=True)
    __mapper_args__ = {
        'polymorphic_identity': 'ourole',
        'inherit_condition': role == Role.role,
    }

    def supports(self, perm, ou=None, **kw):
        if ou is None:
            return False
        if self.ou > ou:
            return False
        return super().supports(perm, **kw)


class ElectionRoleList(RoleList):
    """ Roles given on election (group). """

    __tablename__ = 'electionrolelist'
    role = db.Column(String, db.ForeignKey('rolelist.role'), primary_key=True)

    __mapper_args__ = {
        'polymorphic_identity': 'electionrole',
        'inherit_condition': role == RoleList.role,
    }

    def makerole(self, **kw):
        """Get a matching role."""
        return ElectionRole(trait=self, **kw)


class ElectionRole(Role):
    """ Roles granted on election. """

    __tablename__ = 'electionrole'
    role = db.Column(db.String, db.ForeignKey('electionrolelist.role'),
                     primary_key=True)
    electionid = db.Column(db.String, primary_key=True)
    principalid = db.Column(db.String, db.ForeignKey('principal.principalid'),
                            primary_key=True)
    __mapper_args__ = {
        'polymorphic_identity': 'electionrole',
        'inherit_condition': role == Role.role,
    }

    def supports(self, perm, electionid=None, **kw):
        if electionid != self.electionid:  # or electionid == election group
            return False
        return super().supports(perm, **kw)


class Permission(Base):
    """Permission."""

    __tablename__ = 'permission'
    code = db.Column(db.String, primary_key=True)
    doc = db.Column(db.String)
    roles = db.relationship('RoleList',
                            secondary=RolePermission.__table__,
                            back_populates='perms')


def get_principals_for(session, personid, groups=[]):
    try:
        p = session.query(PersonPrincipal).filter(
            PersonPrincipal.personid == personid).one()
    except:
        p = PersonPrincipal(personid=personid)
        session.add(p)
        rg = []
        for grp in groups:
            try:
                rg.append(session.query(GroupPrincipal)
                          .filter(GroupPrincipal.groupid == grp).one())
            except:
                g = GroupPrincipal(groupid=grp)
                session.add(g)
                rg.append(g)
    return p, rg


def list_roles(session):
    """ List all roles. """
    return session.query(RoleList).all()


def get_role(session, role):
    """ Get role. """
    return session.query(RoleList).filter(RoleList.role == role).one()


def get_principal(session, principalid):
    """ Get principal. """
    return session.query(Principal).filter(
        Principal.principalid == principalid).one()
