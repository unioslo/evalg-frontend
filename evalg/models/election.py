#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for elections. """

import uuid
from datetime import datetime
from evalg import db
from evalg.models import Base
from sqlalchemy.sql import func, case, and_
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_utils import UUIDType, URLType, JSONType
from evalg.models.ou import OrganizationalUnit
from flask import current_app


class PublicKey(Base):
    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    fingerprint = db.Column(db.Text)


class AbstractElection(Base):
    """ Base model for elections and election groups. """
    __abstract__ = True

    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    name = db.Column(JSONType)
    """ Translated name """

    description = db.Column(JSONType)
    """ Translated text """

    type = db.Column(db.UnicodeText)
    """ Internal use """

    candidate_type = db.Column(db.Text)
    """ single | single-team | party-list """

    mandate_type = db.Column(JSONType)
    """ Translated HR type """

    meta = db.Column(JSONType)
    """ Template metadata """

    announced_at = db.Column(db.DateTime)
    """ Announced if set """

    published_at = db.Column(db.DateTime)
    """ Published if set """

    cancelled_at = db.Column(db.DateTime)
    """ Cancelled if set """

    deleted_at = db.Column(db.DateTime)
    """ Deleted if set """

    def delete(self):
        """ Mark as deleted. """
        self.deleted_at = datetime.utcnow()

    @property
    def deleted(self):
        return self.deleted_at is not None

    @hybrid_property
    def status(self):
        """ draft → announced → published → ongoing/closed/cancelled """
        if self.cancelled_at:
            return 'cancelled'
        if self.published_at:
            if self.end <= datetime.utcnow():
                return 'closed'
            if self.start > datetime.utcnow():
                return 'ongoing'
            return 'published'
        if self.announced_at:
            return 'announced'
        return 'draft'

    @status.expression
    def status(cls):
        return case([
            (cls.cancelled_at.isnot(None), 'cancelled'),
            (and_(cls.published_at.isnot(None),
                  cls.end <= func.now()), 'closed'),
            (and_(cls.published_at.isnot(None),
                  cls.start < func.now()), 'ongoing'),
            (cls.published_at.isnot(None), 'published'),
            (cls.announced_at.isnot(None), 'announced')],
            else_='draft')

    @declared_attr
    def public_key(self):
        return db.relationship(PublicKey)

    @declared_attr
    def public_key_id(self):
        return db.Column(UUIDType, db.ForeignKey('public_key.id'))

    @property
    def tz(self):
        return 'CET'
        return current_app.config['TZ']


class ElectionGroup(AbstractElection):
    """ Election group. """
    start = db.Column(db.DateTime)
    """ Start time """

    end = db.Column(db.DateTime)
    """ End time """

    ou_id = db.Column(UUIDType, db.ForeignKey('organizational_unit.id'),
                      nullable=False)
    ou = db.relationship(OrganizationalUnit)
    """ Organizational unit. """

    information_url = db.Column(URLType)
    """ URL for voter's help """

    contact = db.Column(db.Text)
    """ Contact point for voters """

    mandate_period_start = db.Column(db.DateTime)
    mandate_period_end = db.Column(db.DateTime)
    """ Mandate period """

    @property
    def has_multiple_elections(self):
        return self.type != 'single-election'

    # Settings for UI. TBD: Make a JSON called ui_settings?
    has_multiple_voting_times = db.Column(db.Boolean, default=False)
    has_multiple_mandate_times = db.Column(db.Boolean, default=False)
    has_multiple_contact_info = db.Column(db.Boolean, default=False)
    has_multiple_info_urls = db.Column(db.Boolean, default=False)
    has_gender_quota = db.Column(db.Boolean, default=False)


class Election(AbstractElection):
    """ Election. """
    sequence = db.Column(db.Text)
    """ Some ID for the UI """

    _start = db.Column(db.DateTime)
    _end = db.Column(db.DateTime)
    _information_url = db.Column(URLType)
    _contact = db.Column(db.Text)
    _mandate_period_start = db.Column(db.DateTime)
    _mandate_period_end = db.Column(db.DateTime)
    group_id = db.Column(UUIDType, db.ForeignKey('election_group.id'))
    group = db.relationship('ElectionGroup', backref='elections',
                            lazy='joined')

    # TODO: Settings dependent on election type, move into JSON field
    nr_of_candidates = db.Column(db.Integer)
    nr_of_co_candidates = db.Column(db.Integer)

    active = db.Column(db.Boolean, default=False)
    """ Whether election is active.
    We usually create more elections than needed to make templates consistent.
    But not all elections should be used. This can improve voter UI, by telling
    voter that their group does not have an active election. """

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
    def pollbook_ids(self):
        return [p.id for p in self.pollbooks if not p.deleted]

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
