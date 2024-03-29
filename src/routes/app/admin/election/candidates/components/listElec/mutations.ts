/**
 * @file Mutations for creating, updating, and deleting election lists
 */
import { gql } from '@apollo/client';

export const addElectionList = gql`
  mutation addElectionList(
    $description: LangDict
    $electionId: UUID!
    $informationUrl: String
    $name: LangDict!
  ) {
    addElectionList(
      description: $description
      electionId: $electionId
      informationUrl: $informationUrl
      name: $name
    ) {
      ok
    }
  }
`;

export interface AddElectionListVars {
  description: {
    en: string;
    nb: string;
    nn: string;
  };
  electionId: string;
  informationUrl?: string;
  name: {
    en: string;
    nb: string;
    nn: string;
  };
}

export interface AddElectionListData {
  addElectionList: {
    ok: boolean;
  };
}

export const updateElectionList = gql`
  mutation updateElectionList(
    $description: LangDict
    $electionId: UUID!
    $id: UUID!
    $informationUrl: String
    $name: LangDict!
  ) {
    updateElectionList(
      description: $description
      electionId: $electionId
      id: $id
      informationUrl: $informationUrl
      name: $name
    ) {
      ok
    }
  }
`;

export interface UpdateElectionListVars {
  description: {
    en: string;
    nb: string;
    nn: string;
  };
  electionId: string;
  id: string;
  informationUrl?: string;
  name: {
    en: string;
    nb: string;
    nn: string;
  };
}

export interface UpdateElectionListData {
  updateElectionList: {
    ok: boolean;
  };
}

export const deleteElectionList = gql`
  mutation deleteElectionList($id: UUID!) {
    deleteElectionList(id: $id) {
      ok
    }
  }
`;

export interface DeleteElectionListVars {
  id: string;
}

export interface DeleteElectionListData {
  deleteElectionList: {
    ok: boolean;
  };
}

export const addListElecCandidate = gql`
  mutation addListElecCandidate(
    $informationUrl: String
    $listId: UUID!
    $name: String!
    $preCumulated: Boolean!
    $priority: Int!
    $fieldOfStudy: String
  ) {
    addListElecCandidate(
      informationUrl: $informationUrl
      listId: $listId
      name: $name
      preCumulated: $preCumulated
      priority: $priority
      fieldOfStudy: $fieldOfStudy
    ) {
      ok
    }
  }
`;

export interface AddListElecCandidateVars {
  informationUrl: string;
  listId: string;
  name: string;
  preCumulated: boolean;
  priority: number;
  fieldOfStudy: string;
}

export interface AddListElecCandidateData {
  updateListElecCandidate: {
    ok: boolean;
  };
}

export const updateListElecCandidate = gql`
  mutation updateListElecCandidate(
    $id: UUID!
    $informationUrl: String
    $listId: UUID!
    $name: String!
    $preCumulated: Boolean!
    $priority: Int!
    $fieldOfStudy: String
  ) {
    updateListElecCandidate(
      id: $id
      informationUrl: $informationUrl
      listId: $listId
      name: $name
      preCumulated: $preCumulated
      priority: $priority
      fieldOfStudy: $fieldOfStudy
    ) {
      ok
    }
  }
`;

export interface UpdateListElecCandidateVars {
  id: string;
  informationUrl: string;
  listId: string;
  name: string;
  preCumulated: boolean;
  priority: number;
  fieldOfStudy: string;
}

export interface UpdateListElecCandidateData {
  updateListElecCandidate: {
    ok: boolean;
  };
}

export const deleteCandidate = gql`
  mutation deleteCandidate($id: UUID!) {
    deleteCandidate(id: $id) {
      ok
    }
  }
`;

export interface DeleteCandidateVars {
  id: string;
}

export interface DeleteCandidateData {
  deleteCandidate: {
    ok: boolean;
  };
}
