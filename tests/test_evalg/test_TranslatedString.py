import pytest
from evalg.api import TranslatedString
from marshmallow import ValidationError


@pytest.fixture
def languages():
    return {
        'foo': 'Foo',
        'bar': 'Bar',
        'baz': 'Baz'
    }


@pytest.fixture
def app(app, languages):
    app.config.update({'LANGUAGES': languages})
    return app


@pytest.fixture
def schema(app):
    TranslatedString.configure(app)
    return TranslatedString(strict=True)


def test_dump(schema, languages):
    assert schema.dump(languages).data == languages


def test_load(schema, languages):
    assert schema.load(languages).data == languages


def test_load_with_invalid_language(schema, languages):
    languages['invalid'] = 'invalid'
    with pytest.raises(ValidationError):
        schema.load(languages)
