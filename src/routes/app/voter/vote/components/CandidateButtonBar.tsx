import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';

import Icon from 'components/icon';

const useStyles = createUseStyles((theme: any) => ({
  actionButton: {
    composes: '$button',
    flex: 2,
  },
  actionText: {
    color: '#F4F9FA',
    fontSize: '1.8rem',
    marginLeft: '1rem',
  },
  arrow: {
    fill: '#F4F9FA',
  },
  arrowButton: {
    composes: '$button',
    flex: 1,
    maxWidth: '25%',
  },
  arrowDisabled: {
    fill: '#6EAEBB',
  },
  button: {
    alignItems: 'center',
    background: theme.colors.darkTurquoise,
    display: 'flex',
    justifyContent: 'center',
    opacity: 0.9,
  },
  buttonBar: {
    bottom: 0,
    display: 'flex',
    height: '6.5rem',
    left: 0,
    position: 'fixed',
    right: 0,
  },
}));

interface IProps {
  upAction: () => void;
  downAction: () => void;
  removeAction: () => void;
  cumulateAction?: () => void;
  removeText: React.ReactNode;
  cumulateText?: React.ReactNode;
  upDisabled: boolean;
  downDisabled: boolean;
}

const CandidateButtonBar: React.FunctionComponent<IProps> = (props) => {
  const {
    upAction,
    downAction,
    upDisabled,
    downDisabled,
    cumulateAction,
    cumulateText,
    removeAction,
    removeText,
  } = props;
  const upArrowClass = upDisabled ? 'gray' : 'white';
  const downArrowClass = downDisabled ? 'gray' : 'white';
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <div className={classes.buttonBar}>
      <button
        disabled={upDisabled}
        className={classes.arrowButton}
        onClick={upAction}
      >
        <Icon type="upArrow" custom={upArrowClass} />
      </button>
      <button
        className={classes.arrowButton}
        disabled={downDisabled}
        onClick={downAction}
      >
        <Icon type="downArrow" custom={downArrowClass} />
      </button>
      {cumulateAction ? (
        <button className={classes.actionButton} onClick={cumulateAction}>
          <Icon type="star" custom={{ color: 'white' }} />
          {cumulateText}
        </button>
      ) : null}
      <button className={classes.actionButton} onClick={removeAction}>
        <Icon type="remove" custom={{ color: 'white' }} />
        <div className={classes.actionText}>{removeText}</div>
      </button>
    </div>
  );
};

export default CandidateButtonBar;
