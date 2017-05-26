# coding: utf-8
from flask import current_app
from evalg.models.ou import OrganizationalUnit
from instance import evalg_template_config


def build_election_names(ou, name_prefixes):
    names = name_prefixes[ou.tag]
    for tag in names:
        for lang in names[tag]:
            names[tag][lang] = names[tag][lang].format(ou.name[lang])
    return names


def election_template_builder():
    template_config = current_app.config['ELECTION_TEMPLATE']
    ou_tags = template_config['ou_tags']
    name_prefixes = template_config['election_name_prefixes']
    ou_tree = dict()
    for tag in ou_tags:
        ou_tree[tag] = list()
    for ou in OrganizationalUnit.query.all():
        if ou.tag in ou_tags:
            ou_dict = dict()
            for attr in ['id', 'name', 'tag', 'external_id']:
                ou_dict[attr] = getattr(ou, attr)
            ou_dict['election_name_tags'] = build_election_names(ou, name_prefixes)
            ou_tree[ou.tag].append(ou_dict)
    election_template = evalg_template_config.election_template
    election_template['ou_lists'] = ou_tree
    election_template['ou_tags'] = ou_tree
    return election_template
