#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models for persons. """

import datetime
import uuid
from sqlalchemy_utils import UUIDType
from evalg import db
from evalg.models import Base


class Person(Base):
    """ Person. """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    dp_user_id = db.Column(db.UnicodeText, index=True)
    email = db.Column(db.UnicodeText, index=True)
    feide_id = db.Column(db.UnicodeText, index=True)
    first_name = db.Column(db.UnicodeText, nullable=False)
    last_name = db.Column(db.UnicodeText, nullable=False)
    last_update = db.Column(db.DateTime, default=datetime.datetime.now)
    # National Identity Number
    nin = db.Column(db.UnicodeText, index=True, nullable=False)
    username = db.Column(db.UnicodeText)

    def __repr__(self):
        return '<Person {id}>'.format(id=self.id)


class PersonExternalIDType(Base):
    """ Person external ID type. """
    code = db.Column(db.UnicodeText, primary_key=True)
    description = db.Column(db.UnicodeText)

    def __repr__(self):
        return '<PersonExternalIDType code={code}>'.format(code=self.code)


class PersonExternalID(Base):
    """ Person external ID. """
    __tablename__ = 'person_external_id'

    person_id = db.Column(UUIDType, db.ForeignKey('person.id'), nullable=False)
    external_id = db.Column(db.UnicodeText, primary_key=True)
    type_code = db.Column(
        db.UnicodeText,
        db.ForeignKey('person_external_id_type.code'),
        primary_key=True)

    person = db.relationship('Person', backref='external_ids')
    id_type = db.relationship('PersonExternalIDType')  # no b.ref needed

    def __repr__(self):
        return '<PersonExternalID {id}.{code}={extid}>'.format(
            id=self.person_id, code=self.type_code, extid=self.external_id)
