#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The pollbook API. """
from flask import Blueprint, abort, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, docs
from evalg.api import BaseSchema, TranslatedString
from evalg.models.pollbook import PollBook

bp = Blueprint('pollbooks', __name__)


def get_pollbook(id):
    p = PollBook.query.get(id)
    if p is None:
        abort(404)
    else:
        return p


class PollBookSchema(BaseSchema):
    id = fields.UUID()
    name = fields.Nested(TranslatedString())
    weight = fields.Integer()
    priority = fields.Integer()
    election_id = fields.UUID()

    class Meta:
        strict = True
        dump_only = ('id', '_links',)


@doc(tags=['pollbook'])
class PollBookCollection(MethodResource):
    @marshal_with(PollBookSchema(many=True))
    @doc(summary='Get all pollbooks')
    def get(self):
        return PollBook.query.all()

    @use_kwargs(PollBookSchema())
    @marshal_with(PollBookSchema(), code=201)
    @doc(summary='Create a pollbook')
    def post(self, **kwargs):
        poll = PollBook(**kwargs)
        db.session.add(poll)
        db.session.commit()
        return (poll, 201)


@doc(tags=['pollbook'])
class PollBookDetail(MethodResource):
    @marshal_with(PollBookSchema())
    @doc(summary='Get a pollbook')
    def get(self, pollbook_id):
        return get_pollbook(pollbook_id)

    @marshal_with(PollBookSchema())
    @use_kwargs(PollBookSchema())
    @doc(summary='Partially update a pollbook')
    def patch(self, pollbook_id, **kwargs):
        poll = get_pollbook(pollbook_id)
        for k, v in kwargs.items():
            setattr(poll, k, v)
        db.session.commit()
        return poll

    @marshal_with(None, code=204)
    @doc(summary='Delete a pollbook')
    def delete(self, pollbook_id):
        db.session.delete(get_pollbook(pollbook_id))
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/pollbooks/',
                view_func=PollBookCollection.as_view('PollBookCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/pollbooks/<uuid:pollbook_id>',
                view_func=PollBookDetail.as_view('PollBookDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


@doc(tags=['pollbook'])
class VoterCollection(MethodResource):
    from evalg.api.voter import VoterSchema

    @marshal_with(VoterSchema(many=True))
    @doc(summary='Get a list of associated voters')
    def get(self, pollbook_id):
        return get_pollbook(pollbook_id).voters

bp.add_url_rule('/pollbooks/<uuid:pollbook_id>/voters/',
                view_func=VoterCollection.as_view('VoterCollection'),
                methods=['GET'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'pollbook',
        'decription': 'Operations on pollbooks'})
    docs.register(PollBookCollection,
                  endpoint='PollBookCollection',
                  blueprint='pollbooks')
    docs.register(PollBookDetail,
                  endpoint='PollBookDetail',
                  blueprint='pollbooks')
    docs.register(VoterCollection,
                  endpoint='VoterCollection',
                  blueprint='pollbooks')
