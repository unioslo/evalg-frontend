import * as React from 'react';
import injectSheet from 'react-jss';

import Icon from '../../../../../components/icon';

const styles = (theme: any) => ({
  actionButton: {
    composes: '$button',
    flex: 2,
  },
  actionText: {
    color: '#F4F9FA',
    fontSize: '1.8rem',
    marginLeft: '1rem'

  },
  arrow: {
    fill: '#F4F9FA'
  },
  arrowButton: {
    composes: '$button',
    flex: 1,
    maxWidth: '25%',
  },
  arrowDisabled: {
    fill: '#6EAEBB'
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
})

interface IProps {
  upAction: () => void
  downAction: () => void
  removeAction: () => void
  cumulateAction?: () => void
  removeText: React.ReactNode
  cumulateText?: React.ReactNode
  upDisabled: boolean
  downDisabled: boolean
  classes: any
}

const CandidateButtonBar: React.SFC<IProps> = props => {
  const { classes: cls } = props;
  const upArrowClass = props.upDisabled ? 'gray' : 'white'
  const downArrowClass = props.downDisabled ? 'gray' : 'white'
  return (
    <div className={cls.buttonBar}>
      <button
        disabled={props.upDisabled}
        className={cls.arrowButton}
        onClick={props.upAction}>
        <Icon type="upArrow" custom={upArrowClass} />
      </button>
      <button
        className={cls.arrowButton}
        disabled={props.downDisabled}
        onClick={props.downAction}>
        <Icon type="downArrow" custom={downArrowClass} />
      </button>
      {props.cumulateAction ?
        <button
          className={cls.actionButton}
          onClick={props.cumulateAction}>
          <Icon type="star" custom={{ color: 'white' }} />
          {props.cumulateText}
        </button> : null
      }
      <button
        className={cls.actionButton}
        onClick={props.removeAction}>
        <Icon type="remove" custom={{ color: 'white' }} />
        <div className={cls.actionText}>
          {props.removeText}
        </div>
      </button>
    </div>
  )
}

export default injectSheet(styles as any)(CandidateButtonBar);