#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The List API. """
from flask import Blueprint, abort, make_response, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, ma, docs
from evalg.api import BaseSchema, TranslatedString
from evalg.models.election_list import ElectionList

bp = Blueprint('lists', __name__)


class ElectionListSchema(BaseSchema):
    id = fields.UUID()
    name = fields.Nested(TranslatedString())
    description = fields.Nested(TranslatedString(), allow_none=True)
    information_url = fields.URL(allow_none=True)
    election_id = fields.UUID()

    _links = ma.Hyperlinks({
        'election': ma.URLFor('elections.ElectionDetail',
                              e_id='<election_id>'),
        'candidates': ma.URLFor('lists.CandidateCollection', id='<id>')
    })

    class Meta:
        strict = True
        dump_only = ('id', '_links')


def get_list(id):
    """ Get a list from the database. """
    l = ElectionList.query.get(id)
    if l is None or l.deleted:
        abort(404)
    else:
        return l


@doc(tags=['list'])
class ElectionListList(MethodResource):
    @marshal_with(ElectionListSchema(many=True))
    @use_kwargs({}, locations='query')
    @doc(summary='Get a list of electionlists')
    def get(self):
        return filter(lambda l: not l.deleted, ElectionList.query.all())

    @use_kwargs(ElectionListSchema())
    @marshal_with(ElectionListSchema(), code=201)
    @doc(summary='Create a election list')
    def post(self, **kwargs):
        current_app.logger.info('KWARGS')
        current_app.logger.info(kwargs)
        l = ElectionList(**kwargs)
        db.session.add(l)
        db.session.commit()
        return (l, 201)


@doc(tags=['list'])
class ElectionListDetail(MethodResource):
    """ Election List API. """
    @marshal_with(ElectionListSchema)
    @use_kwargs({}, locations='query')
    @doc(summary='Get a list')
    def get(self, id):
        return get_list(id)

    @marshal_with(ElectionListSchema)
    @use_kwargs(ElectionListSchema)
    @doc(summary='Partially update a list')
    def patch(self, id, **kwargs):
        l = get_list(id)
        for k, v in kwargs.items():
            setattr(l, k, v)
        db.session.commit()
        return l

    @marshal_with(None, code=204)
    @use_kwargs({},
                locations='query')
    @doc(summary='Delete a list')
    def delete(self, id=None):
        l = get_list(id)
        l.deleted = True
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/list/',
                view_func=ElectionListList.as_view('ElectionListList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/list/<uuid:id>',
                view_func=ElectionListDetail.as_view('ElectionListDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


@doc(tags=['list'])
class CandidateCollection(MethodResource):
    from evalg.api.candidate import CandidateSchema

    @marshal_with(CandidateSchema(many=True))
    @use_kwargs({},
                locations='query')
    @doc(summary='Get a list of associated candidates')
    def get(self, id):
        return filter(lambda c: not c.deleted, get_list(id).candidates)


bp.add_url_rule('/list/<uuid:id>/candidates',
                view_func=CandidateCollection.as_view(
                    'CandidateCollection'),
                methods=['GET'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'list',
        'description': 'Operations on election lists'
    })
    docs.register(ElectionListList,
                  endpoint='ElectionListList',
                  blueprint='lists')
    docs.register(ElectionListDetail,
                  endpoint='ElectionListDetail',
                  blueprint='lists')
    docs.register(CandidateCollection,
                  endpoint='CandidateCollection',
                  blueprint='lists')
