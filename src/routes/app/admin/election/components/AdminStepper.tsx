import React from 'react';
import { Link } from 'react-router-dom';
import { translate, TranslationFunction } from 'react-i18next';

import { Stepper, StepperSection } from '../../../../../components/stepper';

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
        <StepperSection
          translateX="4"
          translateY="3"
          number="1"
          desc={t('election.electionInfo')}
          active={activeSection === 'info'}
        />
      </Link>
      <Link to={linkGenerator('candidates')}>
        <StepperSection
          translateX="234"
          translateY="3"
          number="2"
          desc={t('election.candidates')}
          active={activeSection === 'candidates'}
        />
      </Link>
      <Link to={linkGenerator('pollbooks')}>
        <StepperSection
          translateX="464"
          translateY="3"
          number="3"
          desc={t('election.censuses')}
          active={activeSection === 'pollbooks'}
        />
      </Link>
      <Link to={linkGenerator('status')}>
        <StepperSection
          translateX="694"
          translateY="3"
          number="4"
          desc={t('election.electionStatus')}
          active={activeSection === 'status'}
        />
      </Link>
    </Stepper>
  );
};

export default translate()(AdminStepper);
