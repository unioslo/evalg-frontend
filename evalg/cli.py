#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" eValg command line interface. """


def shell_context():
    """ Shell context. """
    from evalg import db, models
    from pprint import pprint
    context = {
        'db': db,
        'Election': models.election.Election,
        'ElectionGroup': models.election.ElectionGroup,
        'OU': models.election.OrganizationalUnit,
    }
    print('\nShell context:')
    pprint(context)
    print()
    return context


def init_app(app):
    """ Add commands and context. """
    app.shell_context_processor(shell_context)
