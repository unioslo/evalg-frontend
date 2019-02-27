import * as React from 'react';
import { Trans } from 'react-i18next';
import { translate } from 'react-i18next';
import { TranslateHocProps } from 'react-i18next/src/translate';
import injectSheet from 'react-jss';
import { Button, ButtonContainer } from 'components/button';
import { PageSection, PageSubSection, PageParagraph } from 'components/page';
import DropdownArrowIcon from 'components/icons/DropdownArrowIcon';

const styles = (theme: any) => ({
  candidateName: {
    fontSize: '1.6rem',
  },
  listName: {
    fontSize: '1.4rem',
    paddingTop: '0.5rem',
  },
  infoContainer: {
    paddingLeft: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  crossedInfoContainer: {
    paddingLeft: '3.3rem',
    display: 'flex',
    flexDirection: 'column',
    color: theme.lightDarkWhite,
    fontStyle: 'italic',
  },
  listItem: {
    alignItems: 'center',
    borderBottom: '1px solid #CCC',
    display: 'flex',
    padding: '0.75rem 0',
  },
  rank: {
    fontSize: '2.4rem',
  },
});

interface IBallotProps extends TranslateHocProps {
  candidates: Candidate[];
  classes: any;
}

interface ICrossedBallotProps extends TranslateHocProps {
  unselectedCandidates: Candidate[];
  classes: any;
}

const BlankBallot = () => (
  <div>
    <Trans>election.blankVote</Trans>
  </div>
);

const Ballot = ({ classes, candidates, i18n }: IBallotProps) => {
  const lang = i18n && i18n.language ? i18n.language : 'nb';
  return (
    <ul>
      {candidates.map((c, index) => {
        const rankNr = index + 1;
        return (
          <li key={index} className={classes.listItem}>
            <div className={classes.rank}>{rankNr}</div>
            <div className={classes.infoContainer}>
              <div className={classes.candidateName}>{c.name}</div>
              <div className={classes.listName}>{c.list.name[lang]}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

// TODO: Should the crossed ballot be shuffled?
const CrossedBallot = ({
  classes,
  unselectedCandidates,
  i18n,
}: ICrossedBallotProps) => {
  const lang = i18n && i18n.language ? i18n.language : 'nb';
  return (
    <ul>
      {unselectedCandidates.map((c, index) => {
        return (
          <li key={index} className={classes.listItem}>
            <div className={classes.crossedInfoContainer}>
              <div className={classes.candidateName}>{c.name}</div>
              <div className={classes.listName}>{c.list.name[lang]}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

interface IReviewProps extends TranslateHocProps {
  candidates: Candidate[];
  unselectedCandidates: Candidate[];
  isBlankVote: boolean;
  onGoBackToBallot: () => void;
  onSubmitBallot: () => void;
  classes: any;
}

interface IReviewState {
  showUnselectedCandidates: boolean;
}

class PrefElecReview extends React.Component<IReviewProps, IReviewState> {
  constructor(props: IReviewProps) {
    super(props);
    this.state = { showUnselectedCandidates: false };
    this.toggleShowUnselectedCandidates = this.toggleShowUnselectedCandidates.bind(
      this
    );
  }
  public render() {
    const { isBlankVote, onGoBackToBallot, onSubmitBallot } = this.props;
    return (
      <PageSection>
        <Trans>voter.reviewBallot</Trans>
        <PageSubSection header={<Trans>election.ballot</Trans>}>
          {isBlankVote ? (
            BlankBallot()
          ) : (
            <>
              <PageParagraph>
                <Ballot {...this.props} />
              </PageParagraph>
              <PageParagraph
                header={
                  <>
                    <DropdownArrowIcon
                      selected={this.state.showUnselectedCandidates}
                      action={this.toggleShowUnselectedCandidates}
                    />
                    <Trans>voter.crossedCandidates</Trans>
                  </>
                }
              >
                {this.state.showUnselectedCandidates
                  ? CrossedBallot(this.props)
                  : null}
              </PageParagraph>
            </>
          )}

          <ButtonContainer alignLeft={true}>
            <Button
              action={onGoBackToBallot}
              text={<Trans>general.back</Trans>}
              secondary={true}
            />
            <Button
              action={onSubmitBallot}
              text={<Trans>election.deliverVote</Trans>}
            />
          </ButtonContainer>
        </PageSubSection>
      </PageSection>
    );
  }
  private toggleShowUnselectedCandidates(this: any) {
    this.setState({
      showUnselectedCandidates: !this.state.showUnselectedCandidates,
    });
  }
}

export default injectSheet(styles)(translate()(PrefElecReview));
