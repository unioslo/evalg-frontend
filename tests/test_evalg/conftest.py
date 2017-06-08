#!/usr/bin/env python
# -*- coding: utf-8 -*-
""" Test configuration and common fixtures. """
import pytest
import flask_fixtures
from flask import Response, json
from flask.testing import FlaskClient
from werkzeug.utils import cached_property
from alembic.command import upgrade as alembic_upgrade
from evalg import create_app
from evalg import db as evalg_db
from evalg import migrate


@pytest.fixture
def client(app):
    """ `Flask` test client. """
    yield app.test_client()


class JSONResponse(Response):
    @cached_property
    def json(self):
        return json.loads(self.data)


class TestClient(FlaskClient):
    def open(self, *args, **kwargs):
        if 'json' in kwargs:
            kwargs['data'] = json.dumps(kwargs.pop('json'))
            kwargs['content_type'] = 'application/json'
        return super(TestClient, self).open(*args, **kwargs)


@pytest.fixture(scope='session')
def config():
    """ Application config. """
    return {
        'TESTING': True,
        'SERVER_NAME': 'evalg.test',
    }


@pytest.fixture(scope='session')
def app(config, request):
    """ Session-wide test `Flask` application. """
    app = create_app()
    app.config.update(config)

    app.response_class = JSONResponse
    app.test_client_class = TestClient

    with app.app_context():
        yield app


def apply_migrations():
    """ Applies all alembic migrations. """
    config = migrate.get_config(directory=None)
    alembic_upgrade(config, revision='head')


@pytest.fixture(scope='session')
def db(app, request):
    """ Session-wide test database. """
    evalg_db.create_all()

    def teardown():
        evalg_db.drop_all()

    evalg_db.app = app
    apply_migrations()

    request.addfinalizer(teardown)
    return evalg_db


@pytest.fixture(scope='function')
def session(db, request):
    """ Creates a new database session for a test. """
    connection = db.engine.connect()
    transaction = connection.begin()

    options = dict(bind=connection, binds={})
    session = db.create_scoped_session(options=options)

    db.session = session

    def teardown():
        transaction.rollback()
        connection.close()
        session.remove()

    request.addfinalizer(teardown)
    return db


@pytest.fixture(scope='function')
def fixtured_session(session):
    """ Creates a new database session with fixtures applied. """
    class Populator(flask_fixtures.FixturesMixin):
        fixtures = [
            'ous.json',
            'elections.json',
            'election_lists.json',
            'candidates.json',
        ]

        db = session

    flask_fixtures.setup(Populator)
    return session
