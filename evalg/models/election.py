#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election models. """
from .. import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy_utils import TranslationHybrid, UUIDType


# TODO: fetch from config
def get_locale():
    return 'no'

translation_hybrid = TranslationHybrid(
    current_locale=get_locale,
    default_locale='en'
)


class AbstractElection(db.Model):
    __abstract__ = True

    id = db.Column(UUIDType, primary_key=True)
    start = db.DateTime()
    end = db.DateTime()

    mandate_period_start = db.DateTime()
    mandate_period_end = db.DateTime()
    mandate_type_translations = db.Column(JSON)
    mandate_type = translation_hybrid(mandate_type_translations)

    ou = db.relationship('OrganizationalUnit')
    public_key = db.relationship('PublicKey')

    title_translations = db.Column(JSON)
    description_translations = db.Column(JSON)
    title = translation_hybrid(title_translations)
    description = translation_hybrid(description_translations)

    def __init__(self, start=None, end=None):
        self.start = start
        self.end = end

    def __repr__(self):
        return '<%s %r>'.format(self.__class__.__name__,
                                self.id)


class OrganizationalUnit(db.Model):
    id = db.Column(UUIDType, primary_key=True)
    name = db.String()

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<OrganizationalUnit %r>' % self.id


class PublicKey(db.Model):
    id = db.Column(UUIDType, primary_key=True)
    fingerprint = db.String()

    def __init__(self, fingerprint):
        self.fingerprint = fingerprint

    def __repr__(self):
        return '<PublicKey %r>' % self.id
