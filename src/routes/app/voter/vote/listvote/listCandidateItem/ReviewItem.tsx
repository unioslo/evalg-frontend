import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-jss';

import { Candidate, ElectionList } from 'interfaces';
import CumulateStatus from './CumulateStatus';
import { useListItemStyles } from './styles';

interface ListCandidateReviewItemProps {
  candidate: Candidate;
  cumulated: boolean;
  deleted?: boolean;
  displayCumulateStatus?: boolean;
  electionList?: ElectionList;
  priority?: number;
  selectedCandidate?: Candidate;
}

export default function ListCandidateReviewItem(
  props: ListCandidateReviewItemProps
) {
  const {
    candidate,
    cumulated,
    deleted,
    displayCumulateStatus = false,
    electionList,
    priority,
  } = props;

  const theme = useTheme();
  const classes = useListItemStyles({ theme });
  const { i18n } = useTranslation();

  const listItemCls = classNames({
    [classes.listItem]: true,
    [classes.listItemReviewDeleted]: deleted,
  });

  return (
    <li key={candidate.id} className={listItemCls}>
      <div className={classes.mainContainer}>
        <div className={classes.priority}>
          {!deleted && priority !== undefined && priority + 1}
        </div>
        <div className={classes.candidateNameContainer}>
          {displayCumulateStatus && candidate.preCumulated ? (
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

      {displayCumulateStatus && (
        <div className={classes.cumulateCandidate}>
          <CumulateStatus
            cumulated={cumulated}
            preCumulated={candidate.preCumulated}
          />
        </div>
      )}
    </li>
  );
}
