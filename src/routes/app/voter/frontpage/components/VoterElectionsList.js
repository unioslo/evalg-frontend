import * as React from 'react';
import { Trans, translate } from 'react-i18next';
import injectSheet from 'react-jss';

import Button, { ButtonContainer } from 'components/button';
import { Date, Time } from 'components/i18n';
import Link from 'components/link';

const styles = theme => ({
  list: {
    width: '100%',
    listStyleType: 'none',
    fontSize: '1.7rem',
    borderTop: `3px solid ${theme.colors.lightBlueGray}`,
    lineHeight: 1.6,
    marginTop: '2rem',
  },
  listItem: {
    borderBottom: `3px solid ${theme.colors.lightBlueGray}`,
    paddingTop: '1.5rem',
    paddingBottom: '3rem',
  }
});

// type ListItemProps = {
//   electionGroup: ElectionGroup,
//   lang: string,
//   classes: Object
// }

const VoterElectionsListItem = (props) => {
  const { electionGroup, lang } = props;
  const election = electionGroup.elections[0];
  const canVote = true;
  // We need data from the non-existing ballot-module to discern this
  // properly
  const hasVoted = false;

  return (
    <li className={props.classes.listItem}>
      <h3><b>{electionGroup.name[lang]}</b></h3>
      <div>
        <div>
          <Trans>election.opens</Trans>:&nbsp;
          <Date dateTime={election.start} longDate />&nbsp;
          <Time dateTime={election.start} />
        </div>
        <div>
          <Trans>election.closes</Trans>:&nbsp;
          <Date dateTime={election.end} longDate />&nbsp;
          <Time dateTime={election.end} />
        </div>
        <div>
          <Trans>election.rightToVote</Trans>:&nbsp;
          {canVote ? <Trans>general.yes</Trans> :
            <Trans>general.no</Trans>
          }
        </div>
      </div>
      <ButtonContainer alignLeft>
        <Link to={`/voter/election-groups/${electionGroup.id}/select-voting-group`}>
          {!hasVoted ?
            <Button
              text={<Trans>election.voteNow</Trans>}
            /> :
            <Button
              secondary={true}
              text={<Trans>election.changeVote</Trans>}
            />
          }
        </Link>
      </ButtonContainer>
    </li>
  )
};

// type ListProps = {
//   electionGroups: Array<ElectionGroup>,
//   noElectionsText: ReactElement,
//   i18n: object,
//   classes: Object
// }

const VoterElectionsList = (props) => {
  const { electionGroups, elections, noElectionsText, classes } = props;
  const lang = props.i18n.language;
  if (electionGroups.length === 0) {
    return (
      <p>{noElectionsText}</p>
    )
  }
  return (
    <ul className={classes.list}>
      {electionGroups.map((group, index) =>
        <VoterElectionsListItem
          classes={classes}
          electionGroup={group}
          lang={props.i18n.language}
          key={index}
        />
      )}
    </ul>
  )
};

export default injectSheet(styles)(translate()(VoterElectionsList));