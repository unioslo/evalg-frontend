#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Tests for elections API. """
import pytest
from flask import url_for


def test_get_electiongrouplist(client, fixtured_session):
    res = client.get(url_for('elections.ElectionGroupList'))
    assert res.status_code == 200
    assert res.json


def test_post_electiongrouplist(client, fixtured_session):
    ou_id = '61499710-726d-43ab-b6f7-63138391dd02'
    data = {'ou_id': ou_id}
    res = client.post(url_for('elections.ElectionGroupList'),
                      json=data)
    assert res.status_code == 201
    assert res.json.get('ou_id') == ou_id


def test_get_electiongroupdetail(client, fixtured_session):
    eg_id = 'b5b71046-e191-43d4-9bb6-55a710895288'
    res = client.get(url_for('elections.ElectionGroupDetail', eg_id=eg_id))
    assert res.status_code == 200
    assert res.json.get('name').get('en') == 'Foo in English'
