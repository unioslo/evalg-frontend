import graphene
from flask import current_app
from graphene.types.generic import GenericScalar

from evalg import db
from evalg.metadata import make_group_from_template
from evalg.models.ou import OrganizationalUnit
from evalg.models.election import (Election as ElectionModel,
                                   ElectionGroup as ElectionGroupModel)
from evalg.graphql.entities import (Election,
                                    ElectionGroup,
                                    ElectionList,
                                    Candidate,
                                    Person,
                                    PollBook,
                                    Voter)


class CreateNewElectionGroup(graphene.Mutation):
    class Arguments:
        ou_id = graphene.UUID()
        template = graphene.Boolean()
        template_name = graphene.String()

    ok = graphene.Boolean()
    election_group = graphene.Field(lambda: ElectionGroup)

    def mutate(self, info, ou_id, template, template_name):
        ou = OrganizationalUnit.query.get(ou_id)
        election_group = make_group_from_template(template_name, ou)
        ok = True
        return CreateNewElectionGroup(election_group=election_group, ok=ok)


class ElectionBaseSettingsInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    seats = graphene.Int(required=True)
    substitutes = graphene.Int(required=True)
    active = graphene.Boolean(required=True)


class UpdateBaseSettings(graphene.Mutation):
    class Input:
        elections = graphene.List(ElectionBaseSettingsInput, required=True)
        id = graphene.UUID(required=True)
        has_gender_quota = graphene.Boolean(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, **args):
        el_grp = ElectionGroupModel.query.get(args.get('id'))
        el_grp.meta['candidate_rules']['candidate_gender'] =\
            args.get('has_gender_quota')
        db.session.add(el_grp)
        for e in args.get('elections'):
            election = ElectionModel.query.get(e['id'])
            election.meta['candidate_rules']['seats'] = e.seats
            election.meta['candidate_rules']['substitutes'] = e.substitutes
            election.active = e.active
            db.session.add(election)
        db.session.commit()
        return UpdateBaseSettings(ok=True)


class ElectionVotingPeriodInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    start = graphene.DateTime(required=True)
    end = graphene.DateTime(required=True)


class UpdateVotingPeriods(graphene.Mutation):
    class Input:
        elections = graphene.List(ElectionVotingPeriodInput, required=True)
        has_multiple_times = graphene.Boolean(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, **args):
        elections = args.get('elections')
        if not args.get('has_multiple_times'):
            for e in elections:
                election = ElectionModel.query.get(e['id'])
                election.start = elections[0].start
                election.end = elections[0].end
                db.session.add(election)
        else:
            for e in elections:
                election = ElectionModel.query.get(e['id'])
                election.start = e.start
                election.end = e.end
                db.session.add(election)
        db.session.commit()
        return UpdateVotingPeriods(ok=True)


class ElectionVoterInfoInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    mandate_period_start = graphene.DateTime(required=True)
    mandate_period_end = graphene.DateTime(required=True)
    contact = graphene.String()
    information_url = graphene.String()


class UpdateVoterInfo(graphene.Mutation):
    class Input:
        elections = graphene.List(ElectionVoterInfoInput, required=True)

    ok = graphene.Boolean()

    def mutate(self, info, **args):
        elections = args.get('elections')
        for e in elections:
            election = ElectionModel.query.get(e['id'])
            election.mandate_period_start = e.mandate_period_start
            election.mandate_period_end = e.mandate_period_end
            election.contact = e.contact
            election.information_url = e.information_url
            db.session.add(election)

        db.session.commit()
        return UpdateVoterInfo(ok=True)


class Mutations(graphene.ObjectType):
    create_new_election_group = CreateNewElectionGroup.Field()
    update_base_settings = UpdateBaseSettings.Field()
    update_voting_periods = UpdateVotingPeriods.Field()
    update_voter_info = UpdateVoterInfo.Field()