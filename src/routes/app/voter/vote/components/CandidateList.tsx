import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import classNames from 'classnames';

import Icon from 'components/icon';
import Link from 'components/link';
import { joinStringsWithCommaAndAnd } from 'utils';
import { Candidate } from 'interfaces';

const styles = (theme: any) => ({
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
    gridTemplateColumns: '2rem 5rem 2rem 5rem 14rem 5rem 7.5rem 3.5rem',
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
});

interface IListProps {
  classes: any;
}

const CandidateList: React.SFC<IListProps> = props => (
  <ul className={props.classes.candidateList}>{props.children}</ul>
);

const HOCCandidateList = injectSheet(styles)(CandidateList);

interface IListItemProps {
  classes: any;
}

const CandidateListItem: React.SFC<IListItemProps> = props => (
  <li className={props.classes.listItem}>{props.children}</li>
);

const HOCCandidateListItem = injectSheet(styles)(CandidateListItem);

interface IInfoProps extends WithTranslation {
  candidate: Candidate | null;
  classes: any;
  infoUrl?: boolean;
  listName?: boolean;
  metaFields?: string[];
  noLeftPadding?: boolean;
}

const CandidateInfo: React.SFC<IInfoProps> = props => {
  const lang = props.i18n ? props.i18n.language : 'nb';
  const { classes } = props;
  const candidate: any = props.candidate;
  const { coCandidates } = candidate.meta;
  const candidateInfoCls = classNames({
    [classes.candidateInfo]: true,
    [classes.candidateInfoNoLeftPadding]: props.noLeftPadding,
  });

  return (
    <div className={candidateInfoCls}>
      <div className={classes.candidateInfoName}>{candidate.name}</div>
      {coCandidates && coCandidates.length > 0 && (
        <div className={classes.candidateInfoSubText}>
          <Trans>election.coCandidates</Trans>:{' '}
          {joinStringsWithCommaAndAnd(
            coCandidates.map((coCandidate: any) => coCandidate.name),
            props.t
          )}
        </div>
      )}
      {props.infoUrl ? (
        <div className={classes.candidateInfoSubText}>
          <Link to={candidate.informationUrl} external>
            <Trans>candidate.infoLinkText</Trans>
          </Link>
        </div>
      ) : null}
      {props.listName ? (
        <div className={classes.candidateInfoSubText}>
          {candidate.list.name[lang]}
        </div>
      ) : null}
      {props.metaFields &&
        props.metaFields.map(fieldName => (
          <div className={classes.candidateInfoSubText}>
            {candidate.meta[fieldName]}
          </div>
        ))}
    </div>
  );
};

const HOCCandidateInfo = injectSheet(styles)(withTranslation()(CandidateInfo));

interface IRankProps {
  classes: any;
  rankNr: number;
  small?: boolean;
}

const RankIcon: React.SFC<IRankProps> = props => (
  <svg width="42px" height="42px" viewBox="0 0 50 50">
    <g stroke="none" strokeWidth="1" fill="none">
      <circle className={props.classes.rankIcon} cx="25" cy="25" r="25" />
      <text
        x="50%"
        y="33px"
        fontSize="24"
        fontWeight="bold"
        fill="#FFF"
        textAnchor="middle"
      >
        {props.rankNr}
      </text>
    </g>
  </svg>
);

const HOCRankIcon = injectSheet(styles)(RankIcon);

interface ISelectProps {
  classes: any;
  selected: boolean;
  flexRight: boolean;
  action: () => void;
}

const ToggleSelectIcon: React.SFC<ISelectProps> = props => {
  const { classes } = props;
  const cls = classNames({
    [classes.toggleSelectionIconFlexRight]: props.flexRight,
  });
  return (
    <div className={cls} onClick={props.action}>
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

const HOCToggleSelectIcon = injectSheet(styles)(ToggleSelectIcon);

interface IDesktopButtonsProps {
  classes: any;
}

const ListItemDesktopButtons: React.SFC<IDesktopButtonsProps> = props => (
  <div className={props.classes.desktopButtonsContainer}>
    <div className={props.classes.desktopButtons}>{props.children}</div>
  </div>
);

const HOCListItemDesktopButtons = injectSheet(styles)(ListItemDesktopButtons);

interface IButtonProps {
  classes: any;
  onClick: () => void;
}

const UpArrow: React.SFC<IButtonProps> = props => (
  <div className={props.classes.buttonUpArrow}>
    <Icon type="upArrow" custom="teal" onClick={props.onClick} />
  </div>
);

const HOCUpArrow = injectSheet(styles)(UpArrow);

const DownArrow: React.SFC<IButtonProps> = props => (
  <div className={props.classes.buttonDownArrow}>
    <Icon type="downArrow" custom="teal" onClick={props.onClick} />
  </div>
);

const HOCDownArrow = injectSheet(styles)(DownArrow);

const CumulateButton: React.SFC<IButtonProps> = props => (
  <div className={props.classes.buttonCumulate} onClick={props.onClick}>
    <Icon type="star" custom={{ color: 'teal', small: true }} />
    <Trans>voter.cumulate</Trans>
  </div>
);

const HOCCumulateButton = injectSheet(styles)(CumulateButton);

const RemoveButton: React.SFC<IButtonProps> = props => (
  <button
    className={classNames({
      [props.classes.buttonRemove]: true,
      'button-no-style': true,
    })}
    onClick={props.onClick}
  >
    <Icon type="remove" custom={{ color: 'teal', small: true }} />
    <div className={props.classes.spacing} />
    <Trans>general.remove</Trans>
  </button>
);

const HOCRemoveButton = injectSheet(styles)(RemoveButton);

export {
  HOCCandidateInfo as CandidateInfo,
  HOCCandidateList as CandidateList,
  HOCCandidateListItem as CandidateListItem,
  HOCCumulateButton as CumulateButton,
  HOCDownArrow as DownArrow,
  HOCListItemDesktopButtons as ListItemDesktopButtons,
  HOCToggleSelectIcon as ToggleSelectIcon,
  HOCRankIcon as RankIcon,
  HOCRemoveButton as RemoveButton,
  HOCUpArrow as UpArrow,
};
