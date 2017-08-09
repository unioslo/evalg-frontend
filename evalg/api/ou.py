#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" The OU API. """

from flask import Blueprint, make_response
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import db, ma, docs
from evalg.api import BaseSchema, TranslatedString, or404, add_all_authz
from evalg.organization import (get_ou, update_ou, make_ou, list_ous)

bp = Blueprint('ous', __name__)
add_all_authz(globals())
get_ou = or404(get_ou)


class OrganizationalUnitSchema(BaseSchema):
    _links = ma.Hyperlinks({
        'self': ma.URLFor('ous.OUDetail', ou_id='<id>'),
        'collection': ma.URLFor('ous.OUCollection'),
    })

    id = fields.UUID()
    name = fields.Nested(TranslatedString())
    external_id = fields.Str()
    tag = fields.Str()

    class Meta:
        strict = True
        dump_only = ('_links', 'id', 'children')


ou_schema = OrganizationalUnitSchema()


@doc(tags=['ou'])
class OUDetail(MethodResource):
    """ Resource for single OUs. """
    @marshal_with(ou_schema)
    @doc(summary='Get an organizational unit')
    def get(self, ou_id):
        return get_ou(ou_id)

    @use_kwargs(ou_schema)
    @marshal_with(ou_schema)
    @doc(summary='Update an organizational unit')
    def post(self, ou_id, **kwargs):
        ou = get_ou(ou_id)
        update_ou(ou, **kwargs)
        db.session.commit()
        return ou

    @use_kwargs(OrganizationalUnitSchema(strict=False))
    @marshal_with(ou_schema)
    @doc(summary='Partially update an organizational unit')
    def patch(self, ou_id, **kwargs):
        ou = get_ou(ou_id)
        for k, v in kwargs.items():
            setattr(ou, k, v)
        db.session.commit()
        return ou

    @marshal_with(None, code=204)
    @doc(summary='Delete an organizational unit')
    def delete(self, ou_id):
        ou = get_ou(ou_id)
        update_ou(ou, deleted=True)
        db.session.commit()
        return make_response('', 204)


@doc(tags=['ou'])
class OUCollection(MethodResource):
    """ Resource for OU collections. """
    @marshal_with(OrganizationalUnitSchema(many=True))
    @doc(summary='List organizational units')
    def get(self):
        return list_ous()

    @use_kwargs(ou_schema)
    @marshal_with(ou_schema, code=201)
    @doc(summary='Create an organizational unit')
    def post(self, **kwargs):
        ou = make_ou(**kwargs)
        db.session.add(ou)
        db.session.commit()
        return ou, 201


bp.add_url_rule('/ous/',
                view_func=OUCollection.as_view('OUCollection'),
                methods=['GET', 'POST'])
bp.add_url_rule('/ous/<uuid:ou_id>',
                view_func=OUDetail.as_view('OUDetail'),
                methods=['GET', 'POST', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'ou',
        'description': 'Organizational units'
    })
    docs.register(OUCollection, endpoint='OUCollection', blueprint='ous')
    docs.register(OUDetail, endpoint='OUDetail', blueprint='ous')
