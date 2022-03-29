import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import Button, { ButtonContainer } from 'components/button';
import { PageSection, PageSubSection } from 'components/page';
import { EditListCandidate, ElectionList } from 'interfaces';

import CleanVoteList from './CleanVoteList';
import EditedVoteList from './EditedVoteList';

const useStyles = createUseStyles((theme: any) => ({
  ingress: {
    ...theme.ingress,
    maxWidth: '63rem',
  },
  chosenCandidateText: {
    marginTop: '2rem',
    fontStyle: 'italic',
  },
  chosenCandidateContainer: {
    marginTop: '1.5rem',
    marginBottom: '3rem',
    border: '1px solid #CCC',
    padding: '1rem 1.5rem',
  },
  blankVoteTextContainer: {
    marginTop: '2rem',
    marginBottom: '3rem',
    fontSize: '1.8rem',
  },
}));

interface ListReviewProps {
  voteType: 'blank' | 'clean' | 'edited';
  selectedList?: ElectionList;
  editedCandidates?: EditListCandidate[];
  onGoBackToBallot: () => void;
  onSubmitVote: () => void;
  otherListCandidates?: EditListCandidate[];
  isSubmittingVote: boolean;
}

export default function ListVoteReview(props: ListReviewProps) {
  const {
    isSubmittingVote,
    editedCandidates,
    onGoBackToBallot,
    onSubmitVote,
    otherListCandidates,
    selectedList,
    voteType,
  } = props;

  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <PageSection noBorder>
      <div className={classes.ingress}>
        {t('voter.reviewBallotIngressText')}
      </div>
      <PageSubSection header={t('election.ballot')}>
        {selectedList && (
          <div>
            {t('voter.listVote.selectedList', {
              name: selectedList.name[i18n.language],
            })}
          </div>
        )}
        {voteType === 'blank' && (
          <div className={classes.blankVoteTextContainer}>
            {t('election.blankVote')}
          </div>
        )}
        {voteType === 'clean' && selectedList && (
          <CleanVoteList selectedList={selectedList} />
        )}

        {voteType === 'edited' && editedCandidates && otherListCandidates && (
          <EditedVoteList
            editedCandidates={editedCandidates}
            otherListCandidates={otherListCandidates}
          />
        )}

        <ButtonContainer alignLeft>
          <Button
            secondary
            text={t('general.back')}
            action={onGoBackToBallot}
            disabled={isSubmittingVote}
          />
          <Button
            text={t('voter.submitVote')}
            action={onSubmitVote}
            disabled={isSubmittingVote}
            showSpinner={isSubmittingVote}
          />
        </ButtonContainer>
      </PageSubSection>
    </PageSection>
  );
}
