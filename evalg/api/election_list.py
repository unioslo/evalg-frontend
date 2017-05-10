#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The List API. """
from flask import Blueprint, request, jsonify, abort, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, ma, docs
from evalg.models.election_list import ElectionList

list_bp = Blueprint('lists', __name__)


class ListSchema(ma.Schema):
    id = fields.UUID()

    class Meta:
        strict = True
        dump_only = ('id', )
        fields = ('id', )


@doc(tags=['list'])
class ListListAPI(MethodResource):
    @marshal_with(ListSchema(many=True))
    @use_kwargs({}, locations='query')
    @doc(summary='Get a list of electionlists')
    def get(self):
        return ElectionList.query.all()

    @use_kwargs({}, locations="query")
    @marshal_with(ListSchema(), code=201)
    @doc(summary='Create a election list')
    def post(self):
        l = ElectionList()
        db.session.add(l)
        db.session.commit()
        return (l, 201)


@doc(tags=['list'])
class ListAPI(MethodResource):
    """ Election List API. """
    @marshal_with(ListSchema)
    @use_kwargs({}, locations='query')
    @doc(summary='Get a list')
    def get(self, id):
        return ElectionList.query.get(id)

    @marshal_with(ListSchema)
    @use_kwargs(ListSchema)
    @doc(summary='Partially update a list')
    def patch(self, id=None):
        raise NotImplemented

    def put(self):
        raise NotImplemented

    @marshal_with(ListSchema(), code=204)
    @use_kwargs({},
                locations='query')
    @doc(summary='Delete a list')
    def delete(self, id=None):
        l = ElectionList.query.get(id)
        db.session.delete(l)
        db.session.commit()
        return '', 204


list_bp.add_url_rule('/list/',
                     view_func=ListListAPI.as_view('ListListAPI'),
                     methods=['GET', 'POST'])
list_bp.add_url_rule('/list/<uuid:id>',
                     view_func=ListAPI.as_view('ListAPI'),
                     methods=['GET', 'PUT', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(list_bp)
    docs.spec.add_tag({
        'name': 'list',
        'description': 'Operations on election lists'
    })
    docs.register(ListListAPI,
                  endpoint='ListListAPI',
                  blueprint='lists')
    docs.register(ListAPI,
                  endpoint='ListAPI',
                  blueprint='lists')
