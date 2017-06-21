# coding: utf-8

ou_tags = ['root', 'faculty', 'department']
""" The possible ou tags in use. """

election_types = {
    # TBD: Versioning?
    # 'Preferansevalg' by UiO rules (normal)
    'uio-stv': {
        # Candidate is person, no co candidate
        'candidate-type': 'single',
        # which metadata to collect:
        # number of seats, number of subs, and gender for affirmative action
        'metadata': {'seats': 1, 'substitutes': 2, 'candidate-gender': True},
        'ballot-rules': {
            # should rank the candidates
            'voting': 'rank-candidates',
            # no constraints in number of votes
            'votes': 'all',
        },
        'counting-rules': {
            'method': 'uio-stv',
            'affirmative-action': ['gender-40'],
        },
    },
    'uio-stv-teams': {
        'candidate-type': 'single-team',
        'metadata': {'seats': 1},
        'ballot-rules': {
            'voting': 'rank-candidates',
            'votes': 'all',
        },
        'counting-rules': {
            'method': 'uio-stv',
        },
    },
    'uio-sp-list': {
        'candidate-type': 'party-list',
        'metadata': {'seats': 30},
        'ballot-rules': {
            'delete-candidate': True,
            'cumulate': True,
            'alter-priority': True,
            'number-of-votes': 'seats',
            'other-list-candidate-votes': True
        },
        'counting-rules': {
            'method': 'sainte-lague',
            'first-divisor': '1',
            'precumulate': 1,
            'list-votes': 'seats',
            'other-list-candidate-votes': True
        }
    },
}

_leader = {
    'grouptype': 'single-election',
    'elections': [{
        'sequence': 'all',
        'rules': 'uio-stv-teams',
        'name': None,
        'mandate-period': {'length': '4 y', 'start': '01-01'},
        'votergroups': [
            {
                'name': {
                    'nb': 'Vitenskapelig ansatte',
                    'nn': 'Vitskapeleg tilsette',
                    'en': 'Academic staff',
                },
                'weight': 53,
            },
            {
                'name': {
                    'nb': 'Teknisk/administrativt ansatte',
                    'nn': 'Teknisk/administrativt tilsette',
                    'en': 'Technical and administrative staff',
                },
                'weight': 22,
            },
            {
                'name': {
                    'nb': 'Studenter',
                    'nn': 'Studentar',
                    'en': 'Students',
                },
                'weight': 25,
            }
        ],
    }]
}

_parliament = {
    'grouptype': 'single-election',
    'elections': [{
        'sequence': 'all',
        'rules': 'uio-sp-list',
        'name': None,
        'mandate-period': {'length': '1 y', 'start': '07-01'},
        'votergroups': [
            {
                'name': {
                    'nb': 'Studenter',
                    'nn': 'Studentar',
                    'en': 'Students',
                },
                'weight': 100,
            }
        ],
    }]
}

_board = {
    'grouptype': 'simultaneous-elections',
    'elections': [
        {
            'sequence': 'permanent-academic-staff',
            'rules': 'uio-stv',
            'mandate-period': {'length': '4 y', 'start': '01-01'},
            'name': {
                'nb': 'Fast vitenskapelig ansatte',
                'nn': 'Fast vitskapeleg tilsette',
                'en': 'Permanent academic staff',
            },
            'votergroups': [{
                'name': {
                    'nb': 'Fast vitenskapelig ansatte',
                    'nn': 'Fast vitskapeleg tilsette',
                    'en': 'Permanent academic staff',
                },
                'weight': 100,
            }],
        },
        {
            'sequence': 'temp-academic-staff',
            'rules': 'uio-stv',
            'mandate-period': {'length': '1 y', 'start': '01-01'},
            'name': {
                'nb': 'Midlertidig vitenskapelige ansatte',
                'nn': 'Mellombels vitskapeleg tilsette',
                'en': 'Temporary academic staff',
            },
            'votergroups': [{
                'name': {
                    'nb': 'Midlertidig vitenskapelige ansatte',
                    'nn': 'Mellombels vitskapeleg tilsette',
                    'en': 'Temporary academic staff',
                },
                'weight': 100,
            }],
        },
        {
            'sequence': 'tech-adm-staff',
            'rules': 'uio-stv',
            'mandate-period': {'length': '4 y', 'start': '01-01'},
            'name': {
                'nb': 'Teknisk/administrativt ansatte',
                'nn': 'Teknisk/administrativt tilsette',
                'en': 'Technical and administrative staff',
            },
            'votergroups': [{
                'name': {
                    'nb': 'Midlertidig vitenskapelige ansatte',
                    'nn': 'Mellombels vitskapeleg tilsette',
                    'en': 'Temporary academic staff',
                },
                'weight': 100,
            }],
        },
        {
            'sequence': 'students',
            'rules': 'uio-stv',
            'mandate-period': {'length': '1 y', 'start': '01-01'},
            'name': {
                'nb': 'Studenter',
                'nn': 'Studentar',
                'en': 'Students',
            },
            'votergroups': [
                {
                    'name': {
                        'nb': 'Studenter',
                        'nn': 'Studentar',
                        'en': 'Students',
                    },
                    'weight': 100,
                },
            ],
        },
    ]
}

