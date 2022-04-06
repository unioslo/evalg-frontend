/**
 * @file Styles shared by the different ListCandidateItem components.
 */

import { createUseStyles } from 'react-jss';

export const useListItemStyles = createUseStyles((theme: any) => ({
  candidate: {
    fontSize: '1.8rem',
  },
  candidateExtraInfo: {
    marginTop: '0.8rem',
  },
  candidateNameContainer: {
    display: 'flex',
    minHeight: '5rem',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  cumulateCandidate: {
    alignSelf: 'center',
    gridArea: 'cumulate',
    justifySelf: 'end',
    marginRight: '1rem',
  },
  deleteCandidate: {
    alignSelf: 'center',
    gridArea: 'delete',
    justifySelf: 'end',
    marginRight: '1rem',
  },
  listDnDIcon: {
    alignSelf: 'center',
    marginRight: '1rem',
  },
  listItem: {
    borderBottom: '2px solid #CCC',
    '&:first-child': {
      borderTop: '2px solid #CCC',
    },
    display: 'flex',
    padding: '1rem 1rem 1rem 1rem',
    justifyContent: 'space-between',
    [theme.breakpoints.mdQuery]: {
      display: 'grid',
      gridTemplateColumns:
        '[first] minmax(300px, 4fr) [rank] 1fr [cumulate] minmax(160px, 1fr) [delete] 0.5fr',
      padding: '1.2rem 1rem 1.2rem 1rem',
      minHeight: '8rem',
    },
    [theme.breakpoints.notMobileQuery]: {
      borderBottom: '1px solid #CCC',
      '&:first-child': {
        borderTop: '1px solid #CCC',
      },
    },
  },
  listItemDeleted: {
    background: '#f5f5f5',
    color: '#999999',
    fontStyle: 'italic',
    textDecoration: 'line-through',
  },
  listItemReviewDeleted: {
    background: '#f5f5f5',
    color: '#999999',
    fontStyle: 'italic',
  },
  mainContainer: {
    gridArea: 'first',
    display: 'flex',
    alignSelf: 'start',
  },
  preCumulatedCandidate: {
    gridArea: 'cumulated',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '0.8rem',
  },
  preCumulatedText: {
    marginLeft: '1rem',
    fontSize: '1.5rem',
  },
  preCumulatedInfoText: {
    gridArea: 'cumulated',
    marginLeft: '1rem',
    fontSize: '1.5rem',
  },
  priority: {
    alignSelf: 'center',
    fontSize: '2.5rem',
    paddingRight: '2rem',
    minWidth: '5rem',
    textAlign: 'right',
  },
  rankCandidate: {
    alignSelf: 'center',
    gridArea: 'rank',
    justifySelf: 'end',
    marginRight: '1rem',
  },
  mobilContainer: {
    display: 'flex',
  },
}));
