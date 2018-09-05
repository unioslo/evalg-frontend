import graphene
import re
from flask_graphql import GraphQLView
from graphene.types.generic import GenericScalar
from graphene import String, Argument

from evalg.graphql.entities import (Election,
                                    ElectionGroup,
                                    ElectionList,
                                    Candidate,
                                    Person,
                                    PollBook,
                                    Voter)
from evalg.election_templates import election_template_builder
from evalg.graphql.mutations import (CreateNewElectionGroup,
                                     UpdateBaseSettings,
                                     UpdateVotingPeriods)
from evalg.graphql.utils import convert_json


class Query(graphene.ObjectType):
    elections = graphene.List(Election)

    def resolve_elections(self, info):
        return Election.get_query(info).all()

    election = graphene.Field(Election,
                              id=Argument(graphene.UUID, required=True))

    def resolve_election(self, info, **args):
        return Election.get_query(info).get(args.get('id'))

    election_groups = graphene.List(ElectionGroup)

    def resolve_election_groups(self, info):
        return ElectionGroup.get_query(info).all()

    election_group = graphene.Field(ElectionGroup,
                                    id=Argument(graphene.UUID, required=True))

    def resolve_election_group(self, info, **args):
        return ElectionGroup.get_query(info).get(args.get('id'))

    election_lists = graphene.List(ElectionList)

    def resolve_election_lists(self, info, **args):
        return ElectionList.get_query.all()

    election_list = graphene.Field(ElectionList,
                                   id=Argument(graphene.UUID, required=True))

    def resolve_election_list(self, info, **args):
        return ElectionList.get_query(info).get(args.get('id'))

    candidates = graphene.List(Candidate)

    def resolve_candidates(self, info):
        return Candidate.get_query(info).all()

    candidate = graphene.Field(Candidate,
                               id=Argument(graphene.UUID, required=True))

    def resolve_candidate(self, info, **args):
        return Candidate.get_query(info).get(args.get('id'))

    persons = graphene.List(Person)

    def resolve_persons(self, info):
        return Person.get_query(info).all()

    person = graphene.Field(Person,
                            id=Argument(graphene.UUID, required=True))

    def resolve_person(self, info, **args):
        return Person.get_query(info).get(args.get('id'))

    pollbooks = graphene.List(PollBook)

    def resolve_pollbooks(self, info):
        return PollBook.get_query(info).all()

    pollbook = graphene.Field(PollBook,
                              id=Argument(graphene.UUID, required=True))

    def resolve_pollbook(self, info, **args):
        return PollBook.get_query(info).get(args.get('id'))

    voters = graphene.List(Voter)

    def resolve_voters(self, info):
        return Voter.get_query(info).all()

    voter = graphene.Field(Voter,
                           id=Argument(graphene.UUID, required=True))

    def resolve_voter(self, info, **args):
        return Voter.get_query(info).get(args.get('id'))

    election_template = graphene.Field(GenericScalar)

    def resolve_election_template(self, info, **args):
        template = election_template_builder()
        return convert_json(template)


class Mutations(graphene.ObjectType):
    create_new_election_group = CreateNewElectionGroup.Field()
    update_base_settings = UpdateBaseSettings.Field()
    update_voting_periods = UpdateVotingPeriods.Field()


schema = graphene.Schema(query=Query, mutation=Mutations, types=[ElectionGroup])


def init_app(app):
    from evalg.graphql.middleware import timing_middleware, auth_middleware

    middleware = [timing_middleware]
    if app.config.get('AUTH_ENABLED'):
        middleware.append(auth_middleware)

    app.add_url_rule(
        '/graphql',
        view_func=GraphQLView.as_view(
            'graphql',
            schema=schema,
            batch=True,
            graphiql=True,
            middleware=middleware
        ))

