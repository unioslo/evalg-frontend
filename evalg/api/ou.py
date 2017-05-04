#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, abort
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import ma, docs
from evalg.models.ou import OrganizationalUnit

ou_bp = Blueprint('ous', __name__)


class OrganizationalUnitSchema(ma.ModelSchema):
    name = fields.Dict()

    _links = ma.Hyperlinks({
        'self': ma.URLFor('ous.OUDetail', ou_id='<id>'),
        'collection': ma.URLFor('ous.OUList')
    })

    class Meta:
        model = OrganizationalUnit
        dump_only = ('_links', 'id', 'children')


ou_schema = OrganizationalUnitSchema()


@doc(tags=['ou'])
class OUDetail(MethodResource):
    """ Election group API. """
    @use_kwargs({}, locations='query')
    @marshal_with(ou_schema)
    @doc(summary='Get an organizational unit')
    def get(self, ou_id):
        ou = OrganizationalUnit.query.get(ou_id)
        if not ou:
            abort(404)
        return ou

    @use_kwargs(ou_schema)
    @marshal_with(ou_schema)
    @doc(summary='Update an organizational unit')
    def post(self, ou_id, **kwargs):
        ou = OrganizationalUnit.query.get(ou_id)
        if not ou:
            abort(404)
        pass

    @doc(summary='Delete an organizational unit')
    def delete(self, ou_id):
        pass


@doc(tags=['ou'])
class OUList(MethodResource):
    """ Election group API. """
    @use_kwargs({}, locations='query')
    @marshal_with(OrganizationalUnitSchema(many=True))
    @doc(summary='List organizational units')
    def get(self):
        return OrganizationalUnit.query.all()

    @use_kwargs(ou_schema)
    @marshal_with(ou_schema)
    @doc(summary='Create an organizational unit')
    def post(self, **kwargs):
        pass


ou_bp.add_url_rule('/ous/',
                   view_func=OUList.as_view('OUList'),
                   methods=['GET', 'POST'])
ou_bp.add_url_rule('/ous/<uuid:ou_id>',
                   view_func=OUDetail.as_view('OUDetail'),
                   methods=['GET', 'POST', 'DELETE'])


def init_app(app):
    app.register_blueprint(ou_bp)
    docs.spec.add_tag({
        'name': 'ou',
        'description': 'Organizational units'
    })
    docs.register(OUList, endpoint='OUList', blueprint='ous')
    docs.register(OUDetail, endpoint='OUDetail', blueprint='ous')
