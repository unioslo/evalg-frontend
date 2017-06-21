#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for elections. """

import uuid
from evalg import db
from evalg.models import Base
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy_utils import UUIDType, URLType, JSONType
from evalg.models.ou import OrganizationalUnit


class PublicKey(Base):
    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    fingerprint = db.Column(db.Text)


class AbstractElection(Base):
    __abstract__ = True

    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    name = db.Column(JSONType)
    description = db.Column(JSONType)
    information_url = db.Column(URLType)
    contact = db.Column(db.Text)
    mandate_period_start = db.Column(db.DateTime)
    mandate_period_end = db.Column(db.DateTime)
    mandate_type = db.Column(JSONType)
    meta = db.Column(JSONType)
    deleted = db.Column(db.Boolean, default=False)

    @declared_attr
    def ou(self):
        return db.relationship(OrganizationalUnit)

    @declared_attr
    def ou_id(self):
        return db.Column(UUIDType, db.ForeignKey('organizational_unit.id'), nullable=False)

    @declared_attr
    def public_key(self):
        return db.relationship(PublicKey)

    @declared_attr
    def public_key_id(self):
        return db.Column(UUIDType, db.ForeignKey('public_key.id'))


class ElectionGroup(AbstractElection):
    election_type = db.Column(db.UnicodeText)


class Election(AbstractElection):
    group_id = db.Column(UUIDType, db.ForeignKey('election_group.id'))
    group = db.relationship('ElectionGroup', backref='elections',
                            lazy='joined')
