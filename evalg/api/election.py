#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" The election API. """
from flask import Blueprint, jsonify, current_app
from evalg import ma
from evalg.models.election import ElectionGroup, Election

election_bp = Blueprint('elections', __name__)


class ElectionGroupSchema(ma.ModelSchema):
    class Meta:
        model = ElectionGroup


class ElectionSchema(ma.ModelSchema):
    class Meta:
        model = Election


election_group_schema = ElectionGroupSchema()
election_schema = ElectionSchema()


@election_bp.route('/electiongroups/', methods=['GET', ])
def election_groups():
    """ List election groups. """
    all_groups = ElectionGroup.query.all()
    current_app.logger.debug(all_groups)
    result = election_group_schema.dump(all_groups, many=True)
    return jsonify(result.data)
