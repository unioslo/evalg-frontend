#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Tests for elections API. """
import pytest
from flask import url_for


def test_get_electiongrouplist(client, fixtured_session):
    res = client.get(url_for('elections.ElectionGroupCollection'))
    assert res.status_code == 200
    assert res.json


def test_get_electiongroupdetail(client, fixtured_session):
    group_id = 'b5b71046-e191-43d4-9bb6-55a710895288'
    res = client.get(url_for('elections.ElectionGroupDetail',
                             group_id=group_id))
    assert res.status_code == 200
    assert res.json.get('name').get('en') == 'Foo in English'


def test_post_electiongroupannounce(client, fixtured_session):
    group_id = 'b5b71046-e191-43d4-9bb6-55a710895288'
    res = client.post(url_for('elections.ElectionGroupAnnounce',
                              group_id=group_id))
    assert res.status_code == 200
    assert res.json.get('announced') == True
