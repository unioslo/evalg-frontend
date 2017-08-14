#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields, validates_schema, ValidationError
from evalg import db, ma, docs
from evalg.api import BaseSchema, TranslatedString, add_all_authz
from ..metadata import (get_group, update_election,
                        update_group, get_election, delete_group,
                        delete_election, list_groups, list_elections,
                        make_group, make_election)

bp = Blueprint('elections', __name__)


add_all_authz(globals())


class AbstractElectionSchema(BaseSchema):
    id = fields.UUID()
    start = fields.DateTime()
    end = fields.DateTime()
    name = fields.Nested(TranslatedString())
    description = fields.Nested(TranslatedString(), allow_none=True)
    information_url = fields.URL(allow_none=True)
    contact = fields.Str(allow_none=True)
    mandate_period_start = fields.DateTime(allow_none=True)
    mandate_period_end = fields.DateTime(allow_none=True)
    mandate_type = fields.Nested(TranslatedString(), allow_none=True)
    ou_id = fields.UUID()
    public_key = fields.UUID(allow_none=True, attribute='public_key_id')
    meta = fields.Dict(allow_none=True)
    type = fields.Str(allow_none=True)
    status = fields.Str()
    tz = fields.Str()

    @validates_schema
    def validate_start_before_end(self, data):
        if not data.get('start') or not data.get('end'):
            return
        if data['start'] > data['end']:
            raise ValidationError('Start date must be before end date',
                                  ('start', 'end'))


class ElectionGroupSchema(AbstractElectionSchema):
    _links = ma.Hyperlinks({
        'self': ma.URLFor('elections.ElectionGroupDetail', group_id='<id>'),
        'collection': ma.URLFor('elections.ElectionGroupCollection'),
        'ou': ma.URLFor('ous.OUDetail', ou_id='<ou_id>')
    })

    elections = fields.List(fields.UUID(attribute='id'),
                            description="Associated elections")
    has_multiple_elections = fields.Boolean()
    has_multiple_voting_times = fields.Boolean()
    has_multiple_mandate_times = fields.Boolean()
    has_multiple_contact_info = fields.Boolean()
    has_multiple_info_urls = fields.Boolean()
    has_gender_quota = fields.Boolean()

    class Meta:
        strict = True
        dump_only = ('_links', 'id', 'elections', 'tz', 'status')


class ElectionSchema(AbstractElectionSchema):
    _links = ma.Hyperlinks({
        'self': ma.URLFor('elections.ElectionDetail', election_id='<id>',
                          group_id='<group_id>'),
        'collection': ma.URLFor('elections.ElectionCollection',
                                group_id='<group_id>'),
        'group': ma.URLFor('elections.ElectionGroupDetail',
                           group_id='<group_id>'),
        'lists': ma.URLFor('elections.ElectionListCollection', election_id='<id>',
                           group_id='<group_id>'),
        'ou': ma.URLFor('ous.OUDetail', ou_id='<ou_id>')
    })
    list_ids = fields.List(fields.UUID(),
                           description="Associated election lists")
    group_id = fields.Str()
    ou_id = fields.UUID()
    group = fields.UUID(attribute='group_id',
                        description="Parent election group")
    nr_of_candidates = fields.Integer(allow_none=True)
    nr_of_co_candidates = fields.Integer(allow_none=True)
    active = fields.Boolean()
    pollbook_ids = fields.List(fields.UUID)

    class Meta:
        strict = True
        dump_only = ('_links', 'id', 'ou_id', 'group', 'tz', 'list_ids',
                     'status', 'pollbook_ids')


class ElectionPollbooksSchema(BaseSchema):
    pollbooks = fields.List(fields.UUID(attribute='id'))

    class Meta:
        strict = True
        dump_only = ('pollbooks')


eg_schema = ElectionGroupSchema()
e_schema = ElectionSchema()


@doc(tags=['electiongroup'])
class ElectionGroupDetail(MethodResource):
    """ Resource for single election groups. """
    @marshal_with(eg_schema)
    @doc(summary='Get an election group')
    def get(self, group_id):
        return get_group(group_id)

    @use_kwargs(eg_schema)
    @marshal_with(eg_schema)
    @doc(summary='Update an election group')
    def post(self, group_id, **kwargs):
        group = get_group(group_id)
        return update_group(group, **kwargs)

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
        group.status = 'draft'  # TODO: move to make_group
        db.session.add(group)
        db.session.commit()
        return group, 201


@doc(tags=['election'])
class ElectionDetail(MethodResource):
    """ Resource for single elections. """
    @marshal_with(e_schema)
    @doc(summary='Get an election')
    def get(self, election_id, group_id=None):
        return get_election(election_id)

    @use_kwargs(e_schema)
    @marshal_with(e_schema)
    @doc(summary='Update an election')
    def post(self, election_id, **kwargs):
        election = get_election(election_id)
        update_election(election, **kwargs)  # TODO: Read only attrs
        return election

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
class ElectionCollection(MethodResource):
    """ Resource for election collections. """
    @marshal_with(ElectionSchema(many=True))
    @doc(summary='List elections')
    def get(self, group_id=None):
        return list_elections(group_id and get_group(group_id))

    @use_kwargs(e_schema)
    @marshal_with(e_schema)
    @doc(summary='Create an election')
    def post(self, group_id=None, **kwargs):
        grp = get_group(group_id) if group_id is not None else None
        election = make_election(group=grp, **kwargs)
        election.status = 'draft'  # TODO: move to make_election
        db.session.add(election)
        db.session.commit()
        return election


bp.add_url_rule('/electiongroups/',
                view_func=ElectionGroupCollection.as_view('ElectionGroupCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/electiongroups/<uuid:group_id>',
                view_func=ElectionGroupDetail.as_view('ElectionGroupDetail'),
                methods=['GET', 'POST', 'PATCH', 'DELETE'])

bp.add_url_rule('/elections/',
                view_func=ElectionCollection.as_view('ElectionCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/electiongroups/<uuid:group_id>/elections/',
                view_func=ElectionCollection.as_view('ElectionGroupElectionCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/elections/<uuid:election_id>',
                view_func=ElectionDetail.as_view('ElectionDetail'),
                methods=['GET', 'POST', 'PATCH', 'DELETE'])


@doc(tags=['election'])
class ElectionListCollection(MethodResource):
    from evalg.api.election_list import ElectionListSchema

    @marshal_with(ElectionListSchema(many=True))
    @doc(summary='Get a list of lists')
    def get(self, election_id, group_id=None):
        return get_election(election_id).lists


bp.add_url_rule('/elections/<uuid:election_id>/lists/',
                view_func=ElectionListCollection.as_view(
                    'ElectionListCollection'),
                methods=['GET'])


@doc(tags=['election'])
class ElectionPollbooks(MethodResource):
    @marshal_with(ElectionPollbooksSchema())
    @doc(summary='Get associated pollbooks')
    def get(self, election_id):
        return {'pollbooks': get_election(election_id).pollbooks}

bp.add_url_rule('/elections/<uuid:election_id>/pollbooks/',
                view_func=ElectionPollbooks.as_view(
                    'ElectionPollbooks'),
                methods=['GET'])


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
    docs.register(ElectionListCollection,
                  endpoint="ElectionListCollection",
                  blueprint="elections")
    docs.register(ElectionPollbooks,
                  endpoint="ElectionPollbooks",
                  blueprint="elections")
    docs.spec.definition('ElectionGroup', schema=ElectionGroupSchema)
