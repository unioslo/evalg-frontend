#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for poll books. """

import uuid
from sqlalchemy_utils import UUIDType
from sqlalchemy_json import NestedMutableJson
from evalg import db
from evalg.models import Base


class PollBook(Base):
    """ Poll book / census. """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    name = db.Column(NestedMutableJson)
    weight = db.Column(db.Integer, nullable=False, default=1)
    priority = db.Column(db.Integer, nullable=False, default=0)
    election_id = db.Column(UUIDType,
                            db.ForeignKey('election.id'),
                            nullable=False)
    election = db.relationship('Election', back_populates='pollbooks',
                               lazy='joined')
    voters = db.relationship('Voter')

    def __repr__(self):
        return '<PollBook {id}>'.format(id=self.id)
