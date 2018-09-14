#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for elections. """

import uuid
from datetime import datetime
from evalg import db
from evalg.models import Base
from sqlalchemy.sql import select, func, case, and_
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_json import NestedMutableJson, MutableJson
from sqlalchemy_utils import UUIDType, URLType
from evalg.models.ou import OrganizationalUnit
from flask import current_app


class AbstractElection(Base):
    """ Base model for elections and election groups. """
    __abstract__ = True

    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    name = db.Column(MutableJson)
    """ Translated name """

    description = db.Column(MutableJson)
    """ Translated text """

    type = db.Column(db.UnicodeText)
    """ Internal use """

    candidate_type = db.Column(db.Text)
    """ single | single-team | party-list """

    mandate_type = db.Column(MutableJson)
    """ Translated HR type """

    meta = db.Column(NestedMutableJson)
    """ Template metadata """

    @property
    def tz(self):
        return 'UTC'
        return current_app.config['TZ']


class ElectionGroup(AbstractElection):
    ou_id = db.Column(UUIDType, db.ForeignKey('organizational_unit.id'),
                      nullable=False)
    ou = db.relationship(OrganizationalUnit)
    elections = db.relationship('Election')
    """ Organizational unit. """

    public_key = db.Column(db.Text)
    """ Public election key """

    announced_at = db.Column(db.DateTime)
    """ Announced if set """

    published_at = db.Column(db.DateTime)
    """ Published if set """

    cancelled_at = db.Column(db.DateTime)
    """ Cancelled if set """

    deleted_at = db.Column(db.DateTime)
    """ Deleted if set """

    def announce(self):
        """ Mark as announced. """
        self.announced_at = datetime.utcnow()

    def unannounce(self):
        """ Mark as unannounced. """
        self.announced_at = None

    @hybrid_property
    def announced(self):
        return self.announced_at is not None

    def publish(self):
        """ Mark as published. """
        self.published_at = datetime.utcnow()

    def unpublish(self):
        """ Mark as unpublished. """
        self.published_at = None

    @hybrid_property
    def published(self):
        return self.published_at is not None

    def cancel(self):
        """ Mark as cancelled. """
        self.cancelled_at = datetime.utcnow()

    @hybrid_property
    def cancelled(self):
        return self.cancelled_at is not None

    def delete(self):
        """ Mark as deleted. """
        self.deleted_at = datetime.utcnow()

    @hybrid_property
    def deleted(self):
        return self.deleted_at is not None

    @hybrid_property
    def status(self):
        statuses = set(list(map(lambda x: x.status, self.elections)))
        if not statuses:
            return 'draft'
        if len(statuses) == 1:
            return statuses.pop()
        return 'multipleStatuses'

    # @status.expression
    # def status(cls):
    #     # TODO: make expression
    #     return ''


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
    election_group = db.relationship('ElectionGroup', back_populates='elections',
                            lazy='joined')
    lists = db.relationship('ElectionList')
    pollbooks = db.relationship('PollBook')

    active = db.Column(db.Boolean, default=False)
    """ Whether election is active.
    We usually create more elections than needed to make templates consistent.
    But not all elections should be used. This can improve voter UI, by telling
    voter that their group does not have an active election. """

    @hybrid_property
    def announced_at(self):
        return self.group.announced_at

    @announced_at.expression
    def announced_at(cls):
        return select([ElectionGroup.announced_at]).where(
            cls.group_id == ElectionGroup.id).as_scalar()

    @hybrid_property
    def published_at(self):
        return self.group.published_at

    @published_at.expression
    def announced_at(cls):
        return select([ElectionGroup.published_at]).where(
            cls.group_id == ElectionGroup.id).as_scalar()

    @hybrid_property
    def cancelled_at(self):
        return self.group.cancelled_at

    @cancelled_at.expression
    def cancelled_at(cls):
        return select([ElectionGroup.cancelled_at]).where(
            cls.group_id == ElectionGroup.id).as_scalar()

    @hybrid_property
    def status(self):
        """ draft → announced → published → ongoing/closed/cancelled """
        if self.election_group.cancelled_at:
            return 'cancelled'
        if self.election_group.published_at:
            if self.end <= datetime.utcnow():
                return 'closed'
            if self.start < datetime.utcnow():
                return 'ongoing'
            return 'published'
        if self.election_group.announced_at:
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
