#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate model. """
import uuid

from evalg import db
from sqlalchemy_utils import UUIDType


class ElectionList(db.Model):
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    election_id = db.Column(UUIDType,
                            db.ForeignKey('election.id'),
                            nullable=False)
    deleted = db.Column(db.Boolean, default=False)
    candidates = db.relationship('Candidate',
                                 back_populates='rel_list_id')

    def __repr__(self):
        return '<ElectionList %r>' % self.id
