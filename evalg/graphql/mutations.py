import graphene
from flask import current_app

from evalg import db
from evalg.metadata import make_group_from_template
from evalg.models.ou import OrganizationalUnit
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
        current_app.logger.info('MUTATING')
        #current_app.logger.info(ou_id, template, template_name)
        ou = OrganizationalUnit.query.get(ou_id)
        election_group = make_group_from_template(template_name, ou)
        current_app.logger.info('Test: %s', election_group)
        ok = True
        return CreateNewElectionGroup(election_group=election_group, ok=ok)
