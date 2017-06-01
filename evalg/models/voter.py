# -*- coding: utf-8 -*-

import uuid

from sqlalchemy_utils import UUIDType

from evalg import db
from evalg.models import Base


class VoterStatus(db.Model):
    """
    The voter status-code / census-member status-code model
    """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    code = db.Column(db.UnicodeText, index=True, unique=True, nullable=False)
    description = db.Column(db.UnicodeText)
    deleted = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<VoterStatus {id}>'.format(id=self.id)


class Voter(db.Model):
    """
    The Voter / Census-member model
    """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    tag = db.Column(db.UnicodeText)
    deleted = db.Column(db.Boolean, default=False)
    pollbook_person_id = db.Column(UUIDType)  # TODO
    pollbook_id = db.Column(UUIDType,
                            db.ForeignKey('polbook.id'),
                            nullable=False)
    voter_status_id = db.Column(UUIDType,
                                db.ForeignKey('voter_status.id'),
                                nullable=False)

    pollbook = db.relationship('PollBook', backref='voters')
    voter_status = db.relationship('VoterStatus')  # no bakref needed

    def __repr__(self):
        return '<Voter {id}>'.format(id=self.id)
