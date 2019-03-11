import React from 'react';
import { Link } from 'react-router-dom';
import { translate, TranslationFunction } from 'react-i18next';

import { Stepper, StepperItem } from '../../../../../components/stepper';

const calculatePath = (groupId: string | number) => (
  subRoute: string | number
) => '/admin/elections/' + groupId + '/' + subRoute;

interface IProps {
  groupId: number | string;
  path: string;
  t: TranslationFunction;
}

const AdminStepper: React.SFC<IProps> = props => {
  const { groupId, path, t } = props;
  const activeSection = path.split('/').pop();
  const linkGenerator = calculatePath(groupId);
  return (
    <Stepper>
      <Link to={linkGenerator('info')}>
        <StepperItem
          translateX={4}
          translateY={3}
          number={1}
          itemText={t('election.electionInfo')}
          active={activeSection === 'info'}
        />
      </Link>
      <Link to={linkGenerator('candidates')}>
        <StepperItem
          translateX={234}
          translateY={3}
          number={2}
          itemText={t('election.candidates')}
          active={activeSection === 'candidates'}
        />
      </Link>
      <Link to={linkGenerator('pollbooks')}>
        <StepperItem
          translateX={464}
          translateY={3}
          number={3}
          itemText={t('election.censuses')}
          active={activeSection === 'pollbooks'}
        />
      </Link>
      <Link to={linkGenerator('status')}>
        <StepperItem
          translateX={694}
          translateY={3}
          number={4}
          itemText={t('election.electionStatus')}
          active={activeSection === 'status'}
        />
      </Link>
    </Stepper>
  );
};

export default translate()(AdminStepper);
