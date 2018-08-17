import graphene
from flask import request, current_app
from flask_graphql import GraphQLView
from graphene.types.generic import GenericScalar
from graphene import relay, String, Argument
from graphene_sqlalchemy import SQLAlchemyObjectType
from graphene_sqlalchemy.converter import (convert_sqlalchemy_type,
                                           get_column_doc,
                                           is_column_nullable)
from sqlalchemy_utils import URLType, JSONType, UUIDType

from evalg.models.election import (Election as ElectionModel,
                                   ElectionGroup as ElectionGroupModel)
from evalg.models.election_list import ElectionList as ElectionListModel
from evalg.models.candidate import Candidate as CandidateModel
from evalg.models.person import Person as PersonModel
from evalg.models.pollbook import PollBook as PollBookModel
from evalg.models.voter import Voter as VoterModel


@convert_sqlalchemy_type.register(URLType)
def convert_url_to_string(type, column, registry=None):
    return String(description=get_column_doc(column),
                  required=not(is_column_nullable(column)))


@convert_sqlalchemy_type.register(JSONType)
def convert_json_to_generic_scalar(type, column, registry=None):
    return GenericScalar(description=get_column_doc(column),
                         required=not(is_column_nullable(column)))


@convert_sqlalchemy_type.register(UUIDType)
def convert_uuid_to_string(type, column, registry=None):
    return String(description=get_column_doc(column),
                  required=not(is_column_nullable(column)))


class Election(SQLAlchemyObjectType):
    class Meta:
        model = ElectionModel


class ElectionGroup(SQLAlchemyObjectType):
    class Meta:
        model = ElectionGroupModel


class ElectionList(SQLAlchemyObjectType):
    class Meta:
        model = ElectionListModel


class Candidate(SQLAlchemyObjectType):
    class Meta:
        model = CandidateModel


class Person(SQLAlchemyObjectType):
    class Meta:
        model = PersonModel


class PollBook(SQLAlchemyObjectType):
    class Meta:
        model = PollBookModel


class Voter(SQLAlchemyObjectType):
    class Meta:
        model = VoterModel


class Query(graphene.ObjectType):
    elections = graphene.List(Election)

    def resolve_elections(self, info):
        current_app.logger.info(request)
        return ElectionModel.query.all()

    election = graphene.Field(Election,
                              id=Argument(graphene.String, required=True))

    def resolve_election(self, info, **args):
        return ElectionModel.query.get(args.get('id'))

    election_lists = graphene.List(ElectionList)

    def resolve_election_lists(self, info, **args):
        return ElectionListModel.query.all()

    election_list = graphene.Field(ElectionList,
                                   id=Argument(graphene.String, required=True))

    def resolve_election_list(self, info, **args):
        return ElectionListModel.query.get(args.get('id'))

    candidates = graphene.List(Candidate)

    def resolve_candidates(self, info):
        return CandidateModel.query.all()

    candidate = graphene.Field(Candidate,
                               id=Argument(graphene.String, required=True))

    def resolve_candidate(self, info, **args):
        return CandidateModel.query.get(args.get('id'))

    persons = graphene.List(Person)

    def resolve_persons(self, info):
        return PersonModel.query.all()

    person = graphene.Field(Person,
                            id=Argument(graphene.String, required=True))

    def resolve_person(self, info, **args):
        return PersonModel.query.get(args.get('id'))

    pollbooks = graphene.List(PollBook)

    def resolve_pollbooks(self, info):
        return PollBookModel.query.all()

    pollbook = graphene.Field(PollBook,
                              id=Argument(graphene.String, required=True))

    def resolve_pollbook(self, info, **args):
        return PollBookModel.query.get(args.get('id'))

    voters = graphene.List(Voter)

    def resolve_voters(self, info):
        return Voter.query.all()

    voter = graphene.Field(Voter,
                           id=Argument(graphene.String, required=True))

    def resolve_voter(self, info, **args):
        return VoterModel.query.get(args.get('id'))


schema = graphene.Schema(query=Query)


def init_app(app):
    from evalg.graphql.middleware import timing_middleware, auth_middleware
    app.add_url_rule(
        '/graphql',
        view_func=GraphQLView.as_view(
            'graphql',
            schema=schema,
            batch=True,
            graphiql=True,
            middleware=[timing_middleware]
        ))
