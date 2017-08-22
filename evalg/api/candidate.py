#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate API. """
from flask import Blueprint, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, docs
from evalg.candidates import (get_candidate, make_candidate, update)
from evalg.api import BaseSchema, add_all_authz

bp = Blueprint('candidates', __name__)

add_all_authz(globals())


class CandidateSchema(BaseSchema):
    id = fields.UUID()
    name = fields.String()
    list_id = fields.UUID()
    meta = fields.Dict(allow_none=True)
    information_url = fields.URL(allow_none=True)
    priority = fields.Integer(allow_none=True)
    cumulated = fields.Boolean(allow_none=True)

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
        return candidate, 201


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
        db.session.delete(candidate)
        db.session.commit()
        return make_response('', 204)

bp.add_url_rule('/candidates/',
                view_func=CandidateCollection.as_view('CandidateCollection'),
                methods=['POST'])
bp.add_url_rule('/candidates/<uuid:candidate_id>',
                view_func=CandidateDetail.as_view('CandidateDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'candidates',
        'description': 'Operations on candidates'
    })
    docs.register(CandidateCollection,
                  endpoint='CandidateCollection',
                  blueprint='candidates')
    docs.register(CandidateDetail,
                  endpoint='CandidateDetail',
                  blueprint='candidates')

