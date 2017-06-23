#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for voters. """

import uuid
from sqlalchemy_utils import UUIDType
from evalg import db
from evalg.models import Base
from evalg.models.pollbook import PollBook


class VoterStatus(Base):
    """ Voter / census member status code model. """
    code = db.Column(db.UnicodeText, primary_key=True)
    description = db.Column(db.UnicodeText)

    def __repr__(self):
        return '<VoterStatus {code}>'.format(code=self.code)


class Voter(Base):
    """ Voter / census member model."""
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    tag = db.Column(db.UnicodeText)
    pollbook_person_id = db.Column(UUIDType,
                                   db.ForeignKey('person.id'),
                                   nullable=False)
    pollbook_id = db.Column(UUIDType,
                            db.ForeignKey('poll_book.id'),
                            nullable=False)
    voter_status_id = db.Column(db.UnicodeText,
                                db.ForeignKey('voter_status.code'),
                                nullable=False)

    pollbook = db.relationship(PollBook, backref='voters')
    voter_status = db.relationship('VoterStatus')  # no bakref needed

    def __repr__(self):
        return '<Voter {id}>'.format(id=self.id)
