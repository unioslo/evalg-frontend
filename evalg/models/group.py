#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for groups. """

import datetime
import uuid
from sqlalchemy_utils import UUIDType
from evalg import db
from evalg.models import Base


class Group(Base):
    """ Group of persons. """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    dp_group_id = db.Column(db.UnicodeText, index=True)
    name = db.Column(db.UnicodeText, nullable=False)
    last_update = db.Column(db.DateTime, default=datetime.datetime.now)
    principals = db.relationship('GroupPrincipal')
    external_ids = db.relationship('GroupExternalID', back_populates='group')

    def __repr__(self):
        return '<Group {id}>'.format(id=self.id)


class GroupExternalIDType(Base):
    """ Group external ID type. """
    code = db.Column(db.UnicodeText, primary_key=True)
    description = db.Column(db.UnicodeText)

    def __repr__(self):
        return '<GroupExternalIDType code={code}>'.format(code=self.code)


class GroupExternalID(Base):
    """ Group external ID. """
    __tablename__ = 'group_external_id'

    group_id = db.Column(UUIDType, db.ForeignKey('group.id'), nullable=False)
    external_id = db.Column(db.UnicodeText, primary_key=True)
    type_code = db.Column(
        db.UnicodeText,
        db.ForeignKey('group_external_id_type.code'),
        primary_key=True)

    group = db.relationship('Group', back_populates='external_ids')
    id_type = db.relationship('GroupExternalIDType')  # no b.ref needed

    def __repr__(self):
        return '<GroupExternalID {id}.{code}={extid}>'.format(
            id=self.group_id, code=self.type_code, extid=self.external_id)
