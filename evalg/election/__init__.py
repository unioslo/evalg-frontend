#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import g, jsonify, current_app, request


def init_app(app):
    """ Bootstrap the API. """
    @app.route('/hello', methods=['GET', ])
    def hello():
        """ Says hello. """
        app.logger.info("Saying hello")
        return "Hello"
