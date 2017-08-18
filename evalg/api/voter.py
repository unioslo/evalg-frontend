#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The voter API. """
from flask import Blueprint, abort, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import ma, db, docs
from evalg.api import BaseSchema
from evalg.models.voter import Voter

bp = Blueprint('voters', __name__)


def get_voter(id):
    v = Voter.query.get(id)
    if v is None:
        abort(404)
    else:
        return v


class VoterStatusSchema(BaseSchema):
    code = fields.String()
    description = fields.String()


class VoterSchema(BaseSchema):
    id = fields.UUID()
    tag = fields.String()
    voter_status = fields.Nested(VoterStatusSchema())
    person_id = fields.UUID(attribute='pollbook_person_id')
    pollbook_id = fields.UUID()
    voter_status_id = fields.String()

    class Meta:
        strict = True
        dump_only = ('id', 'voter_status')


@doc(tags=['voter'])
class VoterCollection(MethodResource):
    @marshal_with(VoterSchema(many=True))
    @doc(summary='Get voters')
    def get(self):
        return Voter.query.all()

    @use_kwargs(VoterSchema())
    @marshal_with(VoterSchema(), code=201)
    @doc(summary='Create a voter')
    def post(self, **kwargs):
        voter = Voter(**kwargs)
        db.session.add(voter)
        db.session.commit()
        return (voter, 201)


@doc(tags=['voter'])
class VoterDetail(MethodResource):
    @marshal_with(VoterSchema())
    @doc(summary='Get a voter')
    def get(self, voter_id):
        return get_voter(voter_id)

    @marshal_with(VoterSchema())
    @use_kwargs(VoterSchema())
    @doc(summary='Partially update a voter')
    def patch(self, voter_id, **kwargs):
        voter = get_voter(voter_id)
        for k, v in kwargs.items():
            setattr(voter, k, v)
        db.session.commit()
        return voter

    @marshal_with(None, code=204)
    @doc(summary='Delete a voter')
    def delete(self, voter_id):
        voter = get_voter(voter_id)
        db.session.delete(voter)
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/voters/',
                view_func=VoterCollection.as_view('VoterCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/voters/<uuid:voter_id>',
                view_func=VoterDetail.as_view('VoterDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'voter',
        'decription': 'Operations on voters'})
    docs.register(VoterCollection,
                  endpoint='VoterCollection',
                  blueprint='voters')
    docs.register(VoterDetail,
                  endpoint='VoterDetail',
                  blueprint='voters')
