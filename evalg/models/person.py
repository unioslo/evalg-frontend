# -*- coding: utf-8 -*-

import datetime
import uuid

from sqlalchemy_utils import UUIDType

from evalg import db


class Person(db.Model):
    """
    The person model
    """
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


class PersonExternalIDType(db.Model):
    """
    The Person external id-type model
    """
    code = db.Column(db.UnicodeText, primary_key=True)
    description = db.Column(db.UnicodeText)

    def __repr__(self):
        return '<PersonExternalIDType {id}>'.format(id=self.id)


class PersonExternalID(db.Model):
    """
    The person external id model
    """
    id = db.Column(UUIDType, primary_key=True, default=uuid.uuid4)
    person_id = db.Column(UUIDType, db.ForeignKey('person.id'), nullable=False)
    person_id_type_id = db.Column(
        db.UnicodeText,
        db.ForeignKey('person_external_id_type.code'),
        nullable=False)

    person = db.relationship('Person', backref='external_ids')
    person_id_type = db.relationship('PersonExternalIDType')  # no b.ref needed

    def __repr__(self):
        return '<PersonExternalID {id}>'.format(id=self.id)
