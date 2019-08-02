import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { Stepper, StepperItem } from 'components/stepper';

const electionGroupNameQuery = gql`
  query electionGroup($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
    }
  }
`;

const styles = (theme: any) => ({
  electionGroupName: {
    marginBottom: '2rem',
    marginLeft: '1rem',
    fontSize: '2rem',
    color: theme.contentPageHeaderColor,
    fontStyle: 'italic',
  },
});

const calculatePath = (groupId: string | number) => (
  subRoute: string | number
) => `/admin/elections/${groupId}/${subRoute}`;

interface IProps {
  groupId: number | string;
  path: string;
  classes: Classes;
}

const AdminStepper: React.FunctionComponent<IProps> = (props: IProps) => {
  const { groupId, path, classes } = props;
  const { t, i18n } = useTranslation();
  const activeSection = path.split('/').pop();
  const linkGenerator = calculatePath(groupId);
  return (
    <>
      <Query query={electionGroupNameQuery} variables={{ id: groupId }}>
        {({ data }) => {
          if (data && data.electionGroup) {
            const electionGroupName = data.electionGroup.name[i18n.language];
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
              </>
            );
          }
          return null;
        }}
      </Query>
    </>
  );
};

export default injectSheet(styles)(AdminStepper);
