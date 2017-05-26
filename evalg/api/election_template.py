#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate API. """
from flask import Blueprint
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, docs
from evalg.api import BaseSchema
from evalg.election_template_builder import election_template_builder

bp = Blueprint('electiontemplate', __name__)


class ElectionTemplateSchema(BaseSchema):
    elections = fields.Dict()
    ou_lists = fields.Dict()
    template_root = fields.Dict()

    class Meta:
        strict = True


@doc(tags=['electiontemplate'])
class ElectionTemplate(MethodResource):
    """ Candidate API. """
    @use_kwargs({}, locations='query')
    @marshal_with(ElectionTemplateSchema())
    @doc(summary='Get the election template')
    def get(self):
        return election_template_builder()


bp.add_url_rule('/electiontemplate/',
                view_func=ElectionTemplate.as_view('ElectionTemplate'),
                methods=['GET'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'electiontemplate',
        'description': 'Operations on electiontemplate'
    })
    docs.register(ElectionTemplate,
                  endpoint='ElectionTemplate',
                  blueprint='electiontemplate')
