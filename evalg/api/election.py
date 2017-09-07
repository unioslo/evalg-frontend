#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, make_response, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import db, docs
from evalg.api import BaseSchema, TranslatedString, add_all_authz, BadRequest
from evalg.api.authz import ElectionGroupRoleSchema
from ..metadata import (get_group, update_election,
                        announce_group, unannounce_group,
                        publish_group, unpublish_group,
                        update_group, get_election, delete_group,
                        delete_election, list_groups, list_elections,
                        make_group, make_election,
                        group_announcement_blockers,
                        group_publication_blockers)
from ..authorization import (list_election_roles, get_role, grant_role,
                             get_grant, delete_grant, list_election_group_roles)
from ..models.authorization import ElectionRoleList

bp = Blueprint('elections', __name__)


add_all_authz(globals())


class AbstractElectionSchema(BaseSchema):
    id = fields.UUID()
    name = fields.Nested(TranslatedString())
    description = fields.Nested(TranslatedString(), allow_none=True)
    mandate_type = fields.Nested(TranslatedString(), allow_none=True)
    meta = fields.Dict(allow_none=True)
    type = fields.Str(allow_none=True)
    status = fields.Str()
    tz = fields.Str()


class ElectionGroupSchema(AbstractElectionSchema):
    elections = fields.List(fields.UUID(attribute='id'),
                            description="UUIDs of associated elections")
    roles = fields.Nested(ElectionGroupRoleSchema(), many=True)
    public_key = fields.Str(description="Public election key")
    announced = fields.Boolean(description="Marked as announced")
    published = fields.Boolean(description="Marked as published")
    announcement_blockers = fields.Function(
        serialize=group_announcement_blockers)
    publication_blockers = fields.Function(
        serialize=group_publication_blockers)

    class Meta:
        strict = True
        dump_only = ('id', 'elections', 'tz', 'status', 'roles',
                     'announced', 'published',
                     'announcement_blockers', 'publication_blockers')


class ElectionSchema(AbstractElectionSchema):
    start = fields.DateTime(allow_none=True)
    end = fields.DateTime(allow_none=True)
    mandate_period_start = fields.DateTime(allow_none=True)
    mandate_period_end = fields.DateTime(allow_none=True)
    contact = fields.Str(allow_none=True)
    information_url = fields.URL(allow_none=True)
    status = fields.Str()
    lists = fields.List(fields.UUID(attribute='id'),
                        description="UUIDs of associated election lists")
    ou_id = fields.UUID(attribute='ou_id',
                        description="Associated OU")
    group_id = fields.UUID(attribute='group_id',
                           description="Parent election group")
    active = fields.Boolean()
    pollbooks = fields.List(fields.UUID(attribute='id'),
                            description="Associated pollbooks")

    class Meta:
        strict = True
        dump_only = ('id', 'ou', 'group', 'tz', 'lists',
                     'status', 'pollbooks')


class ElectionPollbooksSchema(BaseSchema):
    pollbooks = fields.List(fields.UUID(attribute='id'))

    class Meta:
        strict = True
        dump_only = ('pollbooks')


class ElectionRoleSchema(BaseSchema):
    role = fields.Str()
    principal_type = fields.Str(attribute='principal.principal_type')
    principal = fields.UUID(attribute='principal.principal_id')

    class Meta:
        strict = True


eg_schema = ElectionGroupSchema()
e_schema = ElectionSchema()


@doc(tags=['electiongroup'])
class ElectionGroupCollection(MethodResource):
    """ Resource for election group collections. """
    @marshal_with(ElectionGroupSchema(many=True))
    @doc(summary='List election groups')
    def get(self):
        return list_groups()

    @use_kwargs(eg_schema)
    @marshal_with(eg_schema, code=201)
    @doc(summary='Create an election group')
    def post(self, **kwargs):
        group = make_group(**kwargs)
        db.session.add(group)
        db.session.commit()
        return group, 201


