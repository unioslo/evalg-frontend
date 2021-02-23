import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

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

const calculatePath = (groupId: string | number) => (
  subRoute: string | number
) => `/admin/elections/${groupId}/${subRoute}`;

const getGroupCandidateHeader = (meta: any) => {
  if (meta.candidateType === 'poll') {
    return 'admin.pollElec.alternatives';
  }
  return 'election.candidates';
};

interface IProps {
  groupId: number | string;
  path: string;
}

const AdminStepper: React.FunctionComponent<IProps> = (props: IProps) => {
  const { groupId, path } = props;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const activeSection = path.split('/').pop();
  const linkGenerator = calculatePath(groupId);
  return (
    <>
      <Query query={electionGroupNameQuery} variables={{ id: groupId }}>
        {({ data }: { data: any }) => {
          if (data && data.electionGroup) {
            const electionGroupName = data.electionGroup.name[i18n.language];

            const { meta } = data.electionGroup;
            return (
              <>
                <div className={classes.electionGroupName}>
                  {electionGroupName}
                </div>
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
              </>
            );
          }
          return null;
        }}
      </Query>
    </>
  );
};

export default AdminStepper;
