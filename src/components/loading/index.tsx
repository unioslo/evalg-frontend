import React from 'react';
import { createUseStyles } from 'react-jss';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Spinner from 'components/animations/Spinner';

const useStyles = createUseStyles({
  loading: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const Loading: React.FunctionComponent<{}> = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <Spinner darkStyle marginRight="2rem" />
      {moment().format('DD-MM') === '01-04'
        ? 'Reticulating splines…'
        : props.children
        ? props.children
        : t('general.loading')}
    </div>
  );
};

export default Loading;
