#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for elections. """

import uuid
from evalg import db
from evalg.models import Base
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy_utils import UUIDType, URLType
from evalg.models.ou import OrganizationalUnit


class PublicKey(Base):
    id = db.Column(UUIDType, default=uuid.uuid4(), primary_key=True)
    fingerprint = db.Column(db.Text)

    def __init__(self, fingerprint):
        self.fingerprint = fingerprint


class AbstractElection(Base):
    __abstract__ = True

    id = db.Column(UUIDType, default=uuid.uuid4(), primary_key=True)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    title = db.Column(JSON)
    description = db.Column(JSON)
    information_url = db.Column(URLType)
    contact = db.Column(db.Text)
    mandate_period_start = db.Column(db.DateTime)
    mandate_period_end = db.Column(db.DateTime)
    mandate_type = db.Column(JSON)

    @declared_attr
    def ou(self):
        return db.relationship(OrganizationalUnit)

    @declared_attr
    def ou_id(self):
        return db.Column(UUIDType, db.ForeignKey('organizational_unit.id'))

    @declared_attr
    def public_key(self):
        return db.relationship(PublicKey)

    @declared_attr
    def public_key_id(self):
        return db.Column(UUIDType, db.ForeignKey('public_key.id'))


class ElectionGroup(AbstractElection):
    pass


class Election(AbstractElection):
    group_id = db.Column(UUIDType, db.ForeignKey('election_group.id'))
    group = db.relationship('ElectionGroup', backref='elections',
                            lazy='joined')
