# -*- coding: utf-8 -*-
from evalg.models.ou import OrganizationalUnit
from instance import evalg_template_config as tmpl_config


def build_election_names(ou, name_prefixes):
    names = name_prefixes[ou.tag]
    for tag in names:
        for lang in names[tag]:
            names[tag][lang] = names[tag][lang].format(ou.name[lang])
    return names


def election_template_builder():
    ou_tags = tmpl_config.ou_tags
    ou_lists = dict()
    for tag in ou_tags:
        ou_lists[tag] = list()
    for ou in OrganizationalUnit.query.all():
        if ou.tag in ou_tags:
            ou_dict = dict()
            for attr in ['id', 'name', 'tag', 'external_id']:
                ou_dict[attr] = getattr(ou, attr)
            ou_lists[ou.tag].append(ou_dict)
    election_template = dict()
    election_template['template_root'] = tmpl_config.root_node
    election_template['ou_lists'] = ou_lists
    return election_template
