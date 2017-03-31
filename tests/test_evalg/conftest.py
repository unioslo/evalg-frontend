#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" py.test test configuration and common fixtures. """
from __future__ import unicode_literals, absolute_import, print_function

import pytest


@pytest.fixture
def config():
    """ Application config. """
    config_ = object()
    return config_


@pytest.fixture
def app(config):
    """ Flask application. """
    from flask import Flask
    app_ = Flask('unit-tests')
    app_.config.from_object(config)
    return app_
