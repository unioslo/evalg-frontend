#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for poll books. """

import uuid
from sqlalchemy_utils import UUIDType, JSONType
from evalg import db
from evalg.models import Base


class PollBook(Base):
    """ Poll book / census. """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    name = db.Column(JSONType)
    weight = db.Column(db.Integer, nullable=False, default=1)
    priority = db.Column(db.Integer, nullable=False, default=0)
    deleted = db.Column(db.Boolean, default=False)
    election_id = db.Column(UUIDType,
                            db.ForeignKey('election.id'),
                            nullable=False)

    election = db.relationship('Election', backref='pollbooks')

    def __repr__(self):
        return '<PollBook {id}>'.format(id=self.id)