@doc(tags=['electiongroup'])
class ElectionGroupDetail(MethodResource):
    """ Resource for single election groups. """
    @marshal_with(eg_schema)
    @doc(summary='Get an election group')
    def get(self, group_id):
        return get_group(group_id)

    @use_kwargs(eg_schema)
    @marshal_with(eg_schema)
    @doc(summary='Partially update an election group')
    def patch(self, group_id, **kwargs):
        group = get_group(group_id)
        return update_group(group, **kwargs)

    @marshal_with(None, code=204)
    @doc(summary='Delete an election group')
    def delete(self, group_id):
        delete_group(get_group(group_id))
        return make_response('', 204)


@doc(tags=['electiongroup'])
class ElectionGroupAnnounce(MethodResource):
    """ Resource for announcing an election. """
    @marshal_with(eg_schema)
    @doc(summary='Announce an election group')
    def post(self, group_id):
        group = get_group(group_id)
        announce_group(group)
        return group

    @marshal_with(eg_schema)
    @doc(summary='Unannounce an election group')
    def delete(self, group_id):
        group = get_group(group_id)
        unannounce_group(group)
        return group


@doc(tags=['electiongroup'])
class ElectionGroupPublish(MethodResource):
    """ Resource for publishing an election. """
    @marshal_with(eg_schema)
    @doc(summary='Publish an election group')
    def post(self, group_id):
        group = get_group(group_id)
        publish_group(group)
        return group

    @marshal_with(eg_schema)
    @doc(summary='Unpublish an election group')
    def delete(self, group_id):
        group = get_group(group_id)
        unpublish_group(group)
        return group


@doc(tags=['election'])
class ElectionGroupElectionCollection(MethodResource):
    """ Resource for getting elections associated with an election group. """
    @marshal_with(ElectionSchema(many=True))
    @doc(summary='List elections')
    def get(self, group_id):
        return list_elections(get_group(group_id))


@doc(tags=['electiongroup'])
class GroupRoleCollection(MethodResource):
    @marshal_with(ElectionRoleSchema(many=True))
    @doc(summary='Get roles set on election')
    def get(self, group_id):
        return list_election_group_roles(get_group(group_id))

    @marshal_with(ElectionRoleSchema(many=True))
    @use_kwargs(ElectionRoleSchema())
    @doc(summary='Set role on election')
    def patch(self, group_id, role=None, principal_type=None, principal=None):
        grp = get_group(group_id)
        lst = get_role(role)
        if not isinstance(lst, ElectionRoleList):
            raise BadRequest('given role is not an election role')
        grant_role(lst, group_id=grp.id, principal_id=principal['principal_id'])
        return list_election_group_roles(grp)


@doc(tags=['electiongroup'])
class GroupRoleDetail(MethodResource):
    @marshal_with(ElectionRoleSchema())
    @doc(summary='Get roles set on election')
    def get(self, group_id, role, principal_type, principal):
        return get_grant(role, principal_type=principal_type,
                         principal_id=principal, group_id=group_id)

    @marshal_with(ElectionRoleSchema())
    @doc(summary='Set role on election')
    def put(self, group_id, role, principal_type, principal):
        grp = get_group(group_id)
        lst = get_role(role)
        if not isinstance(lst, ElectionRoleList):
            raise BadRequest('given role is not an election role')
        return grant_role(lst, group_id=grp.id,
                          principal_id=principal)

    @marshal_with(None, code=204)
    @doc(summary='Set role on election')
    def delete(self, group_id, role=None, principal_type=None, principal=None):
        grp = get_group(group_id)
        lst = get_role(role)
        if not isinstance(lst, ElectionRoleList):
            raise BadRequest('given role is not an election role')
        grant = get_grant(lst, principal_type=principal_type,
                          group_id=grp.id, principal_id=principal)
        delete_grant(grant)
        return make_response('', 204)


