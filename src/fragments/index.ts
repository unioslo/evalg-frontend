import gql from 'graphql-tag';

export const ElectionGroupFields = gql`
  fragment ElectionGroupFields on ElectionGroup {
    id
    name
    description
    type
    meta
    ouId
    publicKey
    announcedAt
    publishedAt
    cancelledAt
    deletedAt
    status
    cancelled
    announced
    published
    deleted
  }
`;

export const ElectionFields = gql`
  fragment ElectionFields on Election {
    id
    name
    description
    type
    meta
    sequence
    start
    end
    informationUrl
    contact
    mandatePeriodStart
    mandatePeriodEnd
    groupId
    active
    status
    publishedAt
    cancelledAt
  }
`;