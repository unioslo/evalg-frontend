#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate model. """
import uuid

from evalg import db
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from sqlalchemy_utils import UUIDType


class Candidate(db.Model):
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    list_id = db.Column(UUIDType,
                        db.ForeignKey('election_list.id'),
                        nullable=False)
    rel_list_id = relationship('ElectionList', back_populates='candidates')
    candidate_name = db.Column(db.UnicodeText)
    data = db.Column(JSON)
    deleted = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, default=0)

    def __repr__(self):
        return '<Candidate %r>' % self.id
