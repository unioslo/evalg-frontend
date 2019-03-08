import * as React from 'react';
import Text from '../../../../../components/text';

interface IProps {
  votesOutsideCensus: number;
  totalVotes: number;
  preposition: string | React.ReactElement;
}

const VoteStatus = (props: IProps) => {
  const { votesOutsideCensus, totalVotes, preposition } = props;
  return (
    <div>
      <Text size="xlarge" inline>
        {votesOutsideCensus}
      </Text>
      &nbsp;&nbsp;
      <Text inline>{preposition}</Text>&nbsp;&nbsp;
      <Text size="xlarge" inline>
        {totalVotes}
      </Text>
    </div>
  );
};

export default VoteStatus;
