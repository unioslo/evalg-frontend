import * as React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { useTranslation } from 'react-i18next';

import Spinner from '../animations/Spinner';

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinBox: {
    marginRight: '2rem',
  },
};

type StyleProp = {
  classes: Classes;
};

const Loading = (props: StyleProp) => {
  const { t } = useTranslation();
  return (
    <div className={props.classes.loading}>
      <div className={props.classes.spinBox}>
        <Spinner darkStyle={true} />
      </div>
      {t('general.loading')}
    </div>
  );
};

export default injectSheet(styles)(Loading);
