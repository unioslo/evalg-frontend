import { gql } from '@apollo/client';

export const reviewVoter = gql`
  mutation reviewVoter($id: UUID!, $verify: Boolean!) {
    reviewVoter(id: $id, verify: $verify) {
      ok
    }
  }
`;

export const undoReviewVoter = gql`
  mutation undoReviewVoter($id: UUID!) {
    undoReviewVoter(id: $id) {
      ok
    }
  }
`;
