import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';
import classNames from 'classnames';

import Icon from 'components/icon';
import Link from 'components/link';
import { joinStringsWithCommaAndAnd } from 'utils';
import { Candidate } from 'interfaces';

const useStyles = createUseStyles((theme: any) => ({
  button: {
    alignSelf: 'center',
    cursor: 'pointer',
    justifySelf: 'center',
  },
  buttonCumulate: {
    composes: '$button $buttonText',
    gridArea: 'cumulate',
  },
  buttonDownArrow: {
    composes: '$button',
    gridArea: 'downArrow',
  },
  buttonRemove: {
    composes: '$button $buttonText',
    gridArea: 'remove',
  },
  spacing: {
    marginLeft: '0.2rem',
  },
  buttonText: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  buttonUpArrow: {
    composes: '$button',
    gridArea: 'upArrow',
  },
  candidateInfo: {
    fontSize: '1.8rem',
    paddingLeft: '1rem',
    [theme.breakpoints.notMobileQuery]: {
      paddingLeft: '2.2rem',
    },
  },
  candidateInfoNoLeftPadding: {
    paddingLeft: 0,
  },
  candidateInfoSubText: {
    fontSize: '1.4rem',
    paddingTop: '0.75rem',
  },
  candidateList: {
    marginTop: '1.5rem',
    [theme.breakpoints.notMobileQuery]: {
      marginTop: '3rem',
    },
  },
  desktopButtons: {
    display: 'grid',
    gridTemplateAreas: `'upArrow . downArrow . cumulate . remove .'`,
    gridTemplateColumns: '2rem 5rem 2rem 5rem 14rem 12rem 2rem 2rem',
  },
  desktopButtonsContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: '3rem',
  },
  listItem: {
    alignItems: 'center',
    borderBottom: '2px solid #CCC',
    display: 'flex',
    padding: '1.2rem 0',
    [theme.breakpoints.notMobileQuery]: {
      borderBottom: '1px solid #CCC',
      '&:first-child': {
        borderTop: '1px solid #CCC',
      },
    },
  },
  toggleSelectionIconFlexRight: {
    alignItems: 'flex-end',
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'flex-end',
  },
  rankIcon: {},
  candidateInfoName: {},
}));

const CandidateList: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <ul className={classes.candidateList}>{children}</ul>;
};

const CandidateListItem: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <li className={classes.listItem}>{children}</li>;
};

interface IInfoProps {
  candidate: Candidate;
  infoUrl?: boolean;
  listName?: boolean;
  metaFields?: string[];
  noLeftPadding?: boolean;
}

const CandidateInfo: React.FunctionComponent<IInfoProps> = (props) => {
  const { noLeftPadding, infoUrl, listName, metaFields } = props;
  const { t, i18n } = useTranslation();
  const lang = i18n ? i18n.language : 'nb';
  const theme = useTheme();
  const classes = useStyles({ theme });
  const { candidate } = props;
  const { coCandidates } = candidate.meta;
  const candidateInfoCls = classNames({
    [classes.candidateInfo]: true,
    [classes.candidateInfoNoLeftPadding]: noLeftPadding,
  });

  return (
    <div className={candidateInfoCls}>
      <div className={classes.candidateInfoName}>{candidate.name}</div>
      {coCandidates && coCandidates.length > 0 && (
        <div className={classes.candidateInfoSubText}>
          <Trans>election.coCandidates</Trans>:{' '}
          {joinStringsWithCommaAndAnd(
            coCandidates.map((coCandidate: any) => coCandidate.name),
            t
          )}
        </div>
      )}
      {infoUrl && candidate.informationUrl ? (
        <div className={classes.candidateInfoSubText}>
          <Link to={candidate.informationUrl} external>
            <Trans>candidate.infoLinkText</Trans>
          </Link>
        </div>
      ) : null}
      {listName ? (
        <div className={classes.candidateInfoSubText}>
          {candidate.list.name[lang]}
        </div>
      ) : null}
      {metaFields &&
        metaFields.map((fieldName) => (
          <div className={classes.candidateInfoSubText}>
            {candidate.meta[fieldName]}
          </div>
        ))}
    </div>
  );
};

