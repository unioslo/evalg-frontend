#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, make_response, abort, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import db, ma, docs
from evalg.api import BaseSchema, TranslatedString
from evalg.models.election import ElectionGroup, Election

bp = Blueprint('elections', __name__)


class AbstractElectionSchema(BaseSchema):
    id = fields.UUID()
    start = fields.DateTime()
    end = fields.DateTime()
    name = fields.Nested(TranslatedString())
    description = fields.Nested(TranslatedString())
    information_url = fields.URL(allow_none=True)
    contact = fields.Str()
    mandate_period_start = fields.DateTime(allow_none=True)
    mandate_period_end = fields.DateTime(allow_none=True)
    mandate_type = fields.Nested(TranslatedString())
    ou_id = fields.Str()
    public_key = fields.UUID(allow_none=True, attribute='public_key_id')
    meta = fields.Dict()
    type = fields.Str()
    status = fields.Str()
    tz = fields.Str()


class ElectionGroupSchema(AbstractElectionSchema):
    _links = ma.Hyperlinks({
        'self': ma.URLFor('elections.ElectionGroupDetail', eg_id='<id>'),
        'collection': ma.URLFor('elections.ElectionGroupList'),
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
        'self': ma.URLFor('elections.ElectionDetail', e_id='<id>'),
        'collection': ma.URLFor('elections.ElectionList'),
        'group': ma.URLFor('elections.ElectionGroupDetail',
                           eg_id='<group_id>'),
        'lists': ma.URLFor('elections.ListCollection', e_id='<id>'),
        'ou': ma.URLFor('ous.OUDetail', ou_id='<ou_id>')
    })
    list_ids = fields.List(fields.UUID(),
                           description="Associated election lists")
    group_id = fields.Str()
    ou_id = fields.Str()
    group = fields.UUID(attribute='group_id',
                        description="Parent election group")
    nr_of_candidates = fields.Integer()
    nr_of_co_candidates = fields.Integer()
    active = fields.Boolean()

    class Meta:
        strict = True
        dump_only = ('_links', 'id', 'ou_id', 'group', 'tz', 'list_ids', 'status')

eg_schema = ElectionGroupSchema()
e_schema = ElectionSchema()


def get(cls, id):
    e = cls.query.get(id)
    if e is None or e.deleted:
        abort(404)
    else:
        return e


@doc(tags=['electiongroup'])
class ElectionGroupDetail(MethodResource):
    """ Resource for single election groups. """
    @use_kwargs({}, locations="query")
    @marshal_with(eg_schema)
    @doc(summary='Get an election group')
    def get(self, eg_id):
        return get(ElectionGroup, eg_id)

    @use_kwargs(eg_schema)
    @marshal_with(eg_schema)
    @doc(summary='Update an election group')
    def post(self, eg_id, **kwargs):
        group = get(ElectionGroup, eg_id)
        for k, v in kwargs.items():
            setattr(group, k, v)
        db.session.commit()
        return group

    @use_kwargs(ElectionGroupSchema(strict=False))
    @marshal_with(eg_schema)
    @doc(summary='Partially update an election group')
    def patch(self, eg_id, **kwargs):
        group = get(ElectionGroup, eg_id)
        for k, v in kwargs.items():
            try:
                setattr(group, k, v)
            except AttributeError:
                current_app.logger.warn(k)
        db.session.commit()
        return group

    @marshal_with(None, code=204)
    @use_kwargs({},
                locations='query')
    @doc(summary='Delete an election group')
    def delete(self, eg_id):
        group = get(ElectionGroup, eg_id)
        group.deleted = True
        db.session.commit()
        return make_response('', 204)


@doc(tags=['electiongroup'])
class ElectionGroupList(MethodResource):
    """ Resource for election group collections. """
    @use_kwargs({}, locations=['query'])
    @marshal_with(ElectionGroupSchema(many=True))
    @doc(summary='List election groups')
    def get(self):
        return filter(lambda e: not e.deleted, ElectionGroup.query.all())

    @use_kwargs(eg_schema)
    @marshal_with(eg_schema, code=201)
    @doc(summary='Create an election group')
    def post(self, **kwargs):
        group = ElectionGroup(**kwargs)
        group.status = 'draft'
        db.session.add(group)
        db.session.commit()
        return group, 201


