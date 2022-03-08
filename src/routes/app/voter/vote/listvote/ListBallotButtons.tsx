/**
 * @file List election vote buttons.
 *
 * List elections does not use the same buttons/flow as the other elections.
 */

import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import Button from 'components/button';
import ActionItem from 'components/actionitem';
import Icon from 'components/icon';

const useStyles = createUseStyles((theme: any) => ({
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.mdQuery]: {
      alignItems: 'baseline',
      marginTop: '0rem',
      flexDirection: 'row',
    },
  },
  buttonItem: {
    marginRight: '0rem',
    marginLeft: '0rem',
    marginTop: '2rem',
    [theme.breakpoints.mdQuery]: {
      marginRight: '1rem',
      marginLeft: '2rem',
    },
  },
}));

interface ListBallotButtonsProps {
  onEditList: () => void;
  onReviewBallot: () => void;
}

/**
 * Component of buttons used to edit or deliver a list ballot without changes.
 *
 * @param {() => void} onEditList Callback action on pressing the "edit list" button
 * @param {() => void} onReviewBallot Callback action on pressing the "Review ballot" button
 */
export default function ListBallotButtons({
  onEditList,
  onReviewBallot,
}: ListBallotButtonsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.buttonContainer}>
      <div className={classes.buttonItem}>
        <ActionItem action={onEditList}>
          <>
            {/*<Icon type="edit" /> */}
            {t('voter.listVote.editList')}
          </>
        </ActionItem>
      </div>
      <div className={classes.buttonItem}>
        <Button text={t('voter.listVote.noEdit')} action={onReviewBallot} />
      </div>
    </div>
  );
}
