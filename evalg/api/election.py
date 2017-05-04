#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, abort
from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with, doc
from marshmallow import fields
from evalg import db, ma, docs
from evalg.models.election import ElectionGroup, Election


election_bp = Blueprint('elections', __name__)


class ElectionGroupSchema(ma.ModelSchema):
    _links = ma.Hyperlinks({
        'self': ma.URLFor('elections.ElectionGroupDetail', eg_id='<id>'),
        'collection': ma.URLFor('elections.ElectionGroupList'),
        'ou': ma.URLFor('ous.OUDetail', ou_id='<ou_id>')
    })

    class Meta:
        model = ElectionGroup
        dump_only = ('_links', 'elections')


class ElectionSchema(ma.ModelSchema):
    class Meta:
        model = Election
        dump_only = ('_links', )


@doc(tags=['election'])
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
    @doc(summary='Update an election group')
    def post(self, eg_id, **kwargs):
        eg = ElectionGroup.query.get(eg_id)
        if not eg:
            abort(404)
        pass

    @doc(summary='Delete an election group')
    def delete(self, eg_id):
        pass


@doc(tags=['election'])
class ElectionGroupList(MethodResource):
    """ Election group API. """
    @use_kwargs({}, locations='query')
    @marshal_with(ElectionGroupSchema(many=True))
    @doc(summary='List election groups')
    def get(self):
        return ElectionGroup.query.all()

    @use_kwargs(ElectionGroupSchema)
    @marshal_with(ElectionGroupSchema(strict=True))
    @doc(summary='Create an election group')
    def post(self, **kwargs):
        eg = ElectionGroup(**kwargs)
        db.session.add(eg)
        db.session.commit()


election_bp.add_url_rule('/electiongroups/',
                         view_func=ElectionGroupList.as_view(
                            'ElectionGroupList'),
                         methods=['GET', 'POST'])
election_bp.add_url_rule('/electiongroups/<uuid:eg_id>',
                         view_func=ElectionGroupDetail.as_view(
                            'ElectionGroupDetail'),
                         methods=['GET', 'POST', 'DELETE'])


def init_app(app):
    app.register_blueprint(election_bp)
    docs.spec.add_tag({
        'name': 'election',
        'description': 'Elections and election groups'
    })
    docs.register(ElectionGroupList,
                  endpoint='ElectionGroupList',
                  blueprint='elections')
    docs.register(ElectionGroupDetail,
                  endpoint='ElectionGroupDetail',
                  blueprint='elections')
