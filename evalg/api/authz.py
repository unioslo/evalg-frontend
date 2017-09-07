#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Authorization API. """

from flask import Blueprint,  make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import ma, docs, db
from evalg.api import TranslatedString, get_principals, add_all_authz, BaseSchema
from evalg.models.person import Person
from evalg.models.group import Group
from evalg.models.authorization import (RoleList, OuRoleList, ElectionRoleList,
                                        ElectionGroupRole, Permission,
                                        PersonPrincipal, GroupPrincipal)
from ..authorization import (list_perms, list_roles, make_role, update_role,
                             delete_role, add_perm_to_role, get_principal,
                             remove_perm_from_role, get_principals_for,
                             make_election_group_role,
                             delete_election_group_role)
from .person import PersonSchema
from .group import GroupSchema

add_all_authz(globals())

auth_bp = Blueprint('auth', __name__)


class Perm(ma.Schema):
    code = fields.Str()


perm_schema = Perm()


def dec(schema=None, locations=['query'], summary='', args={}):
    """Decorate simpler"""
    def fun(f):
        return use_kwargs(args, locations=locations)(
            marshal_with(schema)(
                doc(summary=summary)(
                    f)))
    return fun


@doc(tags=['auth'])
class PermsList(MethodResource):
    """Resource for list of perms."""
    @dec(Perm(many=True), summary='Get all perms')
    def get(self):
        return list_perms()


auth_bp.add_url_rule('/auth/perms/', view_func=PermsList.as_view('PermsList'),
                     methods=['GET'])


class RoleSchema(BaseSchema):
    grant_id = fields.UUID()
    role = fields.Str(allow_none=True)
    role_type = fields.Str(allow_none=True)
    #name = fields.Nested(TranslatedString())
    #perms = fields.List(fields.Nested(Perm()))
    election_id = fields.UUID(allow_none=True)
    person_id = fields.UUID(allow_none=True)
    election_group_id = fields.UUID(allow_none=True)
    group_id = fields.UUID(allow_none=True)
    ou_id = fields.UUID(allow_none=True)

    class Meta:
        strict = False
        dump_only = ('grant_id', 'role_type')

class PrincipalSchema(ma.Schema):
    principal_id = fields.Str()
    principal_type = fields.Str()
    person_id = fields.Str(allow_none=True)
    person = fields.Nested(PersonSchema(), allow_none=True)
    group_id = fields.Str(allow_none=True)
    group = fields.Nested(GroupSchema(), allow_none=True)

class ElectionGroupRoleSchema(RoleSchema):
    principal_id = fields.Str()
    principal = fields.Nested(PrincipalSchema())


class PersonPrincipalSchema(PrincipalSchema):
    person_id = fields.UUID()
    person = fields.Nested(PersonSchema())


class GroupPrincipalSchema(PrincipalSchema):
    group_id = fields.Str()


class UserPrincipalsSchema(ma.Schema):
    person = fields.Nested(PersonPrincipalSchema())
    groups = fields.List(fields.Nested(GroupPrincipalSchema()))


class UserRoleSchema(ma.Schema):
    role = fields.Str()
    trait = fields.Nested(RoleSchema())
    principal = fields.Nested(PrincipalSchema())


role_schema = RoleSchema()


@doc(tags=['auth'])
class RolesList(MethodResource):
    """Resource for list of roles."""
    @dec(RoleSchema(many=True), summary='Get all roles')
    def get(self):
        return list_roles()

    @dec(role_schema, summary='Add role', args=RoleSchema)
    def post(self, roletype=None, **kw):
        if type == 'ou':
            cls = OuRoleList
        elif type == 'election':
            cls = ElectionRoleList
        else:
            cls = RoleList
        return make_role(cls=cls, **kw)

auth_bp.add_url_rule('/auth/roles/', view_func=RolesList.as_view('RolesList'),
                     methods=['GET', 'POST'])


@doc(tags=['auth'])
class RoleDetail(MethodResource):
    """ Resource for single OUs. """
    @dec(role_schema, args={'role': fields.Str()}, summary='Get a role')
    def get(self, role):
        return RoleList.query.get_or_404(role)

    @dec(role_schema, args=role_schema, summary='Update a role')
    def post(self, role, **kwargs):
        role = RoleList.query.get_or_404(role)
        return update_role(role, kwargs)

    @dec(role_schema, args=RoleSchema(strict=False),
         summary='Partially update a role')
    def patch(self, role, **kwargs):
        role = RoleList.query.get_or_404(role)
        return update_role(role, kwargs)

    @doc(summary='Delete a role')
    def delete(self, role):
        delete_role(RoleList.query.get_or_404(role))
        return '', 204


auth_bp.add_url_rule('/auth/roles/<role>',
                     view_func=RoleDetail.as_view('RoleDetail'),
                     methods=['GET', 'POST', 'PATCH', 'DELETE'])


@doc(tags=['auth'])
class RolePermsList(MethodResource):
    """Resource for list of perms."""
    @dec(Perm(many=True), args={'role': fields.Str()},
         summary="Get role's perms")
    def get(self, role):
        return RoleList.query.get_or_404(role).perms

    @dec(Perm(many=True), args={'role': fields.Str(), 'perm': fields.Str()},
         summary="Get role's perms")
    def post(self, role, perm):
        return add_perm_to_role(RoleList.query.get_or_404(role),
                                Permission.query.get_or_404(perm))

    @doc(summary="Remove a perm from role")
    def delete(self, role, perm):
        remove_perm_from_role(RoleList.query.get_or_404(role),
                              Permission.query.get_or_404(perm))
        return '', 204


