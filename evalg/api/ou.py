#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, abort
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import db, ma, docs
from evalg.api import TranslatedString
from evalg.models.ou import OrganizationalUnit

ou_bp = Blueprint('ous', __name__)


class OrganizationalUnitSchema(ma.Schema):
    _links = ma.Hyperlinks({
        'self': ma.URLFor('ous.OUDetail', ou_id='<id>'),
        'collection': ma.URLFor('ous.OUList'),
    })

    id = fields.UUID()
    name = fields.Nested(TranslatedString())
    code = fields.Str()
    parent = fields.UUID(attribute='parent_id', allow_none=True)
    children = fields.List(fields.Str())

    class Meta:
        strict = True
        dump_only = ('_links', 'id', 'children')


ou_schema = OrganizationalUnitSchema()


@doc(tags=['ou'])
class OUDetail(MethodResource):
    """ Resource for single OUs. """
    @use_kwargs({}, locations=['query'])
    @marshal_with(ou_schema)
    @doc(summary='Get an organizational unit')
    def get(self, ou_id):
        return OrganizationalUnit.query.get_or_404(ou_id)

    @use_kwargs(ou_schema)
    @marshal_with(ou_schema)
    @doc(summary='Update an organizational unit')
    def post(self, ou_id, **kwargs):
        ou = OrganizationalUnit.query.get_or_404(ou_id)
        for k, v in kwargs.items():
            setattr(ou, k, v)
        db.session.commit()
        return ou

    @use_kwargs(OrganizationalUnitSchema(strict=False))
    @marshal_with(ou_schema)
    @doc(summary='Partially update an organizational unit')
    def patch(self, ou_id, **kwargs):
        ou = OrganizationalUnit.query.get_or_404(ou_id)
        for k, v in kwargs.items():
            setattr(ou, k, v)
        db.session.commit()
        return ou

    @doc(summary='Delete an organizational unit')
    def delete(self, ou_id):
        ou = OrganizationalUnit.query.get_or_404(ou_id)
        db.session.delete(ou)
        db.session.commit()
        return '', 204


@doc(tags=['ou'])
class OUList(MethodResource):
    """ Resource for OU collections. """
    @use_kwargs({}, locations=['query'])
    @marshal_with(OrganizationalUnitSchema(many=True))
    @doc(summary='List organizational units')
    def get(self):
        return OrganizationalUnit.query.all()

    @use_kwargs(ou_schema)
    @marshal_with(ou_schema, code=201)
    @doc(summary='Create an organizational unit')
    def post(self, **kwargs):
        ou = OrganizationalUnit(**kwargs)
        db.session.add(ou)
        db.session.commit()
        return ou, 201


ou_bp.add_url_rule('/ous/',
                   view_func=OUList.as_view('OUList'),
                   methods=['GET', 'POST'])
ou_bp.add_url_rule('/ous/<uuid:ou_id>',
                   view_func=OUDetail.as_view('OUDetail'),
                   methods=['GET', 'POST', 'PATCH'])


def init_app(app):
    app.register_blueprint(ou_bp)
    docs.spec.add_tag({
        'name': 'ou',
        'description': 'Organizational units'
    })
    docs.register(OUList, endpoint='OUList', blueprint='ous')
    docs.register(OUDetail, endpoint='OUDetail', blueprint='ous')
