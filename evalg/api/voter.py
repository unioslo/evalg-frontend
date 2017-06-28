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

    _links = ma.Hyperlinks({
        'pollbook': ma.URLFor('pollbooks.PollBookDetail', id='<pollbook_id>'),
        'person': ma.URLFor('persons.PersonDetail', id='<pollbook_person_id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', '_links', 'voter_status')


@doc(tags=['voter'])
class VoterList(MethodResource):
    @marshal_with(VoterSchema(many=True))
    @doc(summary='Get voters')
    def get(self):
        return Voter.query.all()

    @use_kwargs(VoterSchema())
    @marshal_with(VoterSchema(), code=201)
    @doc(summary='Create a voter')
    def post(self, **kwargs):
        v = Voter(**kwargs)
        db.session.add(v)
        db.session.commit()
        return (v, 201)


@doc(tags=['voter'])
class VoterDetail(MethodResource):
    @marshal_with(VoterSchema())
    @doc(summary='Get a voter')
    def get(self, id):
        return get_voter(id)

    @marshal_with(VoterSchema())
    @use_kwargs(VoterSchema())
    @doc(summary='Partially update a voter')
    def patch(self, id, **kwargs):
        voter = get_voter(id)
        for k, v in kwargs.items():
            setattr(voter, k, v)
        db.session.commit()
        return voter

    @marshal_with(None, code=204)
    @doc(summary='Delete a voter')
    def delete(self, id):
        voter = get_voter(id)
        db.session.delete(voter)
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/voters/',
                view_func=VoterList.as_view('VoterList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/voters/<uuid:id>',
                view_func=VoterDetail.as_view('VoterDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'voter',
        'decription': 'Operations on voters'})
    docs.register(VoterList,
                  endpoint='VoterList',
                  blueprint='voters')
    docs.register(VoterDetail,
                  endpoint='VoterDetail',
                  blueprint='voters')
