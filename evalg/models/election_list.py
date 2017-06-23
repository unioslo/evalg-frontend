#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The candidate model. """
import uuid

from evalg import db
from sqlalchemy_utils import UUIDType, URLType, JSONType


class ElectionList(db.Model):
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    name = db.Column(JSONType)
    description = db.Column(JSONType)
    information_url = db.Column(URLType)
    election_id = db.Column(UUIDType,
                            db.ForeignKey('election.id'),
                            nullable=False)
    rel_election_id = db.relationship('Election', backref='lists')
    deleted = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return '<ElectionList %r>' % self.id
