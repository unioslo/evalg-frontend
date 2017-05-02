#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, request, jsonify, abort, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
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
        'self': ma.URLFor('elections.election_groups', eg_id='<id>'),
        'collection': ma.URLFor('elections.election_groups')
    })

    class Meta:
        model = ElectionGroup


class ElectionSchema(ma.ModelSchema):
    class Meta:
        model = Election


election_group_schema = ElectionGroupSchema()
election_schema = ElectionSchema()


class ElectionGroupResource(MethodResource):
    """ Election group API. """
    def get(self, eg_id=None):
        if eg_id is None:
            return self.get_list()
        return self.get_detail(eg_id)

    @marshal_with(ElectionGroupSchema(many=True))
    def get_list(self):
        return ElectionGroup.query.all()

    @marshal_with(ElectionGroupSchema)
    def get_detail(self, eg_id):
        eg = ElectionGroup.query.get(eg_id)
        if not eg:
            abort(404)
        return eg

    @use_kwargs(ElectionGroupSchema)
    @marshal_with(ElectionGroupSchema)
    def post(self, **kwargs):
        eg_id = kwargs.get('eg_id')
        if eg_id is None:
            return self.post_to_list(**kwargs)
        return self.post_to_detail(eg_id, **kwargs)

    def post_to_list(self, **kwargs):
        pass

    def post_to_detail(self, eg_id, **kwargs):
        pass

    def put(self, eg_id):
        pass

    def delete(self, eg_id):
        pass


election_group_view = ElectionGroupResource.as_view('election_groups')
election_bp.add_url_rule('/electiongroups/',
                         view_func=election_group_view,
                         methods=['GET', 'POST'])
election_bp.add_url_rule('/electiongroups/<uuid:eg_id>',
                         view_func=election_group_view,
                         methods=['GET', 'POST', 'PUT', 'DELETE'])


def init_app(app):
    app.register_blueprint(election_bp)
    docs.register(ElectionGroupResource,
                  endpoint='election_groups',
                  blueprint='elections')
