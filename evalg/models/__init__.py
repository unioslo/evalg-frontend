#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Models and related tools and functionality. """

from evalg import db


class Base(db.Model):
    __abstract__ = True

    def __repr__(self):
        return '<{} {}>'.format(self.__class__.__name__,
                                getattr(self, id, id(self)))
