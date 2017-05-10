#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate API. """
from flask import Blueprint, request, jsonify, abort, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import ma, db, docs
from evalg.models.candidate import Candidate

candidate_bp = Blueprint('candidates', __name__)


class CandidateSchema(ma.Schema):
    id = fields.UUID()
    candidate_name = fields.String()
    list_id = fields.UUID()
    election_id = fields.UUID()
    data = fields.Dict()
    priority = fields.Integer()

    _links = ma.Hyperlinks({
        'election': ma.URLFor('elections.ElectionDetail',
                              e_id='<election_id>'),
        'election_list': ma.URLFor('lists.ListListAPI', id='<id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', '_links',)
#        load_only = ('list_id', 'election_id')
#        fields = ('id', 'candidate_name', 'data', 'priority', '_links', 'list_id', 'election_id')


candidate_schema = CandidateSchema()


@doc(tags=['candidate'])
class CandidateListAPI(MethodResource):
    """ Candidate API. """
    @use_kwargs({}, locations='query')
    @marshal_with(CandidateSchema(many=True))
    @doc(summary='Get a list of candidates')
    def get(self):
        return filter(lambda c: not c.hidden, Candidate.query.all())

    @use_kwargs(CandidateSchema())
    @marshal_with(CandidateSchema(), code=201)
    @doc(summary='Create a candidate')
    def post(self, **kwargs):
        c = Candidate(**kwargs)
        db.session.add(c)
        db.session.commit()
        return (c, 201)


@doc(tags=['candidate'])
class CandidateAPI(MethodResource):
    """ Candidate API. """
    @marshal_with(CandidateSchema())
    @use_kwargs({'id': fields.UUID(description="Candidate identificator")},
                locations='query')
    @doc(summary='Get a candidate')
    def get(self):
        """ List candidates. """
        return Candidate.query.get(id)

    @marshal_with(CandidateSchema())
    @use_kwargs(CandidateSchema())
    @doc(summary='Partially update a candidate')
    def patch(self, id, **kwargs):
        c = Candidate.query.get(id)
        for k, v in kwargs.items():
            setattr(c, k, v)
        db.session.commit()
        return c

    @marshal_with(None, code=204)
    @use_kwargs({'id': fields.UUID(description="Candidate identificator")},
                locations='query')
    @doc(summary='Delete a candidate')
    def delete(self, id):
        l = Candidate.query.get(id)
        l.hidden = True
        db.session.commit()
        return None, 204


candidate_bp.add_url_rule(
    '/candidates/',
    view_func=CandidateListAPI.as_view('CandidateListAPI'),
    methods=['GET', 'POST'])
candidate_bp.add_url_rule(
    '/candidates/<uuid:id>',
    view_func=CandidateAPI.as_view('CandidateAPI'),
    methods=['GET', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(candidate_bp)
    docs.spec.add_tag({
        'name': 'candidate',
        'description': 'Operations on candidates'
    })
    docs.register(CandidateListAPI,
                  endpoint='CandidateListAPI',
                  blueprint='candidates')
    docs.register(CandidateAPI,
                  endpoint='CandidateAPI',
                  blueprint='candidates')
