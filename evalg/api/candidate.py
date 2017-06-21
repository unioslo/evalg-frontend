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
                              get_cocandidate, get_cocandidates)
from evalg.api import BaseSchema, add_all_authz, or404
from evalg.models.candidate import CoCandidate
from .election import get_election

bp = Blueprint('candidates', __name__)


map(or404, (get_candidate, get_candidates))
add_all_authz()


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
    _links = ma.Hyperlinks({
        'list': ma.URLFor('lists.ElectionListList', id='<id>'),
        'cocandidates': ma.URLFor('candidates.CoCandidateCollection',
                                  id='<id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', '_links','co_candidate_ids')


@doc(tags=['candidate'])
class CandidateList(MethodResource):
    """ Candidate API. """
    @use_kwargs({}, locations='query')
    @marshal_with(CandidateSchema(many=True))
    @doc(summary='Get a list of candidates')
    def get(self, e_id, g_id=None):
        e = get_election(e_id)
        return get_candidates(e)

    @use_kwargs(CandidateSchema())
    @marshal_with(CandidateSchema(), code=201)
    @doc(summary='Create a candidate list')
    def post(self, g_id=None, **kwargs):
        c = make_candidate(**kwargs)
        db.session.add(c)
        db.session.commit()
        return (c, 201)


@doc(tags=['candidate'])
class CandidateDetail(MethodResource):
    """ Candidate API. """
    @marshal_with(CandidateSchema())
    @use_kwargs({},
                locations='query')
    @doc(summary='Get a candidate')
    def get(self, id, e_id=None, g_id=None):
        """ List candidates. """
        return get_candidate(id)

    @marshal_with(CandidateSchema())
    @use_kwargs(CandidateSchema())
    @doc(summary='Partially update a candidate')
    def patch(self, id, g_id=None, e_id=None, **kwargs):
        c = get_candidate(id)
        for k, v in kwargs.items():
            setattr(c, k, v)
        db.session.commit()
        return c

    @marshal_with(None, code=204)
    @use_kwargs({},
                locations='query')
    @doc(summary='Delete a candidate')
    def delete(self, id, e_id=None, g_id=None):
        c = get_candidate(id)
        c.deleted = True
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/elections/<uuid:e_id>/candidates/',
                view_func=CandidateList.as_view('CandidateListDirect'),
                methods=['GET', 'POST'])
bp.add_url_rule('/electiongroups/<uuid:g_id>/elections/<uuid:e_id>/candidates/',
                view_func=CandidateList.as_view('CandidateList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/elections/<uuid:e_id>/candidates/<uuid:id>',
                view_func=CandidateDetail.as_view('CandidateDetailDirect'),
                methods=['GET', 'PATCH', 'DELETE'])
bp.add_url_rule('/electiongroups/<uuid:g_id>/elections/<uuid:e_id>'
                '/candidates/<uuid:id>',
                view_func=CandidateDetail.as_view('CandidateDetail'),
                methods=['GET', 'PATCH', 'DELETE'])
bp.add_url_rule('/candidates/<uuid:id>',
                view_func=CandidateDetail.as_view('CandidateDetailCandidate'),
                methods=['GET', 'PATCH', 'DELETE'])


class CoCandidateSchema(BaseSchema):
    id = fields.UUID()
    candidate_id = fields.UUID()
    name = fields.String()

    _links = ma.Hyperlinks({
        'candidate': ma.URLFor('candidates.CandidateDetail',
                               id='<candidate_id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', )


@doc(tags=['cocandidate'])
class CoCandidateList(MethodResource):
    @use_kwargs({}, locations='query')
    @marshal_with(CoCandidateSchema(many=True))
    @doc(summary='Get a list of co candidates')
    def get(self, g_id=None, e_id=None, c_id=None):
        return get_candidate(c_id).cocandidates

    @use_kwargs(CoCandidateSchema())
    @marshal_with(CoCandidateSchema(), code=201)
    @doc(summary='Create a cocandidate')
    def post(self, g_id=None, e_id=None, c_id=None, **kwargs):
        cand = get_candidate(c_id)
        c = CoCandidate(candidate=cand, **kwargs)
        db.session.add(c)
        db.session.commit()
        return (c, 201)


@doc(tags=['cocandidate'])
class CoCandidateDetail(MethodResource):
    @marshal_with(CoCandidateSchema())
    @use_kwargs({},
                locations='query')
    @doc(summary='Get a co candidate')
    def get(self, id, g_id=None, e_id=None, c_id=None):
        """ Get a co candidate. """
        return get_cocandidate(id)

    @marshal_with(CoCandidateSchema())
    @use_kwargs(CoCandidateSchema())
    @doc(summary='Partially update a co candidate')
    def patch(self, id, g_id=None, e_id=None, c_id=None, **kwargs):
        c = get_cocandidate(id)
        update(c, **kwargs)
        db.session.commit()
        return c

    @marshal_with(None, code=204)
    @use_kwargs({},
                locations='query')
    @doc(summary='Delete a co candidate')
    def delete(self, id):
        c = get_cocandidate(id)
        c.deleted = True
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/electiongroups/<uuid:g_id>/elections/<uuid:e_id>'
                '/candidates/<uuid:c_id>/cocandidates/',
                view_func=CoCandidateList.as_view('CoCandidateList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/elections/<uuid:e_id>/candidates/<uuid:c_id>/cocandidates/',
                view_func=CoCandidateList.as_view('CoCandidateListDirect'),
                methods=['GET', 'POST'])
bp.add_url_rule('/candidates/<uuid:c_id>/cocandidates/',
                view_func=CoCandidateList.as_view('CoCandidateListCandidate'),
                methods=['GET', 'POST'])
bp.add_url_rule('/electiongroups/<uuid:g_id>/elections/<uuid:e_id>'
                '/candidates/<uuid:c_id_>/cocandidates/<uuid:id>',
                view_func=CoCandidateDetail.as_view('CoCandidateDetail'),
                methods=['GET', 'PATCH', 'DELETE'])
bp.add_url_rule('/elections/<uuid:e_id>/candidates/<uuid:c_id_>/cocandidates/'
                '<uuid:id>',
                view_func=CoCandidateDetail.as_view('CoCandidateDetailDirect'),
                methods=['GET', 'PATCH', 'DELETE'])


@doc(tags=['candidate'])
class CoCandidateCollection(MethodResource):
    @marshal_with(CoCandidateSchema(many=True))
    @use_kwargs({},
                locations='query')
    @doc(summary='Get a list of associated co candidates')
    def get(self, id):
        return filter(lambda c: not c.deleted, get_candidate(id).co_candidates)


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'candidate',
        'description': 'Operations on candidates'
    })
    docs.register(CandidateList,
                  endpoint='CandidateList',
                  blueprint='candidates')
    docs.register(CandidateDetail,
                  endpoint='CandidateDetail',
                  blueprint='candidates')
    docs.register(CoCandidateList,
                  endpoint='CoCandidateList',
                  blueprint='candidates')
    docs.register(CoCandidateDetail,
                  endpoint='CoCandidateDetail',
                  blueprint='candidates')
