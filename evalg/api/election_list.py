#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The List API. """
from flask import Blueprint, request, jsonify, abort, current_app
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

    class Meta:
        strict = True
        dump_only = ('id', )
        fields = ('id', )


@doc(tags=['list'])
class ElectionListList(MethodResource):
    @marshal_with(ElectionListSchema(many=True))
    @use_kwargs({}, locations='query')
    @doc(summary='Get a list of electionlists')
    def get(self):
        return ElectionList.query.all()

    @use_kwargs({}, locations="query")
    @marshal_with(ElectionListSchema(), code=201)
    @doc(summary='Create a election list')
    def post(self):
        l = ElectionList()
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
        return ElectionList.query.get(id)

    @marshal_with(ElectionListSchema)
    @use_kwargs(ElectionListSchema)
    @doc(summary='Partially update a list')
    def patch(self, id, **kwargs):
        l = get_list(id)
        for k, v in kwargs.items():
            setattr(l, k, v)
        db.session.commit()
        return l

    @marshal_with(ElectionListSchema(), code=204)
    @use_kwargs({},
                locations='query')
    @doc(summary='Delete a list')
    def delete(self, id=None):
        l = ElectionList.query.get(id)
        db.session.delete(l)
        db.session.commit()
        return '', 204


bp.add_url_rule('/list/',
                view_func=ElectionListList.as_view('ElectionListList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/list/<uuid:id>',
                view_func=ElectionListDetail.as_view('ElectionListDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


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
