#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The person API. """
from flask import Blueprint, make_response

from flask_apispec.views import MethodResource
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import doc
from marshmallow import fields
from evalg import db, docs
from evalg.api import BaseSchema, or404, add_all_authz
from evalg.person import (list_persons, make_person, get_person, update_person,
                          delete_person)

bp = Blueprint('persons', __name__)
add_all_authz(globals())
get_person = or404(get_person)


class PersonSchema(BaseSchema):
    id = fields.UUID()

    dp_user_id = fields.String()
    email = fields.String()
    feide_id = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    last_update = fields.DateTime()
    nin = fields.String()
    username = fields.String()

    class Meta:
        strict = True
        dump_only = ('id', )


@doc(tags=['person'])
class PersonList(MethodResource):
    @marshal_with(PersonSchema(many=True))
    @doc(summary='Get persons')
    def get(self):
        return list_persons()

    @use_kwargs(PersonSchema())
    @marshal_with(PersonSchema(), code=201)
    @doc(summary='Create a person')
    def post(self, **kwargs):
        p = make_person(**kwargs)
        db.session.add(p)
        db.session.commit()
        return (p, 201)


@doc(tags=['person'])
class PersonDetail(MethodResource):
    @marshal_with(PersonSchema())
    @doc(summary='Get a person')
    def get(self, id):
        return get_person(id)

    @marshal_with(PersonSchema())
    @use_kwargs(PersonSchema())
    @doc(summary='Partially update a person')
    def patch(self, id, **kwargs):
        p = get_person(id)
        update_person(p, **kwargs)
        db.session.commit()
        return p

    @marshal_with(None, code=204)
    @doc(summary='Delete a person')
    def delete(self, id):
        p = get_person(id)
        delete_person(p)
        db.session.commit()
        return make_response('', 204)


bp.add_url_rule('/persons/',
                view_func=PersonList.as_view('PersonList'),
                methods=['GET', 'POST'])
bp.add_url_rule('/persons/<uuid:id>',
                view_func=PersonDetail.as_view('PersonDetail'),
                methods=['GET', 'PATCH', 'DELETE'])


def init_app(app):
    app.register_blueprint(bp)
    docs.spec.add_tag({
        'name': 'person',
        'decription': 'Operations on persons'})
    docs.register(PersonList,
                  endpoint='PersonList',
                  blueprint='persons')
    docs.register(PersonDetail,
                  endpoint='PersonDetail',
                  blueprint='persons')
