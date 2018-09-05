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
        current_app.logger.info('Test: %s', election_group)
        ok = True
        return CreateNewElectionGroup(election_group=election_group, ok=ok)


class ElectionBaseSettingsInput(graphene.InputObjectType):
    id = graphene.UUID(required=True)
    seats = graphene.Int(required=True)
    substitutes = graphene.Int(required=True)
    active = graphene.Boolean(required=True)
    name = GenericScalar()


class UpdateBaseSettings(graphene.Mutation):
    class Input:
        elections = graphene.List(ElectionBaseSettingsInput, required=True)
        id = graphene.UUID(required=True)
        has_gender_quota = graphene.Boolean(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, **args):
        current_app.logger.info(args.get('has_gender_quota'))
        el_grp = ElectionGroupModel.query.get(args.get('id'))
        el_grp.meta['candidate_rules']['candidate_gender'] =\
            args.get('has_gender_quota')
        db.session.add(el_grp)
        for e in args.get('elections'):
            election = ElectionModel.query.get(e['id'])
            election.meta['candidate_rules']['seats'] = e.seats
            election.meta['candidate_rules']['substitutes'] = e.substitutes
            db.session.add(election)
        db.session.commit()
        new_el_grp = ElectionGroup.get_query(info).get(args.get('id'))
        current_app.logger.info(new_el_grp.meta)
        return UpdateBaseSettings(ok=True)
