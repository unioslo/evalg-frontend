import React from 'react';
import { Link } from 'react-router-dom';

import { Stepper, StepperItem } from '../../../../../components/stepper';
import { useTranslation } from 'react-i18next';

const calculatePath = (groupId: string | number) => (
  subRoute: string | number
) => '/admin/elections/' + groupId + '/' + subRoute;

interface IProps {
  groupId: number | string;
  path: string;
}

const AdminStepper: React.FunctionComponent<IProps> = (props: IProps) => {
  const { groupId, path } = props;
  const { t } = useTranslation();
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

export default AdminStepper;
