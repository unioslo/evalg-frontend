import React from 'react';
import { createUseStyles } from 'react-jss';

import Icon from 'components/icon';

const useStyles = createUseStyles({
  iconContainer: {
    width: '2.2rem',
    height: '2.2rem',
  },
  iconContainerWithOffset: {
    width: '2.2rem',
    height: '2.2rem',
    position: 'relative',
    top: '-0.2rem',
  },
  generatingSpinner: {
    width: '2.2rem',
    height: '2.2rem',
    border: '3px solid rgba(0,0,0,.3)',
    borderRadius: '50%',
    borderTopColor: '#000',
    animation: 'spin 0.8s linear infinite',
    '-webkit-animation': 'spin 0.8s linear infinite',
  },
  '@keyframes spin': {
    to: { '-webkit-transform': 'rotate(360deg)' },
  },
});

export enum SubtaskWorkingState {
  notStarted,
  working,
  failed,
  done,
}

interface IProps {
  workingState: SubtaskWorkingState;
}

const SubtaskWorkingStateIcon: React.FunctionComponent<IProps> = (props) => {
  const { workingState } = props;
  const classes = useStyles();
  return (
    <>
      {workingState === SubtaskWorkingState.notStarted && (
        <div className={classes.iconContainer} />
      )}
      {workingState === SubtaskWorkingState.working && (
        <div className={classes.iconContainer}>
          <div className={classes.generatingSpinner} />
        </div>
      )}
      {workingState === SubtaskWorkingState.failed && (
        <div className={classes.iconContainerWithOffset}>
          <Icon type="xMark" />
        </div>
      )}
      {workingState === SubtaskWorkingState.done && (
        <div className={classes.iconContainerWithOffset}>
          <Icon type="checkMark" />
        </div>
      )}
    </>
  );
};

export default SubtaskWorkingStateIcon;
