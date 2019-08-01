import { IVoter } from '../interfaces';
import ApolloClient from 'apollo-client';
import { getSignedInPersonId } from '../queries';
import gql from 'graphql-tag';

const submitVoteMutation = gql`
  mutation submitVote($voterId: UUID!, $ballot: JSONString!) {
    vote(voterId: $voterId, ballot: $ballot) {
      ok
    }
  }
`;

const addVoterMutation = gql`
  mutation addVoter($personId: UUID!, $pollbookId: UUID!, $reason: String) {
    addVoter(personId: $personId, pollbookId: $pollbookId, reason: $reason) {
      id
    }
  }
`;

const updateVoterReasonMutation = gql`
  mutation updateVoterReason($id: UUID!, $reason: String!) {
    updateVoterReason(id: $id, reason: $reason) {
      ok
    }
  }
`;

/**
 * Submit's a vote for the given voter. If voter is null, a new voter for the
 * signed in person is created. If voter is not null and is self added and not
 * verified yet, then the not-in-pollbook-justification for the voter is
 * updated.
 */
export const submitVote = async (
  ballotData: object,
  client: ApolloClient<any>,
  pollbookId: string,
  notInPollBookJustification: string,
  voter: IVoter | null
) => {
  if (!voter) {
    let personId;
    try {
      personId = await getSignedInPersonId(client);
    } catch (error) {
      throw new Error('Could not get ID of signed in user.');
    }

    const res = await client.mutate({
      mutation: addVoterMutation,
      variables: {
        personId,
        pollbookId,
        reason: notInPollBookJustification,
      },
    });

    if (res.data) {
      voter = res.data.addVoter;
    }
  } else {
    if (voter.selfAdded && !voter.verified) {
      await client.mutate({
        mutation: updateVoterReasonMutation,
        variables: {
          id: voter.id,
          reason: notInPollBookJustification,
        },
      });
    }
  }

  if (!voter) {
    throw new Error("Couldn't create voter for person.");
  }

  const ballotDataJSON = JSON.stringify(ballotData);

  const voteRes = await client.mutate({
    mutation: submitVoteMutation,
    variables: {
      voterId: voter.id,
      ballot: ballotDataJSON,
    },
  });

  if (!voteRes.data.vote.ok) {
    throw new Error('An error occured when voting.');
  }
};