bp.add_url_rule('/electiongroups/',
                view_func=ElectionGroupCollection.as_view(
                    'ElectionGroupCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/electiongroups/<uuid:group_id>',
                view_func=ElectionGroupDetail.as_view('ElectionGroupDetail'),
                methods=['GET', 'PATCH', 'DELETE'])
bp.add_url_rule('/electiongroups/<uuid:group_id>/elections/',
                view_func=ElectionGroupElectionCollection.as_view(
                    'ElectionGroupElectionCollection'),
                methods=['GET'])
bp.add_url_rule('/electiongroups/<uuid:group_id>/announce',
                view_func=ElectionGroupAnnounce.as_view(
                    'ElectionGroupAnnounce'),
                methods=['POST', 'DELETE'])
bp.add_url_rule('/electiongroups/<uuid:group_id>/publish',
                view_func=ElectionGroupPublish.as_view(
                    'ElectionGroupPublish'),
                methods=['POST', 'DELETE'])
bp.add_url_rule('/electiongroups/<uuid:group_id>/permissions/',
                view_func=GroupRoleCollection.as_view('GroupRoleCollection'),
                methods=['GET', 'PATCH'])
bp.add_url_rule('/electiongroups/<uuid:group_id>/permissions/roles/<role>/'
                '<principal_type>/<uuid:principal>',
                view_func=GroupRoleDetail.as_view('GroupRoleDetail'),
                methods=['GET', 'PUT', 'DELETE'])


@doc(tags=['election'])
class ElectionCollection(MethodResource):
    """ Resource for election collections. """
    @marshal_with(ElectionSchema(many=True))
    @doc(summary='List elections')
    def get(self):
        return list_elections()

    @use_kwargs(e_schema)
    @marshal_with(e_schema)
    @doc(summary='Create an election')
    def post(self, group_id=None, **kwargs):
        grp = get_group(group_id) if group_id is not None else None
        election = make_election(group=grp, **kwargs)
        db.session.add(election)
        db.session.commit()
        return election


@doc(tags=['election'])
class ElectionDetail(MethodResource):
    """ Resource for single elections. """
    @marshal_with(e_schema)
    @doc(summary='Get an election')
    def get(self, election_id, group_id=None):
        return get_election(election_id)

    @use_kwargs(e_schema)
    @marshal_with(e_schema)
    @doc(summary='Partially update an election')
    def patch(self, election_id, **kwargs):
        election = get_election(election_id)
        update_election(election, **kwargs)
        return election

    @marshal_with(None, code=204)
    @doc(summary='Delete an election')
    def delete(self, election_id):
        election = get_election(election_id)
        delete_election(election)
        return make_response('', 204)


@doc(tags=['election'])
class ElectionListCollection(MethodResource):
    from evalg.api.election_list import ElectionListSchema

    @marshal_with(ElectionListSchema(many=True))
    @doc(summary='Get a list of lists')
    def get(self, election_id):
        return get_election(election_id).lists


@doc(tags=['election'])
class ElectionPollbooks(MethodResource):
    @marshal_with(ElectionPollbooksSchema())
    @doc(summary='Get associated pollbooks')
    def get(self, election_id):
        return {'pollbooks': get_election(election_id).pollbooks}


@doc(tags=['election'])
class ElectionRoleCollection(MethodResource):
    @marshal_with(ElectionRoleSchema(many=True))
    @doc(summary='Get roles set on election')
    def get(self, election_id):
        return list_election_roles(get_election(election_id))

    @marshal_with(ElectionRoleSchema(many=True))
    @use_kwargs(ElectionRoleSchema())
    @doc(summary='Set role on election')
    def patch(self, election_id, role=None,
              principal_type=None, principal=None):
        lst = get_role(role)
        if not isinstance(lst, ElectionRoleList):
            raise BadRequest('given role is not an election role')
        grant_role(lst, election_id=election_id,
                   principal_id=principal['principal_id'])
        return list_election_roles(get_election(election_id))


@doc(tags=['election'])
class ElectionRoleDetail(MethodResource):
    @marshal_with(ElectionRoleSchema())
    @doc(summary='Get roles set on election')
    def get(self, election_id, role, principal_type, principal):
        return get_grant(get_role(role), principal_type=principal_type,
                         principal_id=principal, election_id=election_id)

    @marshal_with(ElectionRoleSchema())
    @doc(summary='Set role on election')
    def put(self, election_id, role, principal_type, principal):
        e = get_election(election_id)
        lst = get_role(role)
        if not isinstance(lst, ElectionRoleList):
            raise BadRequest('given role is not an election role')
        return grant_role(lst, election_id=e.id, principal_id=principal)

    @marshal_with(None, code=204)
    @doc(summary='Set role on election')
    def delete(self, election_id, role=None, principal_type=None,
               principal=None):
        e = get_election(election_id)
        lst = get_role(role)
        if not isinstance(lst, ElectionRoleList):
            raise BadRequest('given role is not an election role')
        grant = get_grant(lst, principal_type=principal_type,
                          election_id=e.id, principal_id=principal)
        delete_grant(grant)
        return make_response('', 204)


bp.add_url_rule('/elections/',
                view_func=ElectionCollection.as_view('ElectionCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/elections/<uuid:election_id>',
                view_func=ElectionDetail.as_view('ElectionDetail'),
                methods=['GET', 'PATCH', 'DELETE'])

bp.add_url_rule('/elections/<uuid:election_id>/pollbooks/',
                view_func=ElectionPollbooks.as_view(
                    'ElectionPollbooks'),
                methods=['GET'])
bp.add_url_rule('/elections/<uuid:election_id>/lists/',
                view_func=ElectionListCollection.as_view(
                    'ElectionListCollection'),
                methods=['GET'])
bp.add_url_rule('/elections/<uuid:election_id>/permissions/',
                view_func=ElectionRoleCollection.as_view(
                    'ElectionRoleCollection'),
                methods=['GET', 'PATCH', 'DELETE'])
bp.add_url_rule('/elections/<uuid:election_id>/permissions/roles/<role>/'
                '<principal_type>/<uuid:principal>',
                view_func=ElectionRoleDetail.as_view('ElectionRoleDetail'),
                methods=['GET', 'PUT', 'DELETE'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'electiongroup',
        'description': 'Election groups'
    })
    docs.spec.add_tag({
        'name': 'election',
        'description': 'Elections'
    })
    docs.register(ElectionGroupCollection,
                  endpoint='ElectionGroupCollection',
                  blueprint='elections')
    docs.register(ElectionGroupDetail,
                  endpoint='ElectionGroupDetail',
                  blueprint='elections')
    docs.register(ElectionCollection,
                  endpoint='ElectionCollection',
                  blueprint='elections')
    docs.register(ElectionDetail,
                  endpoint='ElectionDetail',
                  blueprint='elections')
    docs.register(ElectionGroupAnnounce,
                  endpoint='ElectionGroupAnnounce',
                  blueprint='elections')
    docs.register(ElectionGroupPublish,
                  endpoint='ElectionGroupPublish',
                  blueprint='elections')
    docs.register(ElectionListCollection,
                  endpoint="ElectionListCollection",
                  blueprint="elections")
    docs.register(ElectionPollbooks,
                  endpoint="ElectionPollbooks",
                  blueprint="elections")
    docs.register(GroupRoleCollection,
                  endpoint='GroupRoleCollection',
                  blueprint='elections')
    docs.register(GroupRoleDetail,
                  endpoint='GroupRoleDetail',
                  blueprint='elections')
    docs.register(ElectionRoleCollection,
                  endpoint='ElectionRoleCollection',
                  blueprint='elections')
    docs.register(ElectionRoleDetail,
                  endpoint='ElectionRoleDetail',
                  blueprint='elections')
    docs.spec.definition('ElectionGroup', schema=ElectionGroupSchema)
