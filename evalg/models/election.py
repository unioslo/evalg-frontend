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

    deleted = db.Column(db.Boolean, default=False)
    """ If true, should not see """

    status = db.Column(db.Text)
    """ draft → public → closed """

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

    @property
    def has_multiple_elections(self):
        return self.type != 'single-election'

    # Settings for UI. TBD: Make a JSON called ui_settings?
    #has_multiple_voting_times = db.Column(db.Boolean, default=False)
    #has_multiple_mandate_times = db.Column(db.Boolean, default=False)
    #has_multiple_contact_info = db.Column(db.Boolean, default=False)
    #has_multiple_info_urls = db.Column(db.Boolean, default=False)
    #has_gender_quota = db.Column(db.Boolean, default=False)


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

    @property
    def running(self):
        """ active + public + start < now < end """
        return True
        import datetime
        now = datetime.datetime.now()
        return (self.active and
                self.status == 'public' and
                self.start <= now <= self.end)

    @property
    def ou_id(self):
        return self.group.ou_id

    @property
    def ou(self):
        return self.group.ou

    @property
    def list_ids(self):
        return [l.id for l in self.lists if not l.deleted]

