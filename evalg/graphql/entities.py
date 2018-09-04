from graphene import String, Field, List
from graphene.types.generic import GenericScalar
from graphene_sqlalchemy import SQLAlchemyObjectType
from graphene_sqlalchemy.converter import (convert_sqlalchemy_type,
                                           get_column_doc,
                                           is_column_nullable)
from sqlalchemy_utils import URLType, JSONType, UUIDType

from evalg.models.authorization import (
    Principal as PrincipalModel,
    PersonPrincipal as PersonPrincipalModel,
    GroupPrincipal as GroupPrincipalModel,
    OuRole as OuRoleModel,
    OuRoleList as OuRoleListModel,
    ElectionRole as ElectionRoleModel,
    ElectionRoleList as ElectionRoleListModel,
    ElectionGroupRole as ElectionGroupRoleModel
)
from evalg.models.election import (Election as ElectionModel,
                                   ElectionGroup as ElectionGroupModel)
from evalg.models.election_list import ElectionList as ElectionListModel
from evalg.models.candidate import Candidate as CandidateModel
from evalg.models.person import Person as PersonModel
from evalg.models.pollbook import PollBook as PollBookModel
from evalg.models.voter import Voter as VoterModel
from evalg.models.group import Group as GroupModel
from evalg.graphql.utils import convert_json, underscore_to_camel


@convert_sqlalchemy_type.register(URLType)
def convert_url_to_string(type, column, registry=None):
    return String(description=get_column_doc(column),
                  required=not(is_column_nullable(column)))


@convert_sqlalchemy_type.register(JSONType)
def convert_json_to_generic_scalar(type, column, registry=None):
    return GenericScalar(description=get_column_doc(column),
                         required=not(is_column_nullable(column)))


@convert_sqlalchemy_type.register(UUIDType)
def convert_uuid_type_to_string(type, column, registry=None):
    return String(description=get_column_doc(column),
                  required=not(is_column_nullable(column)))


class Candidate(SQLAlchemyObjectType):
    class Meta:
        model = CandidateModel


class Election(SQLAlchemyObjectType):
    class Meta:
        model = ElectionModel

    def resolve_meta(self, info):
        if self.meta is None:
            return None
        return convert_json(self.meta)


class ElectionGroup(SQLAlchemyObjectType):
    class Meta:
        model = ElectionGroupModel

    def resolve_meta(self, info):
        return convert_json(self.meta)


class ElectionList(SQLAlchemyObjectType):
    class Meta:
        model = ElectionListModel


class Person(SQLAlchemyObjectType):
    class Meta:
        model = PersonModel


class Group(SQLAlchemyObjectType):
    class Meta:
        model = GroupModel


class PollBook(SQLAlchemyObjectType):
    class Meta:
        model = PollBookModel


class Voter(SQLAlchemyObjectType):
    class Meta:
        model = VoterModel


class PersonPrincipal(SQLAlchemyObjectType):
    class Meta:
        model = PersonPrincipalModel


class GroupPrincipal(SQLAlchemyObjectType):
    class Meta:
        model = GroupPrincipalModel


class Principal(SQLAlchemyObjectType):
    class Meta:
        model = PrincipalModel

    person = Field(Person)
    group = Field(Group)


class ElectionRole(SQLAlchemyObjectType):
    class Meta:
        model = ElectionRoleModel


class ElectionRoleList(SQLAlchemyObjectType):
    class Meta:
        model = ElectionRoleListModel


class ElectionGroupRole(SQLAlchemyObjectType):
    class Meta:
        model = ElectionGroupRoleModel
