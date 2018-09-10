/* @flow */
import * as React from 'react';

import { Trans } from 'react-i18next';;
import { ElectionStatusIcon } from 'components/icons';
import Text from 'components/text';

type Props = {
  status: ElectionStatusType,
  textSize?: string
}

const ElectionStatus = (props: Props) => {
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