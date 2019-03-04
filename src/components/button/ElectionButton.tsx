import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import { Trans } from 'react-i18next';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  button: {
    position: 'relative',
    borderRadius: '4px',
    border: '2px dashed #9B9B9B',
    width: '20rem',
    height: '7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.6rem',
  },
  buttonComplete: {
    background: theme.colors.lightBlueGray
  },
  buttonActive: {
    border: `2px solid ${theme.colors.lightTurquoise}`,
    '&:hover': {
      border: `2px solid ${theme.colors.darkTurquoise}`,
      cursor: 'pointer'
    },
    '&:hover $hoverText': {
      display: 'flex'
    },
  },
  text: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: theme.colors.lighterGray,
    textAlign: 'center'
  },
  textComplete: {
    color: theme.colors.darkGreyishBrown
  },
  hoverText: {
    display: 'none',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: theme.colors.lightBlueGray,
    color: theme.colors.darkTurquoise,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },
  counter: {
    fontSize: '1.4rem',
    textAlign: 'center',
    marginTop: '0.8rem',
  },
  container: {
    display: 'flex'
  },
  containerMargin: {
    '& $wrapper': {
      marginRight: '4rem'
    }
  },
  containerSpaceBetween: {
    justifyContent: 'space-between'
  },
  wrapper: {}
})

interface IContainerProps {
  classes: Classes,
  children: React.ReactNode[],
}

const ElectionButtonContainer: React.SFC<IContainerProps> = (props) => {
  let spaceBetween = false;
  const { children, classes } = props;
  if (children && children.length && children.length > 2) {
    spaceBetween = true;
  }
  const cls = classNames({
    [classes.container]: true,
    [classes.containerMargin]: !spaceBetween,
    [classes.containerSpaceBetween]: spaceBetween
  });
  return (
    <div className={cls}>
      {children}
    </div>
  );
};


interface IProps {
  name: string,
  count: number,
  minCount?: number,
  counterTextTag?: string,
  hoverText: any | string,
  action: (event: any) => void,
  active?: boolean,
  classes: Classes
}

const ElectionButton = (props: IProps) => {
  const {
    hoverText, name, count, minCount, counterTextTag, action, active,
    classes
  } = props;
  let hasCompleteStatus = false;

  if (minCount) {
    hasCompleteStatus = count >= minCount;
  }

  const elButtonClasses = classNames({
    [classes.button]: true,
    [classes.buttonActive]: active,
    [classes.buttonComplete]: hasCompleteStatus
  });
  const elButtonTextClasses = classNames({
    [classes.text]: true,
    [classes.textComplete]: hasCompleteStatus
  });
  return (
    <div className={classes.wrapper}>
      <div className={elButtonClasses}>
        <div className={classes.hoverText} onClick={action}>
          {hoverText}
        </div>
        <span className={elButtonTextClasses}>{name} ({count})</span>
      </div>
      {active && counterTextTag &&
        <div className={classes.counter}>
          <Trans values={{ minCount }} count={count}>{counterTextTag}</Trans>
        </div>
      }
    </div>
  )
};

const StyledContainer = injectSheet(styles)(ElectionButtonContainer);
const StyledElectionButton = injectSheet(styles)(ElectionButton);

export {
  StyledContainer as ElectionButtonContainer,
  StyledElectionButton as ElectionButton
}