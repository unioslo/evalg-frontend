#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for elections. """

import uuid
from evalg import db
from evalg.models import Base
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy_utils import UUIDType, URLType, JSONType
from evalg.models.ou import OrganizationalUnit
from flask import current_app


class PublicKey(Base):
    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    fingerprint = db.Column(db.Text)


class AbstractElection(Base):
    __abstract__ = True

    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    name = db.Column(JSONType)
    description = db.Column(JSONType)
    mandate_type = db.Column(JSONType)
    meta = db.Column(JSONType)
    type = db.Column(db.Text)
    deleted = db.Column(db.Boolean, default=False)
    status = db.Column(db.Text)

    @declared_attr
    def public_key(self):
        return db.relationship(PublicKey)

    @declared_attr
    def public_key_id(self):
        return db.Column(UUIDType, db.ForeignKey('public_key.id'))

    @property
    def tz(self):
        return current_app.config['TZ']


class ElectionGroup(AbstractElection):
    type = db.Column(db.UnicodeText)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    ou_id = db.Column(UUIDType, db.ForeignKey('organizational_unit.id'))
    ou = db.relationship(OrganizationalUnit)
    information_url = db.Column(URLType)
    contact = db.Column(db.Text)
    mandate_period_start = db.Column(db.DateTime)
    mandate_period_end = db.Column(db.DateTime)
    has_multiple_elections = db.Column(db.Boolean, default=False)
    has_multiple_voting_times = db.Column(db.Boolean, default=False)
    has_multiple_mandate_times = db.Column(db.Boolean, default=False)
    has_multiple_contact_info = db.Column(db.Boolean, default=False)
    has_multiple_info_urls = db.Column(db.Boolean, default=False)
    has_gender_quota = db.Column(db.Boolean, default=False)


class Election(AbstractElection):
    _start = db.Column(db.DateTime)
    _end = db.Column(db.DateTime)
    _information_url = db.Column(URLType)
    _contact = db.Column(db.Text)
    _mandate_period_start = db.Column(db.DateTime)
    _mandate_period_end = db.Column(db.DateTime)
    active = db.Column(db.Boolean, default=False)
    group_id = db.Column(UUIDType, db.ForeignKey('election_group.id'))
    group = db.relationship('ElectionGroup', backref='elections',
                            lazy='joined')
    nr_of_candidates = db.Column(db.Integer)
    nr_of_co_candidates = db.Column(db.Integer)

    @property
    def ou_id(self):
        return self.group.ou_id

    @property
    def ou(self):
        return self.group.ou

    @property
    def list_ids(self):
        return [l.id for l in self.lists if not l.deleted]

    @property
    def start(self):
        if self.group.has_multiple_voting_times:
            return self._start
        return self.group.start

    @start.setter
    def start(self, value):
        self._start = value

    @property
    def end(self):
        if self.group.has_multiple_voting_times:
            return self._end
        return self.group.end

    @end.setter
    def end(self, value):
        self._end = value

    @property
    def information_url(self):
        if self.group.has_multiple_info_urls:
            return self._information_url
        return self.group.information_url

    @information_url.setter
    def information_url(self, value):
        self._information_url = value

    @property
    def contact(self):
        if self.group.has_multiple_contact_info:
            return self._contact
        return self.group.contact

    @contact.setter
    def contact(self, value):
        self._contact = value

    @property
    def mandate_period_start(self):
        if self.group.has_multiple_mandate_times:
            return self._mandate_period_start
        return self.group.mandate_period_start

    @mandate_period_start.setter
    def mandate_period_start(self, value):
        self._mandate_period_start = value

    @property
    def mandate_period_end(self):
        if self.group.has_multiple_mandate_times:
            return self._mandate_period_end
        return self.group.mandate_period_end

    @mandate_period_end.setter
    def mandate_period_end(self, value):
        self._mandate_period_end = value

    @property
    def read_only_fields(self):
        return ['ou', 'ou_id']
