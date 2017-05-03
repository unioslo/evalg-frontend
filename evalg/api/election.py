#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, request, jsonify, abort, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import ma, docs
from evalg.models.election import ElectionGroup, Election, OrganizationalUnit

election_bp = Blueprint('elections', __name__)


class OrganizationalUnitSchema(ma.ModelSchema):
    name = fields.Dict()

    class Meta:
        model = OrganizationalUnit


class ElectionGroupSchema(ma.ModelSchema):
    ou = fields.Nested(OrganizationalUnitSchema)

    _links = ma.Hyperlinks({
        'self': ma.URLFor('elections.ElectionGroupDetail', eg_id='<id>'),
        'collection': ma.URLFor('elections.ElectionGroupList')
    })

    class Meta:
        model = ElectionGroup


class ElectionSchema(ma.ModelSchema):
    class Meta:
        model = Election


election_group_schema = ElectionGroupSchema()
election_schema = ElectionSchema()


@doc(tags=['electiongroup'])
class ElectionGroupDetail(MethodResource):
    """ Election group API. """
    @marshal_with(ElectionGroupSchema)
    @doc(summary='Get an election group')
    def get(self, eg_id):
        eg = ElectionGroup.query.get(eg_id)
        if not eg:
            abort(404)
        return eg

    @use_kwargs(ElectionGroupSchema)
    @marshal_with(ElectionGroupSchema)
    @doc(summary='Partially update an election group')
    def put(self, eg_id, **kwargs):
        eg = ElectionGroup.query.get(eg_id)
        if not eg:
            abort(404)
        pass

    @use_kwargs(ElectionGroupSchema)
    @marshal_with(ElectionGroupSchema)
    @doc(summary='Update an election group')
    def post(self, eg_id, **kwargs):
        eg = ElectionGroup.query.get(eg_id)
        if not eg:
            abort(404)
        pass

    @doc(summary='Delete an election group')
    def delete(self, eg_id):
        pass


@doc(tags=['electiongroup'])
class ElectionGroupList(MethodResource):
    """ Election group API. """
    @marshal_with(ElectionGroupSchema(many=True))
    @doc(summary='List election groups')
    def get(self):
        return ElectionGroup.query.all()

    @use_kwargs(ElectionGroupSchema)
    @marshal_with(ElectionGroupSchema)
    @doc(summary='Create an election group')
    def post(self, **kwargs):
        pass


election_bp.add_url_rule('/electiongroups/',
                         view_func=ElectionGroupList,
                         methods=['GET', 'POST'])
election_bp.add_url_rule('/electiongroups/<uuid:eg_id>',
                         view_func=ElectionGroupDetail,
                         methods=['GET', 'POST', 'PUT', 'DELETE'])


def init_app(app):
    app.register_blueprint(election_bp)
    docs.spec.add_tag({
        'name': 'electiongroup',
        'description': 'Election group operations'
    })
    docs.register(ElectionGroupList,
                  endpoint='ElectionGroupList',
                  blueprint='elections')
    docs.register(ElectionGroupDetail,
                  endpoint='ElectionGroupDetail',
                  blueprint='elections')
