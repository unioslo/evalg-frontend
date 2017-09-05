#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate model. """

import uuid
from evalg import db
from evalg.models import Base
from sqlalchemy_utils import UUIDType, URLType, JSONType


class ElectionList(Base):
    """ List of electable candidates in an election. """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    name = db.Column(JSONType)
    description = db.Column(JSONType)
    information_url = db.Column(URLType)
    election_id = db.Column(UUIDType,
                            db.ForeignKey('election.id'),
                            nullable=False)
    election = db.relationship('Election', back_populates='lists', lazy='joined')
    candidates = db.relationship('Candidate')

    def __repr__(self):
        return '<ElectionList {id}>'.format(id=self.id)
