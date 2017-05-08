from flask import jsonify
from marshmallow import Schema, ValidationError, fields, pre_load


def handle_unprocessable_entity(err):
    data = getattr(err, 'data', {})
    messages = data.get('messages', ['Invalid request'])
    return jsonify({
        'messages': messages,
    }), 422


class TranslatedStringSchema(Schema):
    @pre_load
    def validate_extra(self, data):
        for key in data.keys():
            if key not in self.fields:
                raise ValidationError('Unsupported language: {}'.format(key))


class TranslatedString(object):
    """ Dynamically generated schema with a field per configured language. """
    klass = None

    @classmethod
    def translation_fields(cls, languages):
        """ Generate a marshmallow string field per language. """
        return {lang: fields.Str(description=name)
                for lang, name in languages.items()}

    @classmethod
    def configure(cls, app):
        cls.klass = type('TranslatedString',
                         (TranslatedStringSchema, ),
                         cls.translation_fields(app.config['LANGUAGES']))

    def __new__(cls, **kwargs):
        return cls.klass(**kwargs)


def init_app(app):
    # Error handlers
    app.register_error_handler(422, handle_unprocessable_entity)

    # Configure languages
    TranslatedString.configure(app)
