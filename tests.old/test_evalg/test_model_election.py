#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Tests for election models. """
from evalg.models.election import Election, ElectionGroup
from datetime import datetime, timedelta


def test_election_status(session):
    now = datetime.now()
    group = ElectionGroup()
    election = Election(
        group=group,
        start=now + timedelta(days=1),
        end=now + timedelta(days=10))
    assert group.status == election.status == 'draft'
    group.announce()
    assert group.status == election.status == 'announced'
    group.publish()
    assert group.status == election.status == 'published'
    election.start = now - timedelta(days=1)
    assert group.status == election.status == 'ongoing'
    election.end = now - timedelta(days=1)
    assert group.status == election.status == 'closed'
    second_election = Election(
        group=group,
        start=now + timedelta(days=1),
        end=now + timedelta(days=10))
    assert group.status == 'multipleStatuses'
    assert second_election.status == 'published'
