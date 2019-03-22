import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import { Trans } from 'react-i18next';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  voterPanelSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '22rem',
    height: '13.5rem',
    border: `2px solid ${theme.colors.lightTurquoise}`,
    borderRadius: '4px',
    padding: '1.4rem',
  },
  voterGroupPanelActive: {
    '&:hover': {
      borderWidth: '3px',
      padding: '1.3rem',
    },
    color: theme.colors.greyishBrown,
  },
  voterGroupPanelInactive: {
    border: `2px dashed ${theme.colors.lightGray}`,
    color: theme.colors.lightGray,
  },
  voterGroupName: {
    marginBottom: '0.6rem',
  },
  voterGroupNameText: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  numberOfPersons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  numberOfPersonsText: {
    fontSize: '1.4rem',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  actionLinks: {},
  actionLink: {
    fontSize: '1.4rem',
    color: theme.actionTextColor,
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    '&:not(:last-child)': {
      marginBottom: '0.5rem',
    },
  },
  removeAllButton: {},

  container: {
    display: 'flex',
  },
  containerMargin: {
    '& $voterPanelSection': {
      marginRight: '4rem',
    },
  },
  containerSpaceBetween: {
    justifyContent: 'space-between',
  },
});

interface IContainerProps {
  classes: Classes;
  children: React.ReactNode[];
}

const VoterGroupActionPanelContainer: React.SFC<IContainerProps> = props => {
  let spaceBetween = false;
  const { children, classes } = props;
  if (children && children.length && children.length > 2) {
    spaceBetween = true;
  }
  const cls = classNames({
    [classes.container]: true,
    [classes.containerMargin]: !spaceBetween,
    [classes.containerSpaceBetween]: spaceBetween,
  });
  return <div className={cls}>{children}</div>;
};

interface IProps {
  voterGroupName: string;
  addActionText?: string;
  addAction?: (event: any) => void;
  removeAllActionText?: string;
  removeAllAction?: (event: any) => void;
  count: number;
  minCount?: number;
  counterText?: string;
  active?: boolean;
  classes: Classes;
}

const VoterGroupActionPanel = (props: IProps) => {
  const {
    voterGroupName,
    addActionText,
    addAction,
    removeAllActionText,
    removeAllAction,
    count,
    minCount,
    counterText,
    active,
    classes,
  } = props;
  let hasCompleteStatus = false;

  if (minCount) {
    hasCompleteStatus = count >= minCount;
  }

  const voterGroupPanelCls = classNames({
    [classes.voterPanelSection]: true,
    [classes.voterGroupPanelActive]: active,
    [classes.voterGroupPanelInactive]: active === false,
    [classes.voterGroupPanelHasCompleteStatus]: hasCompleteStatus,
  });

  return (
    <div className={voterGroupPanelCls}>
      <div className={classes.voterGroupName}>
        <span className={classes.voterGroupNameText}>{voterGroupName}</span>
      </div>
      <div className={classes.numberOfPersons}>
        <span className={classes.numberOfPersonsText}>
          {count}{' '}
          {count === 1 ? (
            <Trans>census.person</Trans>
          ) : (
            <Trans>census.persons</Trans>
          )}
        </span>
      </div>
      {active && (
        <div className={classes.actionLinks}>
          <div className={classes.actionLink} onClick={addAction}>
            {addActionText}
          </div>
          <div className={classes.actionLink} onClick={removeAllAction}>
            {removeAllActionText}
          </div>
        </div>
      )}
      {counterText && <div className={classes.counterText}>{counterText}</div>}
    </div>
  );
};

const StyledContainer = injectSheet(styles)(VoterGroupActionPanelContainer);
const StyledVoterGroupActionPanel = injectSheet(styles)(VoterGroupActionPanel);

export {
  StyledContainer as VoterGroupActionPanelContainer,
  StyledVoterGroupActionPanel as VoterGroupActionPanel,
};
