#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election models. """
from .. import db
from sqlalchemy_utils import UUIDType

# TODO: Internationalized models. Options include:
# - TranslationHybrid from SQLAlchemy-Utils seems to be the superior choice,
#   but it requires a postgres database which complicates dev setup somewhat
# - SQLAlchemy-i18n is database-agnostic but has more magic, dragons and joins


class ElectionGroup(db.Model):
    id = db.Column(UUIDType(), primary_key=True)
    start = db.DateTime()
    end = db.DateTime()

    def __init__(self, start=None, end=None):
        self.start = start
        self.end = end

    def __repr__(self):
        return '<ElectionGroup %r>' % self.id
