#!/usr/bin/env python
# -*- coding: utf-8 -*-
import importlib

Permission = None


def init_auth(namespace='evalg.models.authorization'):
    """ Init auth """
    if isinstance(namespace, str):
        namespace = importlib.import_module(namespace).__dict__

    globals().update(namespace)

    Permission.permissions = [Permission(code=i, doc=j) for i, j in
                              all_permissions.items()]


all_permissions = {
    'motd': 'can set or delete system motd',
    'create-election': 'can create a new election at OU',
    'approve-election': 'can approve created election',
    'view-election': 'show properties about given election?',
    'test-election': 'can run test/demo of voting process',
    'count-election': 'can start counting election',
    'announce-election': 'can announce an election',
    'publish-election': 'can publish an election',
    'close-election': 'can close an election',
    'change-election-start': 'can change start time for election',
    'change-election-end': 'can change end time for election',
    'change-election-metadata': 'can change metadata for election',
    'change-election-info':
        'can change info (i.e. info for voter) for election',
    'super-change-settings': 'can force change metadata',
    'grant-role': 'can grant people roles',
    'change-candidates': 'can add, remove or change candidate info',
    'upload-voters': 'can add voters from file',
    'add-voters': 'can add voter manually',
    'search-voters': 'can see list of voters',
    'view-votes': 'can see who submitted votes',
    'view-non-registered-voters':
        'can see votes submitted from unregistered voter',
    'remove-voters': 'can remove voters',
    'make-appeal': 'can make appeal',
    'vote-for': "can submit a vote on someone's behalf",
    'approve-vote-for': 'can approve vote submitted on behalf',
    'change-person': 'can administrate persons',
    'change-ou': 'can modify organizational units',
}
""" List of permissions in app. """

default_roles = {
    'global': {
        'root': tuple(['All access', 'Alle tilganger', 'Alle tilgångar'] +
                      list(all_permissions.keys())),
    },
    'ou': {
        # Will handle appeals on complaints
        'institution election board': ('Central election board member',
                                       'Sentralt valgstyremedlem',
                                       'Sentralt valstyremedlem',
                                       'motd', 'grant-role',
                                       'create-election', 'approve-election',
                                       'view-election', 'test-election',
                                       'view-votes', 'make-appeal',
                                       'view-non-registered-voters',),
        # Typically the leader and other trusted election board members
        'election board committee': ('Election board work committee',
                                     'Valgstyrearbeidsutvalgsmedlem',
                                     'Valstyrearbeidsutvalsmedlem',
                                     ),
        # Normal member
        'election board': ('Election board member',
                           'Valgstyremedlem',
                           'Valstyremedlem',
                           ),
        'election secretary': ('Election secretary board',
                               'Valgsekreteriat',
                               'Valråd',)
    },
    'election': {
        'election owner': ('Owner for election',
                           'Valgeier',
                           'Valeigar'
                           ),
        'election census admin': ('Admin for election census',
                                  'Manntallsansvarlig',
                                  'Manntalsansvarleg',
                                  ),
    },
}
""" Default roles. """


def check_perms(principals, perms, **roleargs):
    """ Check permissions. """
    if isinstance(perms, str):
        return check_perms(principals, (perms, ), **roleargs)
    roles = set()
    for princ in principals:
        roles.update(set(princ.roles))
    for role in roles:
        for perm in perms:
            if role.supports(perm, **roleargs):
                return True
    return False


def grant_role(principal, role, **roleargs):
    """ Grant role. """
    principal.roles.append(role.makerole(**roleargs))


def revoke_role(principal, role, **roleargs):
    """ Revoke a role. """
    principal.roles.remove(role.makerole(**roleargs))
