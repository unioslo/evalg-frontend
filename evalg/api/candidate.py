#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate API. """
from flask import Blueprint, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import ma, db, docs
from evalg.candidates import (get_candidate, get_candidates, make_candidate,
                              make_cocandidate, get_cocandidate, update,
                              get_cocandidates)
from evalg.api import BaseSchema, add_all_authz

bp = Blueprint('candidates', __name__)

add_all_authz(globals())


class CandidateSchema(BaseSchema):
    id = fields.UUID()
    name = fields.String()
    list_id = fields.UUID()
    meta = fields.Dict(allow_none=True)
    information_url = fields.URL(allow_none=True)
    priority = fields.Integer()
    cumulated = fields.Boolean()
    co_candidate_ids = fields.List(fields.UUID(),
                                   description="Associated co-candidates")

    class Meta:
        strict = True
        dump_only = ('id', 'co_candidate_ids')



class CoCandidateSchema(BaseSchema):
    id = fields.UUID()
    candidate_id = fields.UUID()
    name = fields.String()

    class Meta:
        strict = True
        dump_only = ('id',)


@doc(tags=['candidate'])
class CandidateCollection(MethodResource):
    @use_kwargs(CandidateSchema())
    @marshal_with(CandidateSchema(), code=201)
    @doc(summary='Create a candidate')
    def post(self, **kwargs):
        candidate = make_candidate(**kwargs)
        db.session.add(candidate)
        db.session.commit()
        return (candidate, 201)


@doc(tags=['candidate'])
class CandidateDetail(MethodResource):
    """ Candidate API. """
    @marshal_with(CandidateSchema())
    @doc(summary='Get a candidate')
    def get(self, candidate_id):
        return get_candidate(candidate_id)

    @marshal_with(CandidateSchema())
    @use_kwargs(CandidateSchema())
    @doc(summary='Partially update a candidate')
    def patch(self, candidate_id, **kwargs):
        candidate = get_candidate(candidate_id)
        update(candidate, **kwargs)
        db.session.commit()
        return candidate

    @marshal_with(None, code=204)
    @doc(summary='Delete a candidate')
    def delete(self, candidate_id):
        candidate = get_candidate(candidate_id)
        update(candidate, deleted=True)
        db.session.commit()
        return make_response('', 204)


@doc(tags=['cocandidate'])
class CandidateCoCandidateCollection(MethodResource):
    @marshal_with(CoCandidateSchema(many=True))
    @doc(summary='Get a list of associated co-candidates')
    def get(self, candidate_id):
        candidate = get_candidate(candidate_id)
        return filter(lambda co: not co.deleted,
                      get_candidate(candidate).co_candidates)


bp.add_url_rule('/candidates/',
                view_func=CandidateCollection.as_view('CandidateCollection'),
                methods=['POST'])
bp.add_url_rule('/candidates/<uuid:candidate_id>',
                view_func=CandidateDetail.as_view('CandidateDetail'),
                methods=['GET', 'PATCH', 'DELETE'])
bp.add_url_rule('/candidates/<uuid:candidate_id>/cocandidates/',
                view_func=CandidateCoCandidateCollection.as_view(
                    'CandidateCoCandidateCollection'
                ),
                methods=['GET'])


@doc(tags=['cocandidate'])
class CoCandidateCollection(MethodResource):
    @marshal_with(CoCandidateSchema(many=True))
    @doc(summary='Get a list of associated co-candidates')
    def get(self):
        return filter(lambda co: not co.deleted,
                      get_candidates())

    @use_kwargs(CoCandidateSchema())
    @marshal_with(CoCandidateSchema(), code=201)
    @doc(summary='Create a co-candidate')
    def post(self, candidate_id, **kwargs):
        cand = get_candidate(candidate_id)
        c = make_cocandidate(candidate=cand, **kwargs)
        db.session.add(c)
        db.session.commit()
        return (c, 201)


@doc(tags=['cocandidate'])
class CoCandidateDetail(MethodResource):
    @marshal_with(CoCandidateSchema())
    @doc(summary='Get a co-candidate')
    def get(self, uuid):
        """ Get a co candidate. """
        return get_cocandidate(uuid)

    @marshal_with(CoCandidateSchema())
    @use_kwargs(CoCandidateSchema())
    @doc(summary='Partially update a co-candidate')
    def patch(self, uuid, **kwargs):
        c = get_cocandidate(uuid)
        update(c, **kwargs)
        db.session.commit()
        return c

    @marshal_with(None, code=204)
    @doc(summary='Delete a co-candidate')
    def delete(self, uuid):
        c = get_cocandidate(uuid)
        update(c, deleted=True)
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule(
    '/cocandidates/',
    view_func=CoCandidateCollection.as_view('CoCandidateCollection'),
    methods=['GET', 'POST'])
bp.add_url_rule(
    '/cocandidates/<uuid:uuid>',
    view_func=CoCandidateDetail.as_view('CoCandidateDetail'),
    methods=['GET', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'candidate',
        'description': 'Operations on candidates'
    })
    docs.register(CandidateCollection,
                  endpoint='CandidateCollection',
                  blueprint='candidates')
    docs.register(CandidateDetail,
                  endpoint='CandidateDetail',
                  blueprint='candidates')
    docs.register(CoCandidateCollection,
                  endpoint='CoCandidateCollection',
                  blueprint='candidates')
    docs.register(CoCandidateDetail,
                  endpoint='CoCandidateDetail',
                  blueprint='candidates')