electiongroup_templates = {
    'uio-principal': {
        'name': {
            'nb': 'Rektor',
            'nn': 'Rektor',
            'en': 'Principal'
        },
        'group': _leader,
        'ou_tag': 'root',
    },
    'uio-dean': {
        'name': {
            'nb': 'Dekanat ved {}',
            'nn': 'Dekanat ved {}',
            'en': 'Dean at {}'
        },
        'group': _leader,
        'ou_tag': 'faculty',
    },
    'uio-department-leader': {
        'name': {
            'nb': 'Instituttledelse ved {}',
            'nn': 'Instituttleiar ved {}',
            'en': 'Department leader at {}'
        },
        'group': _leader,
        'ou_tag': 'department',
    },
    'uio-university-board': {
        'name': {
            'nb': 'Universitetsstyre',
            'nn': 'Universitetsstyre',
            'en': 'University board',
        },
        'group': _board,
        'ou_tag': 'root',
    },
    'uio-faculty-board': {
        'name': {
            'nb': 'Fakultetsstyre ved {}',
            'nn': 'Fakultetsstyre ved {}',
            'en': 'Faculty board at {}',
        },
        'group': _board,
        'ou_tag': 'faculty',
    },
    'uio-department-board': {
        'name': {
            'nb': 'Instituttstyre ved {}',
            'nn': 'Instituttstyre ved {}',
            'en': 'Department board at {}',
        },
        'group': _board,
        'ou_tag': 'department',
    },
    'uio-studentparliament': {
        'name': {
            'nb': 'Studentparlamentet',
            'nn': 'Studentparlamentet',
            'en': 'Student parliament',
        },
        'group': _parliament,
        'ou_tag': 'root',
        'template': True,
    },
}

select_ou_node = {
    'name': {
        'nb': 'Valgkrets',
        'nn': 'Valgkrets',
        'en': 'Constituency'
    },
    'search_in_ou_tree': True
}

other_multiple_elections_node = {
    'name': {
        'nb': 'Flere velgergrupper?',
        'nn': 'Flere velgergrupper?',
        'en': 'Multiple voter groups?'
    },
    'options': [
        {
            'name': {
                'en': 'Yes',
                'nb': 'Ja',
                'nn': 'Ja'

            },
            'settings': {
                'has_multiple_elections': True
            },
        },
        {
            'name': {
                'en': 'No',
                'nb': 'Nei',
                'nn': 'Nei'
            },
            'settings': {
                'has_multiple_elections': False
            },
        }

    ]
}

board_leader_node = {
    'name': {
        'nb': 'Valg av',
        'nn': 'Valg av',
        'en': 'What to elect'
    },
    'options': [
        {
            'name': {
                'nb': 'Rektorat',
                'nn': 'Rektorat',
                'en': 'Principal'
            },
            'settings': electiongroup_templates['uio-principal'],
        },
        {
            'name': {
                'nb': 'Dekanat',
                'nn': 'Dekanat',
                'en': 'Dean',
            },
            'settings': electiongroup_templates['uio-dean'],
        },
        {
            'name': {
                'nb': 'Instituttledelse',
                'nn': 'Instituttledelse',
                'en': 'Institute leader',
            },
            'settings': electiongroup_templates['uio-department-leader'],
        },
    ]
}