@doc(tags=['auth'])
class RolePermsDetail(MethodResource):
    """Resource for list of perms."""
    @doc(summary="Remove a perm from role")
    def delete(self, role, perm):
        remove_perm_from_role(RoleList.query.get_or_404(role),
                              Permission.query.get_or_404(perm))
        return '', 204


auth_bp.add_url_rule('/auth/roles/<role>/perms',
                     view_func=RolePermsList.as_view('RolePermsList'),
                     methods=['GET', 'POST'])
auth_bp.add_url_rule('/auth/roles/<role>/perms/<perm>',
                     view_func=RolePermsDetail.as_view('RolePermsDetail'),
                     methods=['DELETE'])


@doc(tags=['auth'])
class UserRoles(MethodResource):
    """List of user's roles"""
    @dec(RoleSchema(many=True), summary="List user's roles")
    def get(self, person_id):
        princs = get_principals()
        roles = set()
        for p in princs:
            [roles.add(x) for x in p.roles]
        return roles

    @dec(RoleSchema(many=True), args={'role': fields.Str()},
         summary="Add role to user")
    def post(self, person_id, role):
        pass


@doc(tags=['auth'])
class UserRolesOu(MethodResource):
    """List of user's roles"""
    @dec(RoleSchema(many=True), summary="List user's roles")
    def get(self, person_id, ouid):
        princs = get_principals()
        roles = set()
        for p in princs:
            [roles.add(x) for x in p.roles
             if isinstance(x.trait, OuRoleList) and x.ou.ouid == ouid]
        return roles

    @dec(RoleSchema(many=True), args={'role': fields.Str()},
         summary="Add role to user")
    def post(self, person_id, ouid, role):
        pass


@doc(tags=['auth'])
class UserRolesElection(MethodResource):
    """List of user's roles"""
    @dec(RoleSchema(many=True), summary="List user's roles")
    def get(self, person_id, election_id):
        princs = get_principals()
        roles = set()
        for p in princs:
            [roles.add(x) for x in p.roles
             if isinstance(x.trait, ElectionRoleList) and x.election_id ==
             election_id]
        return roles

    @dec(RoleSchema(many=True), args={'role': fields.Str()},
         summary="Add role to user")
    def post(self, person_id, election_id, role):
        pass

auth_bp.add_url_rule('/auth/user/<uuid:person_id>/roles/all/',
                     view_func=UserRoles.as_view('UserRoles'),
                     methods=['GET', 'POST'])
auth_bp.add_url_rule('/auth/user/<uuid:person_id>/roles/ous/'
                     '<uuid:ouid>/<role>',
                     view_func=UserRolesOu.as_view('UserRolesOu'),
                     methods=['GET', 'POST'])
auth_bp.add_url_rule('/auth/user/<uuid:person_id>/roles/elections/'
                     '<uuid:election_id>/<role>',
                     view_func=UserRolesElection.as_view('UserRolesElection'),
                     methods=['GET', 'POST'])


@doc(tags=['auth'])
class PersonPrincipalCollection(MethodResource):
    """Get users principals"""
    @dec(UserPrincipalsSchema(),
         summary="List principals")
    def get(self, person_id):
        return dict(zip(('person', 'groups'),
                        get_principals_for(person_id, groups=[
                            # TODO: Get groups from dataporten
                        ])))

auth_bp.add_url_rule('/auth/user/<uuid:person_id>/principals/',
                     view_func=PersonPrincipalCollection.as_view(
                         'PersonPrincipalCollection'),
                     methods=['GET'])


@doc(tags=['auth'])
class PersonPrincipalDetail(MethodResource):
    """List of user's roles"""
    @dec(PersonPrincipalSchema(), summary="Get principal")
    def get(self, principal_id):
        return get_principal(principal_id)


auth_bp.add_url_rule('/auth/principals/person/<uuid:principal_id>/',
                     view_func=PersonPrincipalDetail.as_view(
                         'PersonPrincipalDetail'),
                     methods=['GET'])

@doc(tags=['auth'])
class ElectionGroupRoleCollection(MethodResource):
    @dec(ElectionGroupRoleSchema(), summary="Create an ElectionGroupRole",
         locations=None, args=RoleSchema())
    def post(self, election_group_id, role, person_id=None, group_id=None):
        el_grp_role = make_election_group_role(election_group_id,
                                               role,
                                               person_id,
                                               group_id)
        return el_grp_role, 201

auth_bp.add_url_rule('/electiongrouproles/',
                     view_func=ElectionGroupRoleCollection.as_view(
                         'ElectionGroupRoleCollection'
                     ),
                     methods=['POST'])

@doc(tags=['auth'])
class ElectionGroupRoleDetail(MethodResource):
    """List of user's roles"""
    @dec(RoleSchema(), summary="Delete ElectionGroupRole")
    def delete(self, role_id):
        delete_election_group_role(role_id)
        return make_response('', 204)


auth_bp.add_url_rule('/electiongrouproles/<uuid:role_id>/',
                     view_func=ElectionGroupRoleDetail.as_view(
                         'ElectionGroupRoleDetail'),
                     methods=['DELETE'])


def init_app(app):
    app.register_blueprint(auth_bp)
    docs.spec.add_tag({
        'name': 'auth',
        'description': 'Authorization'
    })
    for x in [PermsList, RolesList, RoleDetail, RolePermsList, UserRoles,
              UserRolesOu, UserRolesElection, PersonPrincipalDetail,
              PersonPrincipalCollection, ElectionGroupRoleDetail,
              ElectionGroupRoleCollection]:
        docs.register(x, endpoint=x.__name__, blueprint='auth')