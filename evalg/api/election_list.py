#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The List API. """
from flask import Blueprint, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, ma, docs
from evalg.candidates import (get_list, get_lists, make_list, update)
from evalg.metadata import (get_election)
from evalg.api import BaseSchema, TranslatedString, or404, add_all_authz

bp = Blueprint('lists', __name__)

add_all_authz(globals())
get_list = or404(get_list)
get_election = or404(get_election)


class ElectionListSchema(BaseSchema):
    id = fields.UUID()
    name = fields.Nested(TranslatedString())
    description = fields.Nested(TranslatedString(), allow_none=True)
    information_url = fields.URL(allow_none=True)
    election_id = fields.UUID()
    candidates = fields.List(fields.UUID(attribute='id'),
                             description="Associated candidates")
    _links = ma.Hyperlinks({
        'election': ma.URLFor('elections.ElectionDetail',
                              e_id='<election_id>'),
        'candidates': ma.URLFor('lists.CandidateCollection', id='<id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', '_links')


@doc(tags=['list'])
class ElectionListList(MethodResource):
    @marshal_with(ElectionListSchema(many=True))
    @use_kwargs({'e_id': fields.UUID()}, locations='query')
    @doc(summary='Get a list of electionlists')
    def get(self, e_id):
        e = get_election(e_id)
        return get_lists(e)

    @use_kwargs(ElectionListSchema())
    @marshal_with(ElectionListSchema(), code=201)
    @doc(summary='Create a election list')
    def post(self, election_id, **kwargs):
        e = get_election(election_id)
        l = make_list(e, **kwargs)
        db.session.add(l)
        db.session.commit()
        return (l, 201)


@doc(tags=['list'])
class ElectionListDetail(MethodResource):
    """ Election List API. """
    @marshal_with(ElectionListSchema)
    @use_kwargs({'e_id': fields.UUID()}, locations='query')
    @doc(summary='Get a list')
    def get(self, e_id):
        return get_list(e_id)

    @marshal_with(ElectionListSchema)
    @use_kwargs(ElectionListSchema)
    @doc(summary='Partially update a list')
    def patch(self, id, **kwargs):
        l = get_list(id)
        update(l, **kwargs)
        db.session.commit()
        return l

    @marshal_with(None, code=204)
    @doc(summary='Delete a list')
    def delete(self, id=None):
        l = get_list(id)
        update(l, deleted=True)
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/elections/<uuid:e_id>/lists/',
                view_func=ElectionListList.as_view('ElectionListList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/elections/<uuid:e_id>/lists/<uuid:id>',
                view_func=ElectionListDetail.as_view('ElectionListDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


@doc(tags=['list'])
class CandidateCollection(MethodResource):
    from evalg.api.candidate import CandidateSchema

    @marshal_with(CandidateSchema(many=True))
    @doc(summary='Get a list of associated candidates')
    def get(self, id):
        return filter(lambda c: not c.deleted, get_list(id).candidates)


@doc(tags=['list'])
class ListCandidate(MethodResource):
    from evalg.api.candidate import CandidateSchema

    @marshal_with(CandidateSchema(many=True))
    @doc(summary='Get a list of associated candidates')
    def get(self, lid, id):
        return filter(lambda c: not c.deleted, get_list(id).candidates)

bp.add_url_rule('/elections/<uuid:eid>/lists/<uuid:id>/candidates',
                view_func=CandidateCollection.as_view(
                    'CandidateCollection'),
                methods=['GET'])
bp.add_url_rule('/elections/<uuid:eid>/lists/<uuid:lid>/candidates/<uuid:id>',
                view_func=CandidateCollection.as_view(
                    'ListCandidate'),
                methods=['GET'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'list',
        'description': 'Operations on election lists'
    })
    docs.register(ElectionListList,
                  endpoint='ElectionListList',
                  blueprint='lists')
    docs.register(ElectionListDetail,
                  endpoint='ElectionListDetail',
                  blueprint='lists')
    docs.register(CandidateCollection,
                  endpoint='CandidateCollection',
                  blueprint='lists')
