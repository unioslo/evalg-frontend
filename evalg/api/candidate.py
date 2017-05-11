#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate API. """
from flask import Blueprint, abort, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import ma, db, docs
from evalg.api import BaseSchema
from evalg.models.candidate import Candidate, CoCandidate

bp = Blueprint('candidates', __name__)


class CandidateSchema(BaseSchema):
    id = fields.UUID()
    candidate_name = fields.String()
    list_id = fields.UUID()
    data = fields.Dict()
    priority = fields.Integer()

    _links = ma.Hyperlinks({
        'election_list': ma.URLFor('lists.ElectionListList', id='<id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', '_links',)


def get_candidate(id):
    """ Get a candidate from the database. """
    c = Candidate.query.get(id)
    if c is None or c.deleted:
        abort(404)
    else:
        return c


@doc(tags=['candidate'])
class CandidateList(MethodResource):
    """ Candidate API. """
    @use_kwargs({}, locations='query')
    @marshal_with(CandidateSchema(many=True))
    @doc(summary='Get a list of candidates')
    def get(self):
        return filter(lambda c: not c.deleted, Candidate.query.all())

    @use_kwargs(CandidateSchema())
    @marshal_with(CandidateSchema(), code=201)
    @doc(summary='Create a candidate')
    def post(self, **kwargs):
        c = Candidate(**kwargs)
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
    def get(self, id):
        """ List candidates. """
        return get_candidate(id)

    @marshal_with(CandidateSchema())
    @use_kwargs(CandidateSchema())
    @doc(summary='Partially update a candidate')
    def patch(self, id, **kwargs):
        c = get_candidate(id)
        for k, v in kwargs.items():
            setattr(c, k, v)
        db.session.commit()
        return c

    @marshal_with(None, code=204)
    @use_kwargs({},
                locations='query')
    @doc(summary='Delete a candidate')
    def delete(self, id):
        c = get_candidate(id)
        c.deleted = True
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/candidates/',
                view_func=CandidateList.as_view('CandidateList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/candidates/<uuid:id>',
                view_func=CandidateDetail.as_view('CandidateDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


ccbp = Blueprint('cocandidates', __name__)


class CoCandidateSchema(BaseSchema):
    id = fields.UUID()
    candidate_id = fields.UUID()
    candidate_name = fields.String()

    _links = ma.Hyperlinks({
        'candidate': ma.URLFor('candidates.CandidateDetail',
                               id='<candidate_id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', )


def get_cocandidate(id):
    """ Get a co candidate from the database. """
    c = CoCandidate.query.get(id)
    if c is None or c.deleted:
        abort(404)
    else:
        return c


@doc(tags=['cocandidate'])
class CoCandidateList(MethodResource):
    @use_kwargs({}, locations='query')
    @marshal_with(CoCandidateSchema(many=True))
    @doc(summary='Get a list of co candidates')
    def get(self):
        return filter(lambda c: not c.deleted, CoCandidate.query.all())

    @use_kwargs(CoCandidateSchema())
    @marshal_with(CoCandidateSchema(), code=201)
    @doc(summary='Create a cocandidate')
    def post(self, **kwargs):
        c = CoCandidate(**kwargs)
        db.session.add(c)
        db.session.commit()
        return (c, 201)


@doc(tags=['cocandidate'])
class CoCandidateDetail(MethodResource):
    @marshal_with(CoCandidateSchema())
    @use_kwargs({},
                locations='query')
    @doc(summary='Get a co candidate')
    def get(self, id):
        """ Get a co candidate. """
        return get_cocandidate(id)

    @marshal_with(CoCandidateSchema())
    @use_kwargs(CoCandidateSchema())
    @doc(summary='Partially update a co candidate')
    def patch(self, id, **kwargs):
        c = get_cocandidate(id)
        for k, v in kwargs.items():
            setattr(c, k, v)
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


ccbp.add_url_rule('/cocandidates/',
                  view_func=CoCandidateList.as_view('CoCandidateList'),
                  methods=['GET', 'POST'])
ccbp.add_url_rule('/cocandidates/<uuid:id>',
                  view_func=CoCandidateDetail.as_view('CoCandidateDetail'),
                  methods=['GET', 'PATCH', 'DELETE'])


@doc(tags=['candidate'])
class CoCandidateCollection(MethodResource):
    @marshal_with(CoCandidateSchema(many=True))
    @use_kwargs({},
                locations='query')
    def get(self, id):
        return filter(lambda c: not c.deleted, get_candidate(id).co_candidates)


ccbp.add_url_rule('/candidates/<uuid:id>/cocandidates',
                  view_func=CoCandidateCollection.as_view(
                      'CoCandidateCollection'),
                  methods=['GET'])


def init_app(app):
    app.register_blueprint(bp)
    app.register_blueprint(ccbp)
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
                  blueprint='cocandidates')
    docs.register(CoCandidateDetail,
                  endpoint='CoCandidateDetail',
                  blueprint='cocandidates')
    docs.register(CoCandidateCollection,
                  endpoint='CoCandidateCollection',
                  blueprint='cocandidates')
