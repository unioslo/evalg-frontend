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
    ou_id = db.Column(UUIDType, db.ForeignKey('organizational_unit.id'),
                      nullable=False)
    ou = db.relationship(OrganizationalUnit)
    """ Organizational unit. """

    @property
    def has_multiple_elections(self):
        return self.type != 'single-election'


class Election(AbstractElection):
    """ Election. """
    sequence = db.Column(db.Text)
    """ Some ID for the UI """

    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    information_url = db.Column(URLType)
    contact = db.Column(db.Text)
    mandate_period_start = db.Column(db.DateTime)
    mandate_period_end = db.Column(db.DateTime)
    group_id = db.Column(UUIDType, db.ForeignKey('election_group.id'))
    group = db.relationship('ElectionGroup', backref='elections',
                            lazy='joined')

    active = db.Column(db.Boolean, default=False)
    """ Whether election is active.
    We usually create more elections than needed to make templates consistent.
    But not all elections should be used. This can improve voter UI, by telling
    voter that their group does not have an active election. """

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

    def publish(self):
        """ Mark as published. """
        self.published_at = datetime.utcnow()

    @hybrid_property
    def published(self):
        return self.published_at is not None

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

    @property
    def ou_id(self):
        return self.group.ou_id

    @property
    def ou(self):
        return self.group.ou

    @property
    def list_ids(self):
        return [l.id for l in self.lists if not l.deleted]
