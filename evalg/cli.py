#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" eValg command line interface. """
import click

from flask.cli import with_appcontext


def save_object(obj):
    from evalg import db
    db.session.add(obj)
    db.session.commit()
    print("Saved {}".format(obj))


def shell_context():
    """ Shell context. """
    from evalg import db, models
    from pprint import pprint
    context = {
        'save': save_object,
        'db': db,
        'Election': models.election.Election,
        'ElectionGroup': models.election.ElectionGroup,
        'OU': models.election.OrganizationalUnit,
    }
    print('\nShell context:')
    pprint(context)
    print()
    return context


@click.command('populate-tables',
               short_help='Populate tables with example data.')
@with_appcontext
def populate_tables():
    """ Use flask_fixtures to populate tables. """
    import flask_fixtures
    from evalg.fixtures import populate_tables
    flask_fixtures.setup(populate_tables.Populator)


@click.command('create-tables',
               short_help='Create tables with db.drop_all() and '
               'db.create_all()')
@with_appcontext
def create_tables():
    from evalg import db
    db.drop_all()
    db.create_all()


def init_app(app):
    """ Add commands and context. """
    app.shell_context_processor(shell_context)
    app.cli.add_command(populate_tables)
    app.cli.add_command(create_tables)
