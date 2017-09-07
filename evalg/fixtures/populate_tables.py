#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Helper that populates tables with example data. """

from flask import current_app
from flask_fixtures import FixturesMixin
from evalg import db


class Populator(FixturesMixin):
    fixtures = [
        'ous.json',
        'elections.json',
        'election_lists.json',
        'candidates.json',
        'pollbooks.json',
        'persons.json',
        'groups.json',
        'voters.json',
        'authz.json',
    ]

    app = current_app
    db = db