interface IRankProps {
  rankNr: number;
  small?: boolean;
}

const RankIcon: React.FunctionComponent<IRankProps> = (props) => {
  const { rankNr } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <svg width="42px" height="42px" viewBox="0 0 50 50">
      <g stroke="none" strokeWidth="1" fill="none">
        <circle className={classes.rankIcon} cx="25" cy="25" r="25" />
        <text
          x="50%"
          y="33px"
          fontSize="24"
          fontWeight="bold"
          fill="#FFF"
          textAnchor="middle"
        >
          {rankNr}
        </text>
        <title>{'icons.close'}</title>
      </g>
    </svg>
  );
};

interface ISelectProps {
  selected: boolean;
  flexRight: boolean;
  action: () => void;
}

const ToggleSelectIcon: React.FunctionComponent<ISelectProps> = (props) => {
  const { action, flexRight } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  const cls = classNames({
    [classes.toggleSelectionIconFlexRight]: flexRight,
  });
  return (
    <div className={cls} onClick={action}>
      {props.selected ? (
        <svg width="51px" height="42px" viewBox="0 0 51 62" version="1.1">
          <g stroke="none" strokeWidth="1" fill="none">
            <rect fill="#D5EBEF" x="0" y="0" width="51" height="62" rx="8" />
            <g transform="translate(12.000000, 17.000000)">
              <circle
                stroke="#8ECED9"
                strokeWidth="3"
                cx="14"
                cy="14"
                r="12.5"
              />
              <circle fill="#2294A8" cx="14" cy="14" r="5" />
            </g>
          </g>
        </svg>
      ) : (
        <svg width="51px" height="42px" viewBox="0 0 51 62" version="1.1">
          <g stroke="none" strokeWidth="1" fill="none">
            <rect fill="#F9F4FA" x="0" y="0" width="51" height="62" rx="8" />
            <g transform="translate(12.000000, 17.000000)">
              <circle
                stroke="#8ECED9"
                strokeWidth="3"
                cx="14"
                cy="14"
                r="12.5"
              />
            </g>
          </g>
        </svg>
      )}
    </div>
  );
};

const ListItemDesktopButtons: React.FunctionComponent<{}> = (props) => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <div className={classes.desktopButtonsContainer}>
      <div className={classes.desktopButtons}>{children}</div>
    </div>
  );
};

interface IButtonProps {
  onClick: () => void;
  title?: string;
}

const UpArrow: React.FunctionComponent<IButtonProps> = (props) => {
  const { onClick, title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.buttonUpArrow}>
      <Icon type="upArrow" custom="teal" onClick={onClick} title={title} />
    </div>
  );
};

const DownArrow: React.FunctionComponent<IButtonProps> = (props) => {
  const { onClick, title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.buttonDownArrow}>
      <Icon type="downArrow" custom="teal" onClick={onClick} title={title} />
    </div>
  );
};

const CumulateButton: React.FunctionComponent<IButtonProps> = (props) => {
  const { onClick, title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.buttonCumulate} onClick={onClick}>
      <Icon type="star" custom={{ color: 'teal', small: true }} title={title} />
      <Trans>voter.cumulate</Trans>
    </div>
  );
};

const RemoveButton: React.FunctionComponent<IButtonProps> = (props) => {
  const { title, onClick } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <>
      <button
        className={classNames({
          [classes.buttonRemove]: true,
          'button-no-style': true,
        })}
        onClick={onClick}
      >
        <Icon
          type="remove"
          custom={{ color: 'teal', small: true }}
          title={title}
        />
      </button>
    </>
  );
};

export {
  CandidateInfo,
  CandidateList,
  CandidateListItem,
  CumulateButton,
  DownArrow,
  ListItemDesktopButtons,
  ToggleSelectIcon,
  RankIcon,
  RemoveButton,
  UpArrow,
};
