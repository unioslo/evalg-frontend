import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

import { Date, Time } from 'components/i18n';
import { idValueForPerson } from 'utils/processGraphQLData';

export const electionGroupKeyMetaQuery = gql`
  query electionGroupKeyMeta($id: UUID!) {
    electionGroupKeyMeta(id: $id) {
      generatedAt
      generatedBy {
        id
        identifiers {
          idType
          idValue
        }
      }
    }
  }
`;

interface Props {
  electionGroupId: string;
}

const ElectionKeyCreatedByInfo: React.FunctionComponent<Props> = ({
  electionGroupId,
}) => (
  <Query query={electionGroupKeyMetaQuery} variables={{ id: electionGroupId }}>
    {(result: any) => {
      const { loading, error, data } = result;
      if (error) {
        return null;
      }
      if (loading || !data) {
        return null;
      }

      const { generatedAt, generatedBy } = data.electionGroupKeyMeta;
      let who = '';

      if (generatedBy && generatedBy.identifiers !== null) {
        who = idValueForPerson(generatedBy);
      }

      return (
        <>
          <span>{who}</span> (
          <Date dateTime={generatedAt} longDate />{' '}
          <Time dateTime={generatedAt} />)
        </>
      );
    }}
  </Query>
);

export default ElectionKeyCreatedByInfo;
