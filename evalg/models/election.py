#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election models. """
from evalg import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy_utils import TranslationHybrid, UUIDType, URLType


# TODO: fetch from config
def get_locale():
    return 'no'

translation_hybrid = TranslationHybrid(
    current_locale=get_locale,
    default_locale='en'
)


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


class AbstractElection(db.Model):
    __abstract__ = True

    id = db.Column(UUIDType, primary_key=True)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)

    mandate_period_start = db.Column(db.DateTime)
    mandate_period_end = db.Column(db.DateTime)
    mandate_type_translations = db.Column(JSON)
    mandate_type = translation_hybrid(mandate_type_translations)

    @declared_attr
    def ou(self):
        return db.relationship('OrganizationalUnit')

    @declared_attr
    def ou_id(self):
        return db.Column(UUIDType, db.ForeignKey('organizational_unit.id'))

    @declared_attr
    def public_key(self):
        return db.relationship('PublicKey')

    @declared_attr
    def public_key_id(self):
        return db.Column(UUIDType, db.ForeignKey('public_key.id'))

    title_translations = db.Column(JSON)
    description_translations = db.Column(JSON)
    title = translation_hybrid(title_translations)
    description = translation_hybrid(description_translations)

    information_url = db.Column(URLType)
    contact = db.Column(db.Text)

    def __init__(self, start=None, end=None):
        self.start = start
        self.end = end

    def __repr__(self):
        return '<%s %r>'.format(self.__class__.__name__,
                                self.id)


class ElectionGroup(AbstractElection):
    pass


class Election(AbstractElection):
    group_id = db.Column(UUIDType, db.ForeignKey('election_group.id'))
    group = db.relationship('ElectionGroup', backref='elections',
                            lazy='joined')
