#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Module for bootstrapping the eValg application.

"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_apispec.extension import FlaskApiSpec
from flask_cors import CORS
from werkzeug.contrib.fixers import ProxyFix
from setuptools_scm import get_version

from evalg_common.configuration import init_config
from evalg_common.logging import init_logging
from evalg_common import request_id
from evalg_common import cli as common_cli

from evalg import default_config
from evalg import cli

__VERSION__ = get_version()

APP_CONFIG_ENVIRON_NAME = 'EVALG_CONFIG'
""" Name of an environmet variable to read config file name from.

This is a useful method to set a config file if the application is started
through a third party application server like *gunicorn*.
"""

APP_CONFIG_FILE_NAME = 'evalg_config.py'
""" Config filename in the Flask application instance path. """

db = SQLAlchemy()
""" Database. """

ma = Marshmallow()
""" Marshmallow. """

migrate = Migrate()
""" Migrations. """

docs = FlaskApiSpec()
""" API documentation. """

cors = CORS()
""" CORS. """


def create_app(config=None, flask_class=Flask):
    """ Create application.

    :rtype: Flask
    :return: The assembled and configured Flask application.
    """
    # Setup Flask app
    app = flask_class(__name__,
                      static_folder=None,
                      instance_relative_config=True)

    # Setup CLI
    common_cli.init_app(app)
    cli.init_app(app)

    init_config(app, config,
                environ_name=APP_CONFIG_ENVIRON_NAME,
                default_file_name=APP_CONFIG_FILE_NAME,
                default_config=default_config)

    if app.config.get('NUMBER_OF_PROXIES', None):
        app.wsgi_app = ProxyFix(app.wsgi_app,
                                num_proxies=app.config.get(
                                    'NUMBER_OF_PROXIES'))

    # Setup logging
    init_logging(app)
    request_id.init_app(app)

    # Setup db
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db, directory='evalg/migrations')

    # Setup API
    docs.init_app(app)

    from evalg import api
    api.init_app(app)

    from evalg.api import (election,
                           election_list,
                           election_template,
                           ou,
                           candidate)
    election.init_app(app)
    election_list.init_app(app)
    election_template.init_app(app)
    ou.init_app(app)
    candidate.init_app(app)

    # Setup CORS
    cors.init_app(app)

    # Add cache headers to all responses
    @app.after_request
    def set_cache_headers(response):
        response.headers['Pragma'] = 'no-cache'
        response.headers['Cache-Control'] = 'no-cache'
        return response

    return app

app = create_app()
""" Flask app. """