board_node = {
    'name': {
        'nb': 'Valg av',
        'en': 'What to elect'
    },
    'options': [
        {
            'name': {
                'nb': 'Universitetsstyre',
                'nn': 'Universitetsstyre',
                'en': 'University Board'
            },
            'settings': electiongroup_templates['uio-university-board'],
        },
        {
            'name': {
                'nb': 'Fakultetsstyre',
                'nn': 'Fakultetsstyre',
                'en': 'Faculty Board',
            },
            'settings': electiongroup_templates['uio-faculty-board'],
        },
        {
            'name': {
                'nb': 'Instituttstyre',
                'nn': 'Instituttstyre',
                'en': 'Institute Board',
            },
            'settings': electiongroup_templates['uio-department-board'],
        },
    ]
}

other_ou_level_node = {
    'name': {
        'nb': 'Velg organisasjonsnivå',
        'en': 'Choose organization level'
    },
    'options': [
        {
            'name': {
                'en': 'University of Oslo',
                'nb': 'Universitetet i Oslo',
                'nn': 'Universitetet i Oslo'
            },
            'settings': {
                'ou_tag': 'root'
            },
        },
        {
            'name': {
                'en': 'Faculty',
                'nb': 'Fakultet',
                'nn': 'Fakultet'
            },
            'settings': {
                'ou_tag': 'faculty'
            },
        },
        {
            'name': {
                'en': 'Institute',
                'nb': 'Institutt',
                'nn': 'Institutt'
            },
            'settings': {
                'ou_tree_level': 'department'
            },
        },
    ],
    'select_ou_level': True
}

other_node = {
    'name': {
        'nb': 'Valgtype',
        'nn': 'Valgtype',
        'en': 'Election type'
    },
    'options': [
        {
            'name': {
                'en': 'Preference election',
                'nb': 'Preferansevalg',
                'nn': 'Preferansevalg'
            },
            'settings': {
                'type': 'preference',
            },
        },
        {
            'name': {
                'en': 'List election',
                'nb': 'Listevalg',
                'nn': 'Listevalg'
            },
            'settings': {
                'type': 'list',
            },
        },
        {
            'name': {
                'en': 'Poll',
                'nb': 'Avstemning',
                'nn': 'Avstemning'
            },
            'settings': {
                'type': 'poll',
            },
        },

    ]
}

other_election_group_name = {
    'name': {
        'nb': 'Valgnavn',
        'nn': 'Valgnavn',
        'en': 'Election name'
    },
    'set_election_name': True
}

template_root_node = {
    'name': {
        'nb': 'Valgordning',
        'nn': 'Valgordning',
        'en': 'Election'
    },
    'options': [
        {
            'name': {
                'en': 'Board leader',
                'nb': 'Styreleder',
                'nn': 'Styreleiar'
            },
            'settings': {
                'template': True,
                # 'type': 'preference-team',
                # 'has_multiple_elections': False,
                # 'can_modify_elections': False,
                # 'team': True,
                # 'election_name_tag': 'leader',
                # 'has_multiple_candidate_lists': False
            },
            'next_nodes': [
                board_leader_node,
                select_ou_node
            ]
        },
        {
            'name': {
                'en': 'Board',
                'nb': 'Styreorgan',
                'nn': 'Styreorgan'
            },
            'settings': {
                'template': True,
                # 'type': 'preference',
                # 'has_multiple_elections': True,
                # 'can_modify_elections': False,
                # 'election_name_tag': 'board',
                # 'has_multiple_candidate_lists': True,
                # 'has_multiple_mandate_times': True
            },
            'next_nodes': [
                board_node,
                select_ou_node
            ]
        },
        {
            'name': {
                'en': 'Student parliament',
                'nb': 'Studentparlament',
                'nn': 'Studentparlament'
            },
            'settings': electiongroup_templates['uio-studentparliament'],
            # {
                # 'type': 'list',
                # 'has_multiple_elections': False,
                # 'can_modify_elections': False,
                # 'ou_tree_level': 1,
                # 'election_name_tag': 'parliament'
            # },
        },
        # {
        #     'name': {
        #         'en': 'Other',
        #         'nb': 'Annet',
        #         'nn': 'Annet'
        #     },
        #     'settings': {
        #         'election_name_tag': 'other',
        #         'can_modify_elections': True
        #     },
        #     'next_nodes': [
        #         other_node,
        #         other_ou_level_node,
        #         select_ou_node,
        #         other_multiple_elections_node,
        #         other_election_group_name
        #     ]
        #  }

    ]
}

election_template = {
    'template_root': template_root_node,
}
