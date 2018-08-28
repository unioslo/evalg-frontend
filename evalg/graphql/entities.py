from graphene import String
from graphene.types.generic import GenericScalar
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
def convert_uuid_type_to_string(type, column, registry=None):
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
