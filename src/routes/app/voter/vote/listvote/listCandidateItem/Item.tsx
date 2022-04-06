import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-jss';

import { Candidate } from 'interfaces';
import { ScreenSizeConsumer } from 'providers/ScreenSize';
import { useListItemStyles } from './styles';

interface ListCandidateItemProps {
  candidate: Candidate;
  priority: number;
}

export default function ListCandidateItem(props: ListCandidateItemProps) {
  const { candidate, priority } = props;

  const theme = useTheme();
  const classes = useListItemStyles({ theme });
  const { t } = useTranslation();

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => (
        <li key={candidate.id} className={classes.listItem}>
          <div className={classes.mainContainer}>
            <div className={classes.priority}>{priority + 1}</div>
            <div className={classes.candidateNameContainer}>
              {candidate.preCumulated ? (
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
            </div>
          </div>
          {candidate.preCumulated &&
            screenSize !== 'mobile' &&
            screenSize !== 'sm' && (
              <div className={classes.preCumulatedInfoText}>
                {t('listElec.ballot.preCumulated')}
              </div>
            )}
        </li>
      )}
    </ScreenSizeConsumer>
  );
}
