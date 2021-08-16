import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';

const useStyles = createUseStyles((theme: any) => ({
  voterPanelSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  voterGroupPanelTopElements: {},
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
    textAlign: 'center',
  },
  actionLinks: {
    display: 'flex',
    fontSize: '1.4rem',
    lineHeight: '1.9rem',
  },
  actionLink: {
    color: theme.actionTextColor,
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    '&:first-child': {
      marginRight: '1rem',
    },
    '&:last-child': {
      marginLeft: '1rem',
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
  voterGroupPanelHasCompleteStatus: {},
  counterText: {},
}));

interface IContainerProps {
  children: React.ReactNode[];
}

const VoterGroupActionPanelContainer: React.FunctionComponent<IContainerProps> =
  (props) => {
    let spaceBetween = false;
    const { children } = props;
    const theme = useTheme();
    const classes = useStyles({ theme });

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
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

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

  const actionLinkCls = classNames({
    [classes.actionLink]: true,
    'button-no-style': true,
  });

  return (
    <div className={voterGroupPanelCls}>
      <div className={classes.voterGroupPanelTopElements}>
        <div className={classes.voterGroupName}>
          <span className={classes.voterGroupNameText}>{voterGroupName}</span>
        </div>
        <div className={classes.numberOfPersons}>
          <span className={classes.numberOfPersonsText}>
            {count}{' '}
            {count === 1
              ? t('census.person').toLowerCase()
              : t('census.persons').toLowerCase()}
          </span>
        </div>
      </div>
      {active && (
        <div className={classes.actionLinks}>
          <button className={actionLinkCls} onClick={addAction}>
            {addActionText}
          </button>
          <button className={actionLinkCls} onClick={removeAllAction}>
            {removeAllActionText}
          </button>
        </div>
      )}
      {counterText && <div className={classes.counterText}>{counterText}</div>}
    </div>
  );
};

export { VoterGroupActionPanelContainer, VoterGroupActionPanel };
