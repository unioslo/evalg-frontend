import classNames from 'classnames';
import { DraggableProvided } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-jss';

import { CumulateButton, RankButtons, RemoveButton } from 'components/button';
import { DnDIcon } from 'components/icons';
import { Candidate, ElectionList } from 'interfaces';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

import { useListItemStyles } from './styles';
import CumulateStatus from './CumulateStatus';
import { ToggleSelectIcon } from '../../components/CandidateList';

interface ListCandidateEditItemProps {
  candidate: Candidate;
  cumulated?: boolean;
  cumulateCandidate?: () => void;
  deleted?: boolean;
  electionList?: ElectionList;
  isOtherCandidate?: boolean;
  isSelected: boolean;
  lastCandidate?: boolean;
  onOtherCandidateDelete?: () => void;
  priority?: number;
  provided?: DraggableProvided;
  reAddCandidate?: () => void;
  removeCandidate?: () => void;
  removeCumulation?: () => void;
  reorderCandidate?: (oldIndex: number, newIndex: number) => void;
  setSelectedCandidate: () => void;
}

export default function ListCandidateEditItem(
  props: ListCandidateEditItemProps
) {
  const {
    candidate,
    cumulated = false,
    cumulateCandidate,
    deleted,
    electionList,
    isOtherCandidate = false,
    isSelected,
    lastCandidate = false,
    onOtherCandidateDelete,
    priority,
    provided,
    reAddCandidate,
    removeCandidate,
    reorderCandidate,
    removeCumulation,
    setSelectedCandidate,
  } = props;

  const theme = useTheme();
  const classes = useListItemStyles({ theme });
  const { i18n, t } = useTranslation();

  /**
   * Adds the required props to the <li> if the item is draggable.
   */
  let listItemInputProps = {};
  if (provided) {
    listItemInputProps = {
      ...provided.draggableProps,
      ...provided.dragHandleProps,
      ref: provided.innerRef,
    };
  }

  const listItemCls = classNames({
    [classes.listItem]: true,
    [classes.listItemDeleted]: deleted,
  });

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => (
        <li {...listItemInputProps} key={candidate.id} className={listItemCls}>
          <div className={classes.mainContainer}>
            {reorderCandidate && (
              <div className={classes.listDnDIcon}>
                <DnDIcon
                  large
                  title={t('voter.dnd', { name: candidate.name })}
                />
              </div>
            )}
            <div className={classes.priority}>
              {!deleted && priority !== undefined && priority + 1}
            </div>
            <div className={classes.candidateNameContainer}>
              {candidate.preCumulated && !isOtherCandidate ? (
                <div className={classes.preCumulatedCandidate}>
                  {candidate.name}
                </div>
              ) : (
                <div className={classes.candidate}>{candidate.name}</div>
              )}
              {candidate.meta.fieldOfStudy && (
                <div className={classes.candidateExtraInfo}>
                  {candidate.meta.fieldOfStudy}
                </div>
              )}
              {electionList && (
                <div className={classes.candidateExtraInfo}>
                  {electionList.name[i18n.language]}
                </div>
              )}
            </div>
          </div>

          {screenSize === 'mobile' || screenSize === 'sm' ? (
            <div className={classes.mobilContainer}>
              <CumulateStatus
                cumulated={cumulated}
                preCumulated={candidate.preCumulated}
              />
              <ToggleSelectIcon
                flexRight
                large
                selected={isSelected}
                action={setSelectedCandidate}
              />
            </div>
          ) : (
            <>
              {reorderCandidate && priority !== undefined && (
                <div className={classes.rankCandidate}>
                  <RankButtons
                    onRankDown={() => {
                      reorderCandidate(priority, priority + 1);
                    }}
                    onRankUp={() => reorderCandidate(priority, priority - 1)}
                    titleDown={t('voter.listVote.moveCandidate', {
                      name: candidate.name,
                      priority: priority + 2,
                    })}
                    titleUp={t('voter.listVote.moveCandidate', {
                      name: candidate.name,
                      priority: priority,
                    })}
                    first={priority === 0}
                    last={lastCandidate}
                  />
                </div>
              )}
              <div className={classes.cumulateCandidate}>
                {removeCumulation && cumulateCandidate && (
                  <CumulateButton
                    onClick={cumulated ? removeCumulation : cumulateCandidate}
                    title={t(
                      cumulated
                        ? 'listElec.ballot.removeCumulation'
                        : 'prefElec.ballot.cumulateCandidate',
                      {
                        candidate: candidate.name,
                      }
                    )}
                    marked={cumulated}
                    large
                    disabled={deleted}
                    preCumulated={candidate.preCumulated}
                  />
                )}
              </div>

              {reAddCandidate && removeCandidate && (
                <div className={classes.deleteCandidate}>
                  <RemoveButton
                    onClick={deleted ? reAddCandidate : removeCandidate}
                    title={t(
                      deleted
                        ? 'listElec.ballot.reAddCandidate'
                        : 'prefElec.ballot.removeCandidate',
                      {
                        candidate: candidate.name,
                      }
                    )}
                    large
                    buttonText={t('listElec.ballot.remove')}
                    marked={deleted}
                  />
                </div>
              )}

              {onOtherCandidateDelete && (
                <div className={classes.deleteCandidate}>
                  <RemoveButton
                    onClick={onOtherCandidateDelete}
                    title={t('voter.listVote.deleteOtherCandidate', {
                      candidate: candidate.name,
                    })}
                    large
                    buttonText={t('listElec.ballot.removeOtherCandidate')}
                    marked={deleted}
                  />
                </div>
              )}
            </>
          )}
        </li>
      )}
    </ScreenSizeConsumer>
  );
}
