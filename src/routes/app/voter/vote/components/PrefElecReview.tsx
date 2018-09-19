import * as React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import { PageSection, PageSubSection } from 'components/page';

const styles = (theme: any) => ({
  candidateList: {

  },
  listItem: {
    alignItems: 'center',
    display: 'flex',
  },
  rank: {
    fontSize: '2.2rem'
  }
});

interface IReviewProps {
  backAction: () => void
  submitAction: () => void
  candidates: Candidate[]
  classes: any
}

const PrefElecReview: React.SFC<IReviewProps> = (props) => {
  const { classes } = props;
  return (
    <PageSection>
      <Trans>voter.reviewBallot</Trans>
      <PageSubSection header={<Trans>election.ballot</Trans>}>
        <ul>
          {props.candidates.map((c, index) => {
            const rankNr = index + 1;

            return (
              <li key={index} className={classes.listItem}>
                <div className={classes.rank}>
                  {rankNr}
                </div>
                <div>
                  {c.name}
                </div>
              </li>
            )
          })}
        </ul>
      </PageSubSection>
    </PageSection>
  )
}

export default injectSheet(styles)(PrefElecReview);