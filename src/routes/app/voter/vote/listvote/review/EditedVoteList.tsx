import { createUseStyles, useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';

import {
  PageExpandableSubSection,
  PageSubSection,
} from 'components/page/PageSection';
import { EditListCandidate } from 'interfaces';
import { ListCandidateReviewItem } from '../listCandidateItem';

const useStyles = createUseStyles((theme: any) => ({
  list: {
    marginTop: '1.5rem',
    marginRight: '2rem',
    [theme.breakpoints.notMobileQuery]: {
      marginTop: '3rem',
    },
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '3rem',
  },
}));

interface EditedVoteListProps {
  editedCandidates: EditListCandidate[];
  otherListCandidates: EditListCandidate[];
}

export default function EditedVoteList(props: EditedVoteListProps) {
  const { editedCandidates, otherListCandidates } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });
  const { t } = useTranslation();

  const deletedCandidates = editedCandidates.filter(
    (candidate) => candidate.userDeleted
  );
  const selectedCandidates = editedCandidates.filter(
    (candidate) => !candidate.userDeleted
  );

  return (
    <div>
      <ul className={classes.list}>
        {selectedCandidates.map((candidate, index) => (
          <ListCandidateReviewItem
            candidate={candidate.candidate}
            cumulated={candidate.userCumulated}
            displayCumulateStatus={true}
            key={candidate.candidate.id}
            priority={index}
          />
        ))}
      </ul>

      {otherListCandidates.length > 0 && (
        <PageSubSection header={t('voter.listVote.otherListCandidates')}>
          <ul className={classes.list}>
            {otherListCandidates.map((candidate) => (
              <ListCandidateReviewItem
                candidate={candidate.candidate}
                cumulated={false}
                displayCumulateStatus={false}
                electionList={candidate.sourceList}
                key={candidate.candidate.id}
              />
            ))}
          </ul>
        </PageSubSection>
      )}

      {deletedCandidates.length > 0 && (
        <PageExpandableSubSection
          header={t('voter.listVote.deletedCandidateHeader')}
        >
          <div className={classes.listContainer}>
            <ul className={classes.list}>
              {deletedCandidates.map((candidate) => (
                <ListCandidateReviewItem
                  key={candidate.candidate.id}
                  cumulated={false}
                  candidate={candidate.candidate}
                  deleted
                />
              ))}
            </ul>
          </div>
        </PageExpandableSubSection>
      )}
    </div>
  );
}
