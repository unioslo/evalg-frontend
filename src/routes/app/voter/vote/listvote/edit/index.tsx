import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { PageSection } from 'components/page';
import { EditListCandidate, Election, ElectionList } from 'interfaces';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import { reorderArray } from 'utils';

import EditButtons from './EditButtons';
import EditButtonBar from './EditButtonBar';
import { ListCandidateEditItem } from '../listCandidateItem';
import OtherCandidates from './OtherCandidate';
import HelpSubSection from '../../components/HelpSubSection';

const useStyles = createUseStyles((theme: any) => ({
  list: {
    marginTop: '1.5rem',
    marginRight: '2rem',
    [theme.breakpoints.notMobileQuery]: {
      marginTop: '3rem',
    },
  },
}));

interface EditVoteProps {
  election: Election;
  editedCandidates: EditListCandidate[];
  onGoBackToBallot: () => void;
  onReviewBallot: () => void;
  otherListCandidates: EditListCandidate[];
  selectedList: ElectionList;
  setEditedCandidates: (newList: EditListCandidate[]) => void;
  setOtherListCandidates: (newList: EditListCandidate[]) => void;
}

export default function EditVote(props: EditVoteProps) {
  const {
    editedCandidates,
    election,
    onGoBackToBallot,
    onReviewBallot,
    otherListCandidates,
    selectedList,
    setEditedCandidates,
    setOtherListCandidates,
  } = props;
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  const ballotRules = election.meta.ballotRules;

  /**
   * State for the selected candidate on mobile
   */
  const [selectedCandidateIndex, setSelectedCandidateIndex] =
    useState<number>(-1);

  const removeCandidate = (candidate: EditListCandidate) => {
    setEditedCandidates(
      editedCandidates.map((listCandidate) => {
        if (listCandidate === candidate) {
          listCandidate.userDeleted = true;
        }
        return listCandidate;
      })
    );
  };

  const reAddCandidate = (candidate: EditListCandidate) => {
    setEditedCandidates(
      editedCandidates.map((listCandidate) => {
        if (listCandidate === candidate) {
          listCandidate.userDeleted = false;
        }
        return listCandidate;
      })
    );
  };

  const toggleDeletedStatusAtIndex = (candidateIndex: number) => {
    setEditedCandidates(
      editedCandidates.map((listCandidate, index) => {
        if (candidateIndex === index) {
          listCandidate.userDeleted = !listCandidate.userDeleted;
        }
        return listCandidate;
      })
    );
  };

  const cumulateCandidate = (candidate: EditListCandidate) => {
    setEditedCandidates(
      editedCandidates.map((listCandidate) => {
        if (listCandidate === candidate) {
          listCandidate.userCumulated = true;
        }
        return listCandidate;
      })
    );
  };

  const removeCumulation = (candidate: EditListCandidate) => {
    setEditedCandidates(
      editedCandidates.map((listCandidate) => {
        if (listCandidate === candidate) {
          listCandidate.userCumulated = false;
        }
        return listCandidate;
      })
    );
  };

  const toggleCumulateStatusAtIndex = (candidateIndex: number) => {
    setEditedCandidates(
      editedCandidates.map((listCandidate, index) => {
        if (candidateIndex === index) {
          listCandidate.userCumulated = !listCandidate.userDeleted;
        }
        return listCandidate;
      })
    );
  };

  const reorderCandidate = (oldIndex: number, newIndex: number) => {
    if (newIndex >= 0 && newIndex <= editedCandidates.length) {
      setEditedCandidates(reorderArray(editedCandidates, oldIndex, newIndex));
    }
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    setEditedCandidates(
      reorderArray(
        editedCandidates,
        result.source.index,
        result.destination.index
      )
    );
  };

  let helpTextTags: string[] = [];
  if (ballotRules.cumulate) {
    helpTextTags.push(t('voter.listVote.editListHelp.cumulate'));
  }
  if (ballotRules.alterPriority) {
    helpTextTags.push(t('voter.listVote.editListHelp.changeOrder'));
  }
  if (ballotRules.deleteCandidate) {
    helpTextTags.push(t('voter.listVote.editListHelp.remove'));
  }
  if (ballotRules.otherListCandidateVotes) {
    helpTextTags.push(t('voter.listVote.editListHelp.others'));
  }

  /**
   * TODO: add helpTextTags
   */
  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => (
        <PageSection noBorder header={selectedList.name[i18n.language]}>
          <HelpSubSection
            header={t('voter.listVote.changeList')}
            helpTextTags={helpTextTags}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <ul
                    className={classes.list}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {editedCandidates.map((candidate, index) => {
                      const { id } = candidate.candidate;
                      return (
                        <Draggable
                          key={id}
                          draggableId={id}
                          index={index}
                          isDragDisabled={
                            !(ballotRules.deleteCandidate ?? true)
                          }
                        >
                          {(draggableProvided) => (
                            <ListCandidateEditItem
                              key={candidate.candidate.id}
                              candidate={candidate.candidate}
                              isSelected={index === selectedCandidateIndex}
                              priority={index}
                              provided={draggableProvided}
                              setSelectedCandidate={() => {
                                if (selectedCandidateIndex === index) {
                                  setSelectedCandidateIndex(-1);
                                } else {
                                  setSelectedCandidateIndex(index);
                                }
                              }}
                              {...(ballotRules.cumulate && {
                                cumulated: candidate.userCumulated,
                                cumulateCandidate: () =>
                                  cumulateCandidate(candidate),
                                removeCumulation: () =>
                                  removeCumulation(candidate),
                              })}
                              {...(ballotRules.deleteCandidate && {
                                deleted: candidate.userDeleted,
                                reAddCandidate: () => reAddCandidate(candidate),
                                removeCandidate: () =>
                                  removeCandidate(candidate),
                              })}
                              {...(ballotRules.alterPriority && {
                                lastCandidate:
                                  index === editedCandidates.length - 1,
                                reorderCandidate: reorderCandidate,
                              })}
                            />
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </HelpSubSection>
          {ballotRules.otherListCandidateVotes && (
            <OtherCandidates
              electionLists={election.lists}
              maxOtherCandidates={election.meta.candidateRules.seats}
              otherListCandidates={otherListCandidates}
              selectedList={selectedList}
              setOtherListCandidates={setOtherListCandidates}
            />
          )}
          {(screenSize === 'mobile' || screenSize === 'sm') &&
          selectedCandidateIndex !== -1 ? (
            <EditButtonBar
              {...(ballotRules.alterPriority && {
                upAction: () =>
                  reorderCandidate(
                    selectedCandidateIndex,
                    selectedCandidateIndex - 1
                  ),
                downAction: () =>
                  reorderCandidate(
                    selectedCandidateIndex,
                    selectedCandidateIndex + 1
                  ),
              })}
              {...(ballotRules.cumulate && {
                cumulateAction: () =>
                  toggleCumulateStatusAtIndex(selectedCandidateIndex),
                cumulateText: t('voter.listVote.cumulate'),
              })}
              {...(ballotRules.deleteCandidate && {
                removeAction: () =>
                  toggleDeletedStatusAtIndex(selectedCandidateIndex),
                removeText: t('general.remove'),
              })}
              upDisabled={selectedCandidateIndex === 0}
              downDisabled={
                selectedCandidateIndex === editedCandidates.length - 1
              }
            />
          ) : null}
          <EditButtons
            onGoBackToSelectList={onGoBackToBallot}
            onReviewBallot={onReviewBallot}
            reviewBallotEnabled={true}
          />
        </PageSection>
      )}
    </ScreenSizeConsumer>
  );
}
