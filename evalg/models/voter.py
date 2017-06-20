# -*- coding: utf-8 -*-

import uuid

from sqlalchemy_utils import UUIDType

from evalg import db


class VoterStatus(db.Model):
    """
    The voter status-code / census-member status-code model
    """
    code = db.Column(db.UnicodeText, primary_key=True)
    description = db.Column(db.UnicodeText)

    def __repr__(self):
        return '<VoterStatus {code}>'.format(code=self.code)


class Voter(db.Model):
    """
    The Voter / Census-member model
    """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    tag = db.Column(db.UnicodeText)
    pollbook_person_id = db.Column(UUIDType,
                                   db.ForeignKey('person.id'),
                                   nullable=False)
    pollbook_id = db.Column(UUIDType,
                            db.ForeignKey('poll_book.id'),
                            nullable=False)
    voter_status_id = db.Column(UUIDType,
                                db.ForeignKey('voter_status.id'),
                                nullable=False)

    pollbook = db.relationship('PollBook', backref='voters')
    voter_status = db.relationship('VoterStatus')  # no bakref needed

    def __repr__(self):
        return '<Voter {id}>'.format(id=self.id)
