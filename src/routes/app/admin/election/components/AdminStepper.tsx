import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import { Link } from 'react-router-dom';

import { Stepper, StepperItem } from 'components/stepper';

const electionGroupNameQuery = gql`
  query electionGroup($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      meta
    }
  }
`;

const useStyles = createUseStyles((theme: any) => ({
  electionGroupName: {
    marginBottom: '2rem',
    marginLeft: '1rem',
    fontSize: '2rem',
    color: theme.contentPageHeaderColor,
    fontStyle: 'italic',
  },
}));

const calculatePath =
  (groupId: string | number) => (subRoute: string | number) =>
    `/admin/elections/${groupId}/${subRoute}`;

const getGroupCandidateHeader = (meta: any) => {
  if (meta.candidateType === 'poll') {
    return 'admin.pollElec.alternatives';
  }
  return 'election.candidates';
};

interface AdminStepperProps {
  groupId: number | string;
  path: string;
}

export default function AdminStepper(props: AdminStepperProps) {
  const { groupId, path } = props;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { data } = useQuery(electionGroupNameQuery, {
    variables: { id: groupId },
  });

  const activeSection = path.split('/').pop();
  const linkGenerator = calculatePath(groupId);

  /**
   * Helper function for checking if we are in a candidate page.
   * List elections add two new candidate pages.
   *
   * @returns true if in one of the candidate pages, false else
   */
  const candidateSelection = () => {
    if (activeSection === 'candidates' || activeSection === 'addlist') {
      return true;
    }
    if (path.split('/').slice(-2, -1)[0] === 'editlist') {
      return true;
    }
    return false;
  };

  if (data && data.electionGroup) {
    const electionGroupName = data.electionGroup.name[i18n.language];
    const { meta } = data.electionGroup;
    return (
      <>
        <div className={classes.electionGroupName}>{electionGroupName}</div>
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
              itemText={t(getGroupCandidateHeader(meta))}
              active={candidateSelection()}
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
      </>
    );
  }
  return null;
}
