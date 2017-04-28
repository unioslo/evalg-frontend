#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, request, jsonify, abort, current_app
from flask.views import MethodView
from marshmallow import fields
from evalg import ma
from evalg.models.election import ElectionGroup, Election, OrganizationalUnit

election_bp = Blueprint('elections', __name__)


class OrganizationalUnitSchema(ma.ModelSchema):
    name = fields.Dict()

    class Meta:
        model = OrganizationalUnit


class ElectionGroupSchema(ma.ModelSchema):
    ou = fields.Nested(OrganizationalUnitSchema)

    _links = ma.Hyperlinks({
        'self': ma.URLFor('elections.election_group_detail', eg_id='<id>'),
        'collection': ma.URLFor('elections.election_group_list')
    })

    class Meta:
        model = ElectionGroup


class ElectionSchema(ma.ModelSchema):
    class Meta:
        model = Election


election_group_schema = ElectionGroupSchema()
election_schema = ElectionSchema()


class ElectionGroupAPI(MethodView):
    """ Election group API. """
    def get(self, eg_id):
        current_app.logger.debug('get eg_id={}'.format(eg_id))
        if eg_id is None:
            return self.get_list()
        return self.get_detail(eg_id)

    def get_list(self):
        current_app.logger.debug('get_list')
        all_groups = ElectionGroup.query.all()
        result = election_group_schema.dump(all_groups, many=True)
        return jsonify(result.data)

    def get_detail(self, eg_id):
        current_app.logger.debug('get_detail eg_id={}'.format(eg_id))
        eg = ElectionGroup.query.get(eg_id)
        if not eg:
            abort(404)
        result = election_group_schema.dump(eg)
        return jsonify(result.data)

    def post(self, eg_id):
        if eg_id is None:
            return self.post_list()
        return self.post_detail(eg_id)

    def post_list(self):
        current_app.logger.debug('post_list')
        from pprint import pprint
        return str(pprint(election_group_schema.validate(request.get_json())))

    def post_detail(self, eg_id):
        current_app.logger.debug('post_detail eg_id={}'.format(eg_id))
        from pprint import pprint
        return str(pprint(election_group_schema.validate(request.get_json())))

    def put(self):
        pass

    def delete(self):
        pass


election_bp.add_url_rule('/electiongroups/',
                         defaults={'eg_id': None},
                         view_func=ElectionGroupAPI.as_view(
                            'election_group_list'),
                         methods=['GET', 'POST'])
election_bp.add_url_rule('/electiongroups/<uuid:eg_id>',
                         view_func=ElectionGroupAPI.as_view(
                            'election_group_detail'),
                         methods=['GET', 'POST', 'PUT', 'DELETE'])
