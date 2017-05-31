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


def import_ous():
    """ Use flask_fixtures to populate tables. """
    import json
    from evalg.models.ou import OrganizationalUnit
    from evalg import db
    f = open('ou_dump.json')
    ou_dump = json.load(f)
    for tag in ou_dump:
        print(tag)
        for ou in ou_dump[tag]:
            print(ou)
            new_ou = OrganizationalUnit()
            new_ou.name = ou['name']
            new_ou.external_id = ou['external_id']
            new_ou.tag = tag
            db.session.add(new_ou)
    db.session.commit()


def wipe_db():
    from evalg import db
    db.drop_all()
    db.create_all()
    import_ous()


def shell_context():
    """ Shell context. """
    from evalg import db, models
    from pprint import pprint
    context = {
        'save': save_object,
        'db': db,
        'Candidate': models.candidate.Candidate,
        'CoCandidate': models.candidate.CoCandidate,
        'Election': models.election.Election,
        'ElectionGroup': models.election.ElectionGroup,
        'OU': models.election.OrganizationalUnit,
        'wipe_db': wipe_db
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


def init_app(app):
    """ Add commands and context. """
    app.shell_context_processor(shell_context)
    app.cli.add_command(populate_tables)




