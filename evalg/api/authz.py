#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Authorization API. """

from flask import Blueprint
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import ma, docs
from evalg.api import TranslatedString, get_principals, add_all_authz
from evalg.models.authorization import (RoleList, OuRoleList, ElectionRoleList,
                                        Permission)
from ..authorization import (list_perms, list_roles, make_role, update_role,
                             delete_role, add_perm_to_role, get_principal,
                             remove_perm_from_role)
from .person import PersonSchema

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


class RoleSchema(ma.Schema):
    _links = ma.Hyperlinks({
        'self': ma.URLFor('auth.RoleDetail', role='<role>'),
        'collection': ma.URLFor('auth.RolesList'),
    })

    role = fields.Str()
    role_type = fields.Str()
    name = fields.Nested(TranslatedString())
    perms = fields.List(fields.Nested(Perm()))

    class Meta:
        strict = False
        dump_only = ('_links', )


class PrincipalSchema(ma.Schema):
    principal_id = fields.Str()
    principal_type = fields.Str()


class PersonPrincipalSchema(PrincipalSchema):
    person_id = fields.Str()
    person = fields.Nested(PersonSchema())


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
    def get(self, personid):
        princs = get_principals()
        roles = set()
        for p in princs:
            [roles.add(x) for x in p.roles]
        return roles

    @dec(RoleSchema(many=True), args={'role': fields.Str()},
         summary="Add role to user")
    def post(self, personid, role):
        pass


@doc(tags=['auth'])
class UserRolesOu(MethodResource):
    """List of user's roles"""
    @dec(RoleSchema(many=True), summary="List user's roles")
    def get(self, personid, ouid):
        princs = get_principals()
        roles = set()
        for p in princs:
            [roles.add(x) for x in p.roles
             if isinstance(x.trait, OuRoleList) and x.ou.ouid == ouid]
        return roles

    @dec(RoleSchema(many=True), args={'role': fields.Str()},
         summary="Add role to user")
    def post(self, personid, ouid, role):
        pass


@doc(tags=['auth'])
class UserRolesElection(MethodResource):
    """List of user's roles"""
    @dec(RoleSchema(many=True), summary="List user's roles")
    def get(self, personid, electionid):
        princs = get_principals()
        roles = set()
        for p in princs:
            [roles.add(x) for x in p.roles
             if isinstance(x.trait, ElectionRoleList) and x.electionid ==
             electionid]
        return roles

    @dec(RoleSchema(many=True), args={'role': fields.Str()},
         summary="Add role to user")
    def post(self, personid, ouid, role):
        pass

auth_bp.add_url_rule('/auth/user/<uuid:personid>/roles/all/',
                     view_func=UserRoles.as_view('UserRoles'),
                     methods=['GET', 'POST'])
auth_bp.add_url_rule('/auth/user/<uuid:personid>/roles/ous/'
                     '<uuid:ouid>/<role>',
                     view_func=UserRolesOu.as_view('UserRolesOu'),
                     methods=['GET', 'POST'])
auth_bp.add_url_rule('/auth/user/<uuid:personid>/roles/elections/'
                     '<uuid:electionid>/<role>',
                     view_func=UserRolesElection.as_view('UserRolesElection'),
                     methods=['GET', 'POST'])


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


def init_app(app):
    app.register_blueprint(auth_bp)
    docs.spec.add_tag({
        'name': 'auth',
        'description': 'Authorization'
    })
    for x in [PermsList, RolesList, RoleDetail, RolePermsList, UserRoles,
              UserRolesOu, UserRolesElection]:
        docs.register(x, endpoint=x.__name__, blueprint='auth')
