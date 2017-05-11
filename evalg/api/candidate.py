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
from evalg.models.candidate import Candidate

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

candidate_schema = CandidateSchema()


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
