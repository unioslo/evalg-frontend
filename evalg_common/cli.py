#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Common command line interface. """
import click

from flask import current_app
from flask.cli import with_appcontext


def init_app(app):
    """ Add common commands. """
    app.cli.add_command(foo)
    app.cli.add_command(show_config)
    app.cli.add_command(show_routes)


@click.command('foo', short_help='Foo.')
@click.option('--bar', '-b', default='baz',
              help='Specify a bar')
@with_appcontext
def foo(bar):
    """ Foo bar baz. """
    print("Foo bar", bar)
    print(current_app)


@click.command('show-config', short_help='Print config.')
@with_appcontext
def show_config():
    """ Print config. """
    print("Settings:")
    for setting in sorted(current_app.config):
        print("  {!s}: {!r}".format(setting, current_app.config[setting]))


@click.command('show-routes', short_help='Print routing rules.')
@with_appcontext
def show_routes():
    """ Print routing rules. """
    print("Routes:")
    for rule in current_app.url_map.iter_rules():
        print("  {!r}".format(rule))
