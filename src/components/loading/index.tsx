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

type Props = {
  classes: Classes;
};

const Loading: React.FunctionComponent<Props> = props => {
  const { t } = useTranslation();
  return (
    <div className={props.classes.loading}>
      <div className={props.classes.spinBox}>
        <Spinner darkStyle={true} />
      </div>
      {props.children ? props.children : t('general.loading')}
    </div>
  );
};

export default injectSheet(styles)(Loading);
