import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import Spinner from 'components/animations/Spinner';

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
  },
};

type Props = {
  classes: Classes;
};

const Loading: React.FunctionComponent<Props> = props => {
  const { t } = useTranslation();
  return (
    <div className={props.classes.loading}>
      <Spinner darkStyle marginRight="2rem" />
      {moment().format('DD-MM') === '01-04'
        ? 'Reticulating splines…'
        : props.children
        ? props.children
        : t('general.loading')}
    </div>
  );
};

export default injectSheet(styles)(Loading);
