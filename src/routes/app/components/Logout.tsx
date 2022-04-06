import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';

import Spinner from 'components/animations/Spinner';
import { IUserContext } from 'providers/UserContext';

const useStyles = createUseStyles({
  logout: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinBox: {
    marginRight: '2rem',
  },
});

interface IProps {
  context: IUserContext;
}

const Logout: React.FunctionComponent<WithApolloClient<IProps>> = ({
  context,
  client: apolloClient,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const logout = async () => {
    if (apolloClient) {
      await apolloClient.resetStore();
    }
    await sessionStorage.clear();
    await context.signOut();
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    logout();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className={classes.logout}>
      <div className={classes.spinBox}>
        <Spinner darkStyle />
      </div>
      {t('general.logoutInProgress')}
    </div>
  );
};
export default withApollo<IProps>(Logout);
