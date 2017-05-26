# coding: utf-8
elections = [
    {
        'name': {
            'nb': 'Fast vitenskapelig ansatte',
            'nn': 'Fast vitenskapelig ansatte',
            'en': 'Permanent Science Employees',
        }
    },
    {
        'name': {
            'nb': 'Midlertidig vitenskapelig ansatte',
            'nn': 'Midlertidig vitenskapelig ansatte',
            'en': 'Temporary Science Employees',
        }
    },
    {
        'name': {
            'nb': 'Teknisk og administrativt ansatte',
            'nn': 'Teknisk og administrativt ansatte',
            'en': 'Technical and Administrative Employees',
        }
    },
    {
        'name': {
            'nb': 'Studenter',
            'nn': 'Studenter',
            'en': 'Students',
        }
    }
]

select_ou_node = {
    'name': {
        'nb': 'Valgkrets',
        'nn': 'Valgkrets',
        'en': 'Parish'
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
            'settings': {
                'ou_tag': 'root'
            }
        },
        {
            'name': {
                'nb': 'Dekanat',
                'nn': 'Dekanat',
                'en': 'Dean',
            },
            'settings': {
                'ou_tag': 'faculty'
            },
        },
        {
            'name': {
                'nb': 'Instituttledelse',
                'nn': 'Instituttledelse',
                'en': 'Institute leader',
            },
            'settings': {
                'ou_tag': 'institute'
            },
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
            'settings': {
                'ou_tag': 'root'
            }
        },
        {
            'name': {
                'nb': 'Fakultetsstyre',
                'nn': 'Fakultetsstyre',
                'en': 'Faculty Board',
            },
            'settings': {
                'ou_tag': 'faculty'
            },
        },
        {
            'name': {
                'nb': 'Instituttstyre',
                'nn': 'Instituttstyre',
                'en': 'Institute Board',
            },
            'settings': {
                'ou_tag': 'institute'
            },
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
                'ou_tree_level': 'institute'
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
                'nn': 'Styreleder'
            },
            'settings': {
                'type': 'preference',
                'has_multiple_elections': False,
                'can_modify_elections': False,
                'team': True,
                'election_name_tag': 'leader',
                'has_multiple_candidate_lists': False
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
                'type': 'preference',
                'has_multiple_elections': True,
                'can_modify_elections': False,
                'election_name_tag': 'board',
                'has_multiple_candidate_lists': True
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
            'settings': {
                'type': 'list',
                'has_multiple_elections': False,
                'can_modify_elections': False,
                'ou_tree_level': 1,
                'election_name_tag': 'parliament'
            },
        },
        {
            'name': {
                'en': 'Other',
                'nb': 'Annet',
                'nn': 'Annet'
            },
            'settings': {
                'election_name_tag': 'other',
                'can_modify_elections': True
            },
            'next_nodes': [
                other_node,
                other_ou_level_node,
                select_ou_node,
                other_multiple_elections_node,
                other_election_group_name
            ]
        }

    ]
}

election_template = {
    'template_root': template_root_node,
    'elections': elections
}