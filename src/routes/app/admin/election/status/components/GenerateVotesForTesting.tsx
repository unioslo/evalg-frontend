import React, { useState } from 'react';
import gql from 'graphql-tag';
import { withApollo, WithApolloClient } from 'react-apollo';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { ElectionGroup, IPollBook } from 'interfaces';
import Button from 'components/button';
import { shuffleArray } from 'utils/helpers';
import { sleep } from 'utils';
import { H3 } from 'components/text';

const DEFAULT_N_VOTES_PER_POLLBOOK = 100;
const BLANK_VOTE_PROBABILITY = 0.05;
const ONE_REQUEST_AT_A_TIME = false;
const DELAY_BETWEEN_REQUEST_BATCHES_MS = 600;

const addVoterMutation = gql`
  mutation addVoterByIdentifier($pollbookId: UUID!, $idValue: String!) {
    addVoterByIdentifier(
      approved: true
      idType: feide_id
      idValue: $idValue
      pollbookId: $pollbookId
    ) {
      id
    }
  }
`;

const voteMutation = gql`
  mutation vote($voterId: UUID!, $ballotData: JSONString!) {
    vote(ballot: $ballotData, voterId: $voterId) {
      ok
    }
  }
`;

const styles = (theme: any) => ({
  testingBox: {
    marginTop: '3rem',
    border: `2px solid #ff8936`,
    borderRadius: '2px',
    padding: '1rem',
  },
});

function getRandomString(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomBallot = (candidateIds: string[]) => {
  if (Math.random() < BLANK_VOTE_PROBABILITY) {
    return {
      voteType: 'prefElecVote',
      isBlankVote: true,
      rankedCandidateIds: [],
    };
  }

  const shuffledCandidateIds = shuffleArray(candidateIds);
  const nCandidatesToVoteFor = getRandomIntInclusive(1, candidateIds.length);
  const rankedCandidateIds = shuffledCandidateIds.slice(
    0,
    nCandidatesToVoteFor
  );

  return {
    voteType: 'prefElecVote',
    isBlankVote: false,
    rankedCandidateIds,
  };
};

interface IProps {
  electionGroup: ElectionGroup;
  classes: Classes;
}

const GenerateVotesForTesting: React.FunctionComponent<WithApolloClient<
  IProps
>> = ({ electionGroup, classes, client }) => {
  const [isWorking, setIsWorking] = useState(false);
  const [nVotesPerPollbook, setNVotesPerPollbook] = useState(
    DEFAULT_N_VOTES_PER_POLLBOOK
  );

  const generateVotersAndVotes = async () => {
    setIsWorking(true);

    for (const election of electionGroup.elections.filter(e => e.active)) {
      const candidateIds = election.lists[0].candidates.map(c => c.id);

      for (const pollbook of election.pollbooks) {
        for (let i = 0; i < nVotesPerPollbook; i += 1) {
          if (ONE_REQUEST_AT_A_TIME) {
            await generateOneVoterAndVote(pollbook, candidateIds);
          } else {
            generateOneVoterAndVote(pollbook, candidateIds);

            if (i % 5 === 0) {
              await sleep(DELAY_BETWEEN_REQUEST_BATCHES_MS);
            }
          }
        }
      }
    }

    setIsWorking(false);
  };

  const generateOneVoterAndVote = async (
    pollbook: IPollBook,
    candidateIds: string[]
  ) => {
    const username = getRandomString(10);
    const result = await client.mutate({
      mutation: addVoterMutation,
      variables: {
        pollbookId: pollbook.id,
        idValue: `${username}@uio.no`,
      },
    });

    const voterId =
      result &&
      result.data &&
      result.data.addVoterByIdentifier &&
      result.data.addVoterByIdentifier.id;
    if (!voterId) return;
    const ballotJSON = JSON.stringify(generateRandomBallot(candidateIds));
    await client.mutate({
      mutation: voteMutation,
      variables: {
        voterId,
        ballotData: ballotJSON,
      },
    });
  };

  return (
    <div className={classes.testingBox}>
      <H3>Testverktøy</H3>
      Antall stemmer per pollbook:{' '}
      <input
        style={{ marginBottom: '1rem' }}
        type="number"
        onChange={e => setNVotesPerPollbook(Number(e.target.value))}
        value={nVotesPerPollbook}
        disabled={isWorking}
      />
      <Button
        action={generateVotersAndVotes}
        text="Generer stemmer"
        showSpinner={isWorking}
        disabled={isWorking}
      />
    </div>
  );
};

export default injectSheet(styles)(withApollo<IProps>(GenerateVotesForTesting));
