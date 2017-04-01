#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Module for bootstrapping the eValg application.

"""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.contrib.fixers import ProxyFix
from setuptools_scm import get_version

from evalg_common.configuration import init_config
from evalg_common.logging import init_logging
from evalg_common import request_id
from evalg_common import cli as common_cli

from . import default_config
from . import election

__VERSION__ = get_version()

APP_CONFIG_ENVIRON_NAME = 'EVALG_CONFIG'
""" Name of an environmet variable to read config file name from.

This is a useful method to set a config file if the application is started
through a third party application server like *gunicorn*.
"""

APP_CONFIG_FILE_NAME = 'evalg_config.py'
""" Config filename in the Flask application instance path. """


class WsgiApp(object):
    """ Wsgi app proxy object. """

    @staticmethod
    def create(config=None, flask_class=Flask):
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

        # Setup modules
        election.init_app(app)

        # Add cache headers to all responses
        @app.after_request
        def set_cache_headers(response):
            response.headers['Pragma'] = 'no-cache'
            response.headers['Cache-Control'] = 'no-cache'
            return response

        return app

    @property
    def app(self):
        """ Lazily create the application. """
        if not hasattr(self, '_app'):
            self._app = self.create()
        return self._app

    def __call__(self, *args, **kwargs):
        """ Run the application on a request. """
        return self.app(*args, **kwargs)


wsgi = WsgiApp()
""" WSGI app. """

app = wsgi.app
""" Flask app. """

db = SQLAlchemy(app)
""" Database. """
