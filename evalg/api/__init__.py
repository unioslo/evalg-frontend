#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import jsonify
from evalg import ma
from marshmallow import SchemaOpts, ValidationError, fields, validates_schema


def handle_unprocessable_entity(err):
    data = getattr(err, 'data', {})
    messages = data.get('messages', ['Invalid request'])
    return jsonify({
        'messages': messages,
    }), 422


class BaseSchemaOpts(SchemaOpts):
    """ Extra Meta options for BaseSchema. """
    def __init__(self, meta, **kwargs):
        SchemaOpts.__init__(self, meta, **kwargs)
        self.allow_unknown_fields = getattr(meta, 'allow_unknown_fields',
                                            False)


class BaseSchema(ma.Schema):
    OPTIONS_CLASS = BaseSchemaOpts

    @validates_schema(pass_original=True)
    def check_unknown_fields(self, data, original_data):
        if self.opts.allow_unknown_fields:
            return
        unknown = set(original_data) - set(self.fields)
        if unknown:
            raise ValidationError("Unknown field", unknown)


class TranslatedString(object):
    """ Dynamically generated schema with a field per configured language. """
    klass = None

    @classmethod
    def translation_fields(cls, languages):
        """ Generate a marshmallow string field per language. """
        return {lang: fields.Str(description=name)
                for lang, name in languages.items()}

    @classmethod
    def configure(cls, app):
        cls.klass = type('TranslatedString',
                         (BaseSchema, ),
                         cls.translation_fields(app.config['LANGUAGES']))

    def __new__(cls, **kwargs):
        return cls.klass(**kwargs)


def init_app(app):
    # Error handlers
    app.register_error_handler(422, handle_unprocessable_entity)

    # Configure languages
    TranslatedString.configure(app)

    # Configure blueprints
    from evalg.api import (election,
                           election_list,
                           ou,
                           candidate)
    election.init_app(app)
    election_list.init_app(app)
    ou.init_app(app)
    candidate.init_app(app)
