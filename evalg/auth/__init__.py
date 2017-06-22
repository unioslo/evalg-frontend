
# -*- coding: utf-8 -*-
import importlib


Permission = None


def init_auth(namespace='evalg.models.authorization'):
    """ Init auth
    """

    if isinstance(namespace, str):
        namespace = importlib.import_module(namespace).__dict__

    globals().update(namespace)

    Permission.permissions = [Permission(code=i, doc=j) for i, j in
                              all_permissions.items()]


all_permissions = {
    'motd': 'can set or delete system motd',
    'createelection': 'can create a new election at OU',
    'approveelection': 'can approve created election',
    'seeelection': 'show properties about given election?',
    'changestarttime': 'can change start time for election',
    'changeendtime': 'can change end time for election',
    'changemetadata': 'can change metadata for election',
    'changeelectioninfo': 'can change info (i.e. info for voter) for election',
    'superchangesettings': 'can force change metadata',
    'grantroles': 'can grant people roles',
    'changecandidates': 'can add, remove or change candidate info',
    'uploadvoters': 'can add voters from file',
    'addvoter': 'can add voter manually',
    'searchvoters': 'can see list of voters',
    'seevotes': 'can see who submitted votes',
    'seenonregisteredvoters': 'can see votes submitted from unregistered voter',
    'removevoter': 'can remove voters',
    'makepublic': 'can change status to public',
    'makeclosed': 'can change status to closed',
    'makeappeal': 'can change status to appeal',
    'countelection': 'can start counting election',
    'votefor': "can submit a vote on someone's behalf",
    'approvevote': 'can approve vote submitted on behalf',
    'testelection': 'can run test/demo of voting process',
    'changepersons': 'can administrate persons',
}
""" List over permissions in app. """

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
                                       'motd', 'createelection',
                                       'approveelection', 'seelection',
                                       'grantroles', 'seevotes',
                                       'seenonregisteredvoters', 'makeappeal',
                                       'testelection'),
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
