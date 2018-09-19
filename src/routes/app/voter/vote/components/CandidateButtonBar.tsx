import * as React from 'react';
import injectSheet from 'react-jss';

import Icon from 'components/icon';

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
        <Icon type="upArrow" customClass={upArrowClass} />
      </button>
      <button
        className={cls.arrowButton}
        disabled={props.downDisabled}
        onClick={props.downAction}>
        <Icon type="downArrow" customClass={downArrowClass} />
      </button>
      {props.cumulateAction ?
        <button
          className={cls.actionButton}
          onClick={props.cumulateAction}>
          {props.cumulateText}
        </button> : null
      }
      <button
        className={cls.actionButton}
        onClick={props.removeAction}>
        <svg height="25px" viewBox="0 0 12 12" >
          <g stroke="#FFF" strokeWidth="1" fill="none" >
            <g stroke="#FFF">
              <path d="M8.56910219,6 L11.1742662,8.60516397 C11.6206374,9.05153521 11.6253777,9.77104099 11.1784699,10.2179488 L10.2179488,11.1784699 C9.7716987,11.62472 9.05549904,11.6246012 8.60516397,11.1742662 L6,8.56910219 L3.39483603,11.1742662 C2.94846479,11.6206374 2.22895901,11.6253777 1.78205121,11.1784699 L0.821530097,10.2179488 C0.375280002,9.7716987 0.375398769,9.05549904 0.825733841,8.60516397 L3.43089781,6 L0.825733841,3.39483603 C0.379362596,2.94846479 0.374622298,2.22895901 0.821530098,1.78205121 L1.78205121,0.821530098 C2.2283013,0.375280002 2.94450096,0.375398769 3.39483603,0.825733841 L6,3.43089781 L8.60516397,0.825733841 C9.05153521,0.379362596 9.77104099,0.374622298 10.2179488,0.821530098 L11.1784699,1.78205121 C11.62472,2.2283013 11.6246012,2.94450096 11.1742662,3.39483603 L8.56910219,6 Z" />
            </g>
          </g>
        </svg>
        <div className={cls.actionText}>
          {props.removeText}
        </div>
      </button>
    </div>
  )
}

export default injectSheet(styles)(CandidateButtonBar);