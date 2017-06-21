#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Helper that populates tables with example data. """

from evalg import app, db

from flask_fixtures import FixturesMixin


class Populator(FixturesMixin):
    fixtures = ['ous.json',
                'elections.json',
                'election_lists.json',
                'candidates.json',
                'pollbooks.json',
                'persons.json',
                'voters.json']

    app = app
    db = db
