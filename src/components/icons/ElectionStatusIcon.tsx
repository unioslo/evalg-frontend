import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

interface IProps {
  status: any;
}

const useStyles = createUseStyles((theme: any) => ({
  icon: {
    marginRight: '0.8rem',
  },
  active: {
    fill: theme.electionStatusActiveColor,
  },
  closed: {
    fill: theme.electionStatusClosedColor,
  },
  draft: {
    fill: theme.electionStatusDraftColor,
  },
}));

const ElectionStatusIcon: React.FunctionComponent<IProps> = (props) => {
  const { status } = props;
  const theme = useTheme();
  const classes = useStyles({ theme })
  const className = classNames({
    [classes.active]: status === 'published' || status === 'ongoing',
    [classes.closed]: status === 'closed',
    [classes.draft]:
      status === 'draft' ||
      status === 'announced' ||
      status === 'multipleStatuses',
  });
  return (
    <svg className={classes.icon} width="13" height="13" viewBox="0 0 13 13">
      <circle cx="6.5" cy="6.5" r="6.5" className={className} />
    </svg>
  );
};

export default ElectionStatusIcon;
