#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This module contains factory methods for bootstrapping the eValg application.

"""
import os

from flask import Flask
from werkzeug.contrib.fixers import ProxyFix
from setuptools_scm import get_version

from .utils import request_id
from .utils.logging import init_logging
from . import default_config
from . import election

__VERSION__ = get_version()

APP_CONFIG_ENVIRON_NAME = 'EVALG_CONFIG'
""" Name of an environmet variable to read config file name from.

This is a useful method to set a config file if the application is started
through a third party application server like *gunicorn*.
"""

APP_CONFIG_FILE_NAME = 'config.py'
""" Config filename in the Flask application instance path. """


def init_config(app, config):
    """ Initialize app config.

    Loads app config from the first available source:

    1. ``config`` argument, if not ``None``
    2. ``app.instance_path``/``APP_CONFIG_FILE_NAME``, if it exists

    """
    # Load default config
    app.config.from_object(default_config)

    # Read config
    if config and os.path.splitext(config)[1] in ('.py', '.cfg'):
        # <config>.py, <config>.cfg
        if app.config.from_pyfile(config, silent=False):
            print("Config: Loading config from argument ({!s})".format(config))
    elif config and os.path.splitext(config)[1] == '.json':
        # <config>.json
        with open(config, 'r') as config_file:
            if app.config.from_json(config_file.read(), silent=False):
                print("Config: Loading config from argument ({!s})".format(
                    config))
    elif config:
        # <config>.<foo>
        raise RuntimeError(
            "Unknown config file format '{!s}' ({!s})".format(
                os.path.splitext(config)[1], config))
    else:
        if app.config.from_envvar(APP_CONFIG_ENVIRON_NAME, silent=True):
            print("Config: Loading config from ${!s} ({!s})".format(
                APP_CONFIG_ENVIRON_NAME, os.environ[APP_CONFIG_ENVIRON_NAME]))
        if app.config.from_pyfile(APP_CONFIG_FILE_NAME, silent=True):
            print("Config: Loading config from intance path ({!s})".format(
                os.path.join(app.instance_path, APP_CONFIG_FILE_NAME)))


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

        init_config(app, config)

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
