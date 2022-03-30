import { ElectionList } from 'interfaces';
import { createUseStyles, useTheme } from 'react-jss';

import { ListCandidateItem } from '../listCandidateItem';
const useStyles = createUseStyles((theme: any) => ({
  list: {
    marginTop: '1.5rem',
    marginRight: '2rem',
    [theme.breakpoints.notMobileQuery]: {
      marginTop: '3rem',
    },
  },
}));

interface CleanVoteListProps {
  selectedList: ElectionList;
}

export default function CleanVoteList(props: CleanVoteListProps) {
  const { selectedList } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  /**
   * Sort the candidates by there given priority
   */
  const listCandidatesSorted = [...selectedList.candidates].sort(
    (a, b) => a.priority - b.priority
  );

  return (
    <ul className={classes.list}>
      {listCandidatesSorted.map((candidate, index) => (
        <ListCandidateItem
          key={candidate.id}
          candidate={candidate}
          priority={index}
        />
      ))}
    </ul>
  );
}