@doc(tags=['election'])
class ElectionDetail(MethodResource):
    """ Resource for single elections. """
    @use_kwargs({}, locations="query")
    @marshal_with(e_schema)
    @doc(summary='Get an election')
    def get(self, e_id):
        return get(Election, e_id)

    @use_kwargs(e_schema)
    @marshal_with(e_schema)
    @doc(summary='Update an election')
    def post(self, e_id, **kwargs):
        election = get(Election, e_id)
        for k, v in kwargs.items():
            setattr(election, k, v)
        db.session.commit()
        return election

    @use_kwargs(ElectionSchema(strict=False))
    @marshal_with(e_schema)
    @doc(summary='Partially update an election')
    def patch(self, e_id, **kwargs):
        current_app.logger.info(kwargs)
        election = get(Election, e_id)
        for k, v in kwargs.items():
            if k not in election.read_only_fields:
                setattr(election, k, v)
        db.session.commit()
        return election

    @marshal_with(None, code=204)
    @use_kwargs({}, locations="query")
    @doc(summary='Delete an election')
    def delete(self, e_id):
        election = get(Election, e_id)
        election.deleted = True
        db.session.commit()
        return make_response('', 204)


@doc(tags=['election'])
class ElectionList(MethodResource):
    """ Resource for election collections. """
    @use_kwargs({}, locations=['query'])
    @marshal_with(ElectionSchema(many=True))
    @doc(summary='List elections')
    def get(self):
        return filter(lambda e: not e.deleted, Election.query.all())

    @use_kwargs(e_schema)
    @marshal_with(e_schema)
    @doc(summary='Create an election')
    def post(self, **kwargs):
        current_app.logger.info(kwargs)
        election = Election(**kwargs)
        election.status = 'draft'
        db.session.add(election)
        db.session.commit()
        return election


bp.add_url_rule('/electiongroups/',
                view_func=ElectionGroupList.as_view('ElectionGroupList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/electiongroups/<uuid:eg_id>',
                view_func=ElectionGroupDetail.as_view('ElectionGroupDetail'),
                methods=['GET', 'POST', 'PATCH', 'DELETE'])

bp.add_url_rule('/elections/',
                view_func=ElectionList.as_view('ElectionList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/elections/<uuid:e_id>',
                view_func=ElectionDetail.as_view('ElectionDetail'),
                methods=['GET', 'POST', 'PATCH', 'DELETE'])


@doc(tags=['electiongroup'])
class ElectionCollection(MethodResource):

    @marshal_with(ElectionSchema(many=True))
    @use_kwargs({}, locations='query')
    @doc(summary='Get a list of elections')
    def get(self, eg_id):
        return get(ElectionGroup, eg_id).elections


bp.add_url_rule('/electiongroups/<uuid:eg_id>/elections',
                view_func=ElectionCollection.as_view(
                    'ElectionCollection'),
                methods=['GET'])


@doc(tags=['election'])
class ListCollection(MethodResource):
    from evalg.api.election_list import ElectionListSchema

    @marshal_with(ElectionListSchema(many=True))
    @use_kwargs({}, locations='query')
    @doc(summary='Get a list of lists')
    def get(self, e_id):
        return get(Election, e_id).lists


bp.add_url_rule('/elections/<uuid:e_id>/lists',
                view_func=ListCollection.as_view(
                    'ListCollection'),
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
    docs.register(ElectionGroupList,
                  endpoint='ElectionGroupList',
                  blueprint='elections')
    docs.register(ElectionGroupDetail,
                  endpoint='ElectionGroupDetail',
                  blueprint='elections')
    docs.register(ElectionList,
                  endpoint='ElectionList',
                  blueprint='elections')
    docs.register(ElectionDetail,
                  endpoint='ElectionDetail',
                  blueprint='elections')
    docs.register(ListCollection,
                  endpoint="ListCollection",
                  blueprint="elections")
    docs.register(ElectionCollection,
                  endpoint="ElectionCollection",
                  blueprint="elections")
    # docs.spec.definition('ElectionGroup', schema=ElectionGroupSchema)
