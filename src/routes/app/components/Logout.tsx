import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import { oidcLogoutUrl } from 'appConfig';
import Spinner from 'components/animations/Spinner';
import { withApollo, WithApolloClient } from 'react-apollo';
import { IUserContext } from 'providers/UserContext';

const styles = {
  logout: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinBox: {
    marginRight: '2rem',
  },
};

interface IProps {
  context: IUserContext;
  classes: Classes;
}

const Logout: React.FunctionComponent<WithApolloClient<IProps>> = ({
  context,
  client: apolloClient,
  classes,
}) => {
  const { t } = useTranslation();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    logout();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const logout = async () => {
    await context.signOut();
    await apolloClient.resetStore();
    sessionStorage.clear();
    window.location.href = oidcLogoutUrl;
  };

  return (
    <div className={classes.logout}>
      <div className={classes.spinBox}>
        <Spinner darkStyle />
      </div>
      {t('general.logoutInProgress')}
    </div>
  );
};
export default injectSheet(styles)(withApollo<IProps>(Logout));
