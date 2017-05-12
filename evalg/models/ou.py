#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for organizational units. """

import uuid
from evalg import db
from evalg.models import Base
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy_utils import UUIDType


class OrganizationalUnit(Base):
    id = db.Column(UUIDType, default=uuid.uuid4, primary_key=True)
    name = db.Column(JSON, nullable=False)
    code = db.Column(db.Text, nullable=False)
    deleted = db.Column(db.Boolean, default=False)
    parent = db.relationship('OrganizationalUnit',
                             backref='children',
                             remote_side=id)
    parent_id = db.Column(UUIDType(), db.ForeignKey('organizational_unit.id'))
