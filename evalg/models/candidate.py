#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for candidates. """

import uuid
from evalg import db
from evalg.models import Base
from sqlalchemy_utils import UUIDType, URLType, JSONType


class Candidate(Base):
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    list_id = db.Column(UUIDType,
                        db.ForeignKey('election_list.id'),
                        nullable=False)
    list = db.relationship('ElectionList', backref='candidates')
    name = db.Column(db.UnicodeText, nullable=False)
    meta = db.Column(JSONType)
    information_url = db.Column(URLType)
    priority = db.Column(db.Integer, default=0)
    pre_cumulated = db.Column(db.Boolean, default=False)
    user_cumulated = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<Candidate {id}>'.format(id=self.id)
