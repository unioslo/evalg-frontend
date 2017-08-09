#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The pollbook API. """
from flask import Blueprint, abort, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import ma, db, docs
from evalg.api import BaseSchema
from evalg.models.pollbook import PollBook

bp = Blueprint('pollbooks', __name__)


def get_pollbook(id):
    p = PollBook.query.get(id)
    if p is None or p.deleted:
        abort(404)
    else:
        return p


class PollBookSchema(BaseSchema):
    id = fields.UUID()
    name = fields.String()
    weight = fields.Integer()
    priority = fields.Integer()
    election_id = fields.UUID()

    _links = ma.Hyperlinks({
        'election': ma.URLFor('elections.ElectionDetail',
                              election_id='<election_id>',
                              group_id='<election.group_id>'),
        'voters': ma.URLFor('pollbooks.VoterCollection', id='<id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', '_links',)


@doc(tags=['pollbook'])
class PollBookCollection(MethodResource):
    @marshal_with(PollBookSchema(many=True))
    @doc(summary='Get all pollbooks')
    def get(self):
        return filter(lambda p: not p.deleted, PollBook.query.all())

    @use_kwargs(PollBookSchema())
    @marshal_with(PollBookSchema(), code=201)
    @doc(summary='Create a pollbook')
    def post(self, **kwargs):
        p = PollBook(**kwargs)
        db.session.add(p)
        db.session.commit()
        return (p, 201)


@doc(tags=['pollbook'])
class PollBookDetail(MethodResource):
    @marshal_with(PollBookSchema())
    @doc(summary='Get a pollbook')
    def get(self, id):
        return get_pollbook(id)

    @marshal_with(PollBookSchema())
    @use_kwargs(PollBookSchema())
    @doc(summary='Partially update a pollbook')
    def patch(self, id, **kwargs):
        p = get_pollbook(id)
        for k, v in kwargs.items():
            setattr(p, k, v)
        db.session.commit()
        return p

    @marshal_with(None, code=204)
    @doc(summary='Delete a pollbook')
    def delete(self, id):
        p = get_pollbook(id)
        p.deleted = True
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/pollbooks/',
                view_func=PollBookCollection.as_view('PollBookCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/pollbooks/<uuid:id>',
                view_func=PollBookDetail.as_view('PollBookDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


@doc(tags=['pollbook'])
class VoterCollection(MethodResource):
    from evalg.api.voter import VoterSchema

    @marshal_with(VoterSchema(many=True))
    @doc(summary='Get a list of associated voters')
    def get(self, id):
        return get_pollbook(id).voters

bp.add_url_rule('/pollbooks/<uuid:id>/voters/',
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
