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
    assert group.status == 'draft'
    assert election.status == 'draft'
    group.announce()
    assert group.status == 'announced'
    assert election.status == 'announced'
    group.publish()
    assert group.status == 'published'
    assert election.status == 'published'
    election.start = now - timedelta(days=1)
    assert group.status == 'ongoing'
    assert election.status == 'ongoing'
    election.end = now - timedelta(days=1)
    assert group.status == 'closed'
    assert election.status == 'closed'
