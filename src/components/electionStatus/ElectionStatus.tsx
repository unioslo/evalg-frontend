import * as React from 'react';

import Text from '../text';
import { ElectionStatusIcon } from '../icons';
import { Trans } from 'react-i18next';

interface IProps {
  status: any,
  textSize?: string
}

const ElectionStatus = (props: IProps) => {
  const { status, textSize } = props;
  return (
    <span>
      <Text inline size={textSize}>
        <ElectionStatusIcon status={status} />
        <Trans>{`electionStatus.${status}`}</Trans>
      </Text>
    </span>
  )
};

export default ElectionStatus;
