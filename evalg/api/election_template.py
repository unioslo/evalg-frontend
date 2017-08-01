#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate API. """
from flask import Blueprint, current_app
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import docs
from evalg.api import BaseSchema, add_all_authz
from evalg.api.election import ElectionGroupSchema
from evalg.election_template_builder import election_template_builder
from evalg.metadata import make_group_from_template
from ..models.ou import OrganizationalUnit


bp = Blueprint('electiontemplate', __name__)

add_all_authz(globals())


class ElectionTemplateSchema(BaseSchema):
    election_types = fields.Dict()
    ou_lists = fields.Dict()
    template_root = fields.Dict()

    class Meta:
        strict = True


@doc(tags=['electiontemplate'])
class ElectionTemplate(MethodResource):
    """ Candidate API. """
    @marshal_with(ElectionTemplateSchema())
    @doc(summary='Get the election template')
    def get(self):
        return election_template_builder()


bp.add_url_rule('/electiontemplate/',
                view_func=ElectionTemplate.as_view('ElectionTemplate'),
                methods=['GET'])


@doc(tags=['electiontemplate'])
class ElectionTemplateNewGroup(MethodResource):
    """ Candidate API. """
    @use_kwargs({'group': fields.Dict(),
                 'name': fields.Dict(),
                 'ou_id': fields.UUID()})
    @marshal_with(ElectionGroupSchema())
    @doc(summary='Create new elections')
    def post(self, ou_id=None, name=None, group=None):
        ou = OrganizationalUnit.query.get_or_404(ou_id)
        grp = make_group_from_template(name, group, ou=ou)
        current_app.logger.info('Test: %s', grp)
        return grp


bp.add_url_rule('/electiontemplate/newelection/',
                view_func=ElectionTemplateNewGroup.as_view(
                    'ElectionTemplateNewGroup'),
                methods=['POST'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'electiontemplate',
        'description': 'Operations on electiontemplate'
    })
    docs.register(ElectionTemplate,
                  endpoint='ElectionTemplate',
                  blueprint='electiontemplate')
    docs.register(ElectionTemplateNewGroup,
                  endpoint='ElectionTemplateNewGroup',
                  blueprint='electiontemplate')
