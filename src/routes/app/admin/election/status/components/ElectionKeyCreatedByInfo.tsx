import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { Date, Time } from '../../../../../../components/i18n';

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

      const generatedAt = data.electionGroupKeyMeta.generatedAt;
      const generatedBy = data.electionGroupKeyMeta.generatedBy;
      let who = '';

      if (generatedBy) {
        const identifiers = generatedBy.identifiers;

        for (let id of identifiers) {
          if (id.idType === 'feide_id') {
            who = id.idValue;
            break;
          }
        }
        if (!who) {
          // Fallback to uid
          for (let id of identifiers) {
            if (id.idType === 'uid') {
              who = id.idValue;
              break;
            }
          }
        }
        if (!who) {
          // fallback to person UUID
          who = generatedBy.id;
        }
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
