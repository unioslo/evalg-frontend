#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The group API. """
from flask import Blueprint, make_response

from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, docs
from evalg.api import BaseSchema, add_all_authz
from evalg.group import search_group


bp = Blueprint('groups', __name__)
add_all_authz(globals())


class GroupSchema(BaseSchema):
    id = fields.UUID()
    dp_group_id = fields.String()
    name = fields.String()
    last_update = fields.DateTime()

    class Meta:
        strict = True
        dump_only = ('id', )



@doc(tags=['group'])
class GroupSearch(MethodResource):
    @use_kwargs({'filter': fields.Str()}, locations=['query'])
    @marshal_with(GroupSchema(many=True))
    @doc(summary='Search for groups')
    def get(self, filter):
        return search_group(filter)


bp.add_url_rule('/groups/search/',
                view_func=GroupSearch.as_view('GroupSearch'),
                methods=['GET'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'group',
        'description': 'Operations on groups'})
    docs.register(GroupSearch,
                  endpoint='GroupSearch',
                  blueprint='groups')
