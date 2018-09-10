/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

type Props = {
  status: ElectionStatusType,
  classes: Object
}

const styles = theme => ({
  icon: {
    marginRight: '0.8rem',
  },
  active: {
    fill: theme.electionStatusActiveColor
  },
  closed: {
    fill: theme.electionStatusClosedColor
  },
  draft: {
    fill: theme.electionStatusDraftColor
  },
})

const ElectionStatusIcon = (props: Props) => {
  const { classes, status } = props;
  const className = classNames({
    [classes.active]: status === 'published' || status === 'ongoing',
    [classes.closed]: status === 'closed',
    [classes.draft]: status === 'draft' || status === 'announced' || status === 'multipleStatuses'
  });
  return (
    <svg className={classes.icon} width="13" height="13" viewBox="0 0 13 13" >
      <path d="M6.5 13A6.5 6.5 0 0 0 13 6.5C13 2.91 6.5 0 6.5 0S0 2.91 0 6.5A6.5 6.5 0 0 0 6.5 13z"
        className={className}
        fillRule="evenodd" />
    </svg>
  )
};


export default injectSheet(styles)(ElectionStatusIcon);