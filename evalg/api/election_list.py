#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The List API. """
from flask import Blueprint, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, docs
from evalg.candidates import (get_list, get_lists, make_list, update,
                              get_candidate)
from evalg.metadata import (get_election)
from evalg.api import BaseSchema, TranslatedString, add_all_authz
from evalg.api.candidate import CandidateSchema


bp = Blueprint('lists', __name__)

add_all_authz(globals())


class ElectionListSchema(BaseSchema):
    id = fields.UUID()
    name = fields.Nested(TranslatedString())
    description = fields.Nested(TranslatedString(), allow_none=True)
    information_url = fields.URL(allow_none=True)
    election_id = fields.UUID()
    candidates = fields.List(fields.UUID(attribute='id'),
                             description="Associated candidates")
    candidate_ids = fields.List(fields.UUID())

    class Meta:
        strict = True
        dump_only = ('id',)


@doc(tags=['list'])
class ElectionList(MethodResource):
    @use_kwargs(ElectionListSchema())
    @marshal_with(ElectionListSchema(), code=201)
    @doc(summary='Create an election list')
    def post(self, **kwargs):
        election_id = kwargs.get('election_id', None)
        election = get_election(election_id)
        li = make_list(election, **kwargs)
        db.session.add(li)
        db.session.commit(li)
        return (li, 201)


@doc(tags=['list'])
class ElectionListDetail(MethodResource):
    """ Election List API. """
    @marshal_with(ElectionListSchema)
    @doc(summary='Get a list')
    def get(self, list_id):
        return get_list(list_id)

    @use_kwargs(ElectionListSchema())
    @marshal_with(ElectionListSchema(), code=201)
    @doc(summary='Create an election list')
    def post(self, **kwargs):
        election_id = kwargs.get('election_id')
        election = get_election(election_id)
        li = make_list(election, **kwargs)
        db.session.add(li)
        db.session.commit(li)
        return (li, 201)

    @marshal_with(ElectionListSchema)
    @use_kwargs(ElectionListSchema)
    @doc(summary='Partially update a list')
    def patch(self, list_id, **kwargs):
        li = get_list(list_id)
        update(li, **kwargs)
        db.session.commit()
        return li

    @marshal_with(None, code=204)
    @doc(summary='Delete a list')
    def delete(self, list_id=None):
        li = get_list(list_id)
        update(li, deleted=True)
        db.session.commit()
        return make_response('', 204)


@doc(tags=['list'])
class ListCandidateCollection(MethodResource):
    @marshal_with(CandidateSchema(many=True))
    @doc(summary='Get a list of associated candidates')
    def get(self, list_id):
        candidates = get_list(list_id).candidates
        return filter(lambda c: not c.deleted, candidates)

bp.add_url_rule('/lists/',
                view_func=ElectionList.as_view('ElectionList'),
                methods=['POST'])
bp.add_url_rule('/lists/<uuid:list_id>',
                view_func=ElectionListDetail.as_view('ElectionListDetail'),
                methods=['GET', 'PATCH', 'DELETE'])
bp.add_url_rule('/lists/<uuid:list_id>/candidates/',
                view_func=ListCandidateCollection.as_view(
                    'ListCandidateCollection'),
                methods=['GET'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'list',
        'description': 'Operations on election lists'
    })
    docs.register(ElectionListDetail,
                  endpoint='ElectionListDetail',
                  blueprint='lists')
    docs.register(ListCandidateCollection,
                  endpoint='ListCandidateCollection',
                  blueprint='lists')
