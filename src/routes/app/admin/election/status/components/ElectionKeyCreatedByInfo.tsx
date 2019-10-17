import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

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
      {({ loading, error, data }) => {
        if (error) {
          return null;
        }
        if (loading || !data) {
          return null;
        }

        const { generatedAt, generatedBy } = data.electionGroupKeyMeta;
        let who = '';

        if (generatedBy && generatedBy.identifiers) {
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
