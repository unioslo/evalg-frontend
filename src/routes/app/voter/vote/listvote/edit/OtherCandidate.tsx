import { useEffect, useRef, useState } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { AddButton } from 'components/button';
import { FormButtons, FormField } from 'components/form';
import { Candidate, EditListCandidate, ElectionList } from 'interfaces';
import DropDown, { SelectOption } from 'components/newForm/DropDown';
import {
  PageExpandableSubSection,
  PageSubSection,
  StatelessExpandableSubSection,
} from 'components/page/PageSection';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

import { ListCandidateEditItem } from '../listCandidateItem';
import { MsgBox } from 'components/msgbox';

const useOtherCandidatesMobilItemStyles = createUseStyles({
  candidate: {
    marginLeft: '1rem',
    fontSize: '1.8rem',
    alignItems: 'center',
    alignSelf: 'center',
  },
  listItem: {
    '&:first-child': {
      borderTop: '2px solid #CCC',
    },
    borderBottom: '2px solid #CCC',
    display: 'flex',
    padding: '1rem 1rem 1rem 1rem',
    justifyContent: 'flex-start',
  },
});

interface OtherCandidateMobilItem {
  added: boolean;
  candidate: Candidate;
  disabled?: boolean;
  toggleAdded: () => void;
}

function OtherCandidateMobileItem(props: OtherCandidateMobilItem) {
  const { added, candidate, disabled = false, toggleAdded } = props;
  const classes = useOtherCandidatesMobilItemStyles();
  const { t } = useTranslation();

  return (
    <li key={candidate.id} className={classes.listItem}>
      <AddButton
        disabled={disabled}
        onClick={toggleAdded}
        title={
          disabled
            ? ''
            : t('voter.listVote.addOtherIconTitle', { name: candidate.name })
        }
        checkMark={added}
      />
      <div className={classes.candidate}>{candidate.name}</div>
    </li>
  );
}

const useOtherCandidatesStyles = createUseStyles((theme: any) => ({
  list: {
    marginTop: '1.5rem',
    marginRight: '2rem',
    [theme.breakpoints.notMobileQuery]: {
      marginTop: '3rem',
    },
  },
  mobilOtherCandidateList: {
    marginLeft: '1rem',
  },
}));

interface OtherCandidatesProps {
  electionLists: ElectionList[];
  maxOtherCandidates: number;
  otherListCandidates: EditListCandidate[];
  selectedList: ElectionList;
  setOtherListCandidates: (candidates: EditListCandidate[]) => void;
}

export default function OtherCandidates(props: OtherCandidatesProps) {
  const {
    electionLists,
    maxOtherCandidates,
    otherListCandidates,
    selectedList,
    setOtherListCandidates,
  } = props;
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const classes = useOtherCandidatesStyles({ theme });

  /**
   * State for the add other candidate form selects
   */
  const [selectedOtherList, setSelectedOtherList] = useState<
    ElectionList | undefined
  >(undefined);
  const [otherListCandidatesOptions, setOtherListCandidatesOptions] = useState<
    SelectOption[] | undefined
  >(undefined);

  /**
   * Create the candidate select options after a list is selected.
   * Removes candidates who are added from the options.
   */
  useEffect(() => {
    if (selectedOtherList) {
      const currentOtherCandidateIds = otherListCandidates.map(
        (candidate) => candidate.candidate.id
      );
      setOtherListCandidatesOptions(
        selectedOtherList.candidates
          .filter((c) => !currentOtherCandidateIds.includes(c.id))
          .sort((a, b) => a.priority - b.priority)
          .map((candidate) => ({
            label: candidate.name,
            value: candidate,
          }))
      );
    }
  }, [otherListCandidates, selectedOtherList, setOtherListCandidatesOptions]);

  const otherListsOptionsRef = useRef(
    electionLists
      .filter((electionList) => electionList !== selectedList)
      .map((electionList) => ({
        label: electionList.name[i18n.language],
        value: electionList,
      }))
  );

  const addOtherCandidate = (
    sourceList: ElectionList,
    candidate: Candidate
  ) => {
    if (
      !otherListCandidates.map((c) => c.candidate.id).includes(candidate.id) &&
      otherListCandidates.length < maxOtherCandidates
    ) {
      setOtherListCandidates([
        ...otherListCandidates,
        {
          candidate: candidate,
          sourceList: sourceList,
          userCumulated: false,
          userDeleted: false,
        },
      ]);
    }
  };

  const removeOtherCandidate = (candidate: Candidate) => {
    setOtherListCandidates(
      otherListCandidates.filter((c) => c.candidate.id !== candidate.id)
    );
  };

  const validate = (values: any) => {
    const errors: any = {
      selectedCandidate: undefined,
    };
    if (!values.selectedCandidate) {
      errors.selectedCandidate = t('voter.listVote.otherListCandidatesMissing');
    }

    return errors;
  };

  const toggleOtherCandidate = (
    otherCandidate: Candidate,
    electionList: ElectionList
  ) => {
    const existingCandidate = otherListCandidates.find(
      (candidate) => candidate.candidate === otherCandidate
    );

    if (existingCandidate) {
      setOtherListCandidates(
        otherListCandidates.filter(
          (candidate) => candidate.candidate !== otherCandidate
        )
      );
    } else {
      if (otherListCandidates.length < maxOtherCandidates) {
        setOtherListCandidates([
          ...otherListCandidates,
          {
            sourceList: electionList,
            candidate: otherCandidate,
            userCumulated: false,
            userDeleted: false,
          },
        ]);
      }
    }
  };

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => (
        <div>
          {screenSize === 'mobile' || screenSize === 'sm' ? (
            <PageExpandableSubSection
              header={t('voter.listVote.addOtherListHeader')}
            >
              <div className={classes.mobilOtherCandidateList}>
                {electionLists
                  .filter((electionList) => electionList !== selectedList)
                  .map((electionList) => (
                    <StatelessExpandableSubSection
                      key={electionList.id}
                      isExpanded={selectedOtherList === electionList}
                      setIsExpanded={() =>
                        selectedOtherList === electionList
                          ? setSelectedOtherList(undefined)
                          : setSelectedOtherList(electionList)
                      }
                      header={electionList.name[i18n.language]}
                    >
                      <>
                        {otherListCandidates.length === maxOtherCandidates && (
                          <MsgBox
                            disableClose
                            msg={t('voter.listVote.maxOtherVotes', {
                              number: maxOtherCandidates,
                            })}
                            timeout={false}
                          />
                        )}
                        {electionList.candidates.map((candidate) => (
                          <OtherCandidateMobileItem
                            added={otherListCandidates
                              .map((c) => c.candidate)
                              .includes(candidate)}
                            candidate={candidate}
                            disabled={
                              otherListCandidates.length === maxOtherCandidates
                            }
                            key={candidate.id}
                            toggleAdded={() =>
                              toggleOtherCandidate(candidate, electionList)
                            }
                          />
                        ))}
                      </>
                    </StatelessExpandableSubSection>
                  ))}
              </div>
            </PageExpandableSubSection>
          ) : (
            <div>
              {otherListCandidates.length > 0 && (
                <PageSubSection
                  header={t('voter.listVote.otherListCandidates')}
                >
                  <div>
                    <ul className={classes.list}>
                      {otherListCandidates.map((otherListCandidate) => (
                        <ListCandidateEditItem
                          key={otherListCandidate.candidate.id}
                          candidate={otherListCandidate.candidate}
                          electionList={otherListCandidate.sourceList}
                          isOtherCandidate
                          isSelected={false}
                          onOtherCandidateDelete={() =>
                            removeOtherCandidate(otherListCandidate.candidate)
                          }
                          setSelectedCandidate={() => {}}
                        />
                      ))}
                    </ul>
                  </div>
                </PageSubSection>
              )}

              <PageSubSection header={t('voter.listVote.addOtherListHeader')}>
                {otherListCandidates.length === maxOtherCandidates ? (
                  <MsgBox
                    disableClose
                    msg={t('voter.listVote.maxOtherVotes', {
                      number: maxOtherCandidates,
                    })}
                    timeout={false}
                  />
                ) : (
                  <Form
                    onSubmit={(values, form) => {
                      addOtherCandidate(
                        values.otherList.value,
                        values.selectedCandidate.value
                      );
                      /**
                       * Reset the selected candidate from the options after adding.
                       * This removes the previously selected candidate from the field.
                       */
                      form.change('selectedCandidate', undefined);
                    }}
                    validate={validate}
                    render={(formProps) => {
                      const { handleSubmit, pristine, valid } = formProps;
                      return (
                        <form onSubmit={handleSubmit}>
                          <FormField inline>
                            <FormSpy
                              subscription={{ values: true }}
                              onChange={(formState: any) => {
                                if ('otherList' in formState.values) {
                                  setSelectedOtherList(
                                    formState.values.otherList.value
                                  );
                                }
                              }}
                            />
                            <Field
                              label={t('voter.listVote.otherList')}
                              name="otherList"
                              placeholder={t('general.select')}
                              component={DropDown}
                              options={otherListsOptionsRef.current}
                            />
                          </FormField>
                          {otherListCandidatesOptions && (
                            <FormField inline>
                              <Field
                                label={t('voter.listVote.candidate')}
                                name="selectedCandidate"
                                placeholder={t('voter.listVote.findCandidate')}
                                component={DropDown}
                                isSearchable
                                options={otherListCandidatesOptions}
                              />
                            </FormField>
                          )}
                          <FormButtons
                            saveAction={handleSubmit}
                            submitDisabled={pristine || !valid}
                            customButtonText={t(
                              'voter.listVote.addOtherVoterButtonText'
                            )}
                            customButtonTextSubmitting={t(
                              'voter.listVote.addOtherVoterSubmittingText'
                            )}
                          />
                        </form>
                      );
                    }}
                  />
                )}
              </PageSubSection>
            </div>
          )}
        </div>
      )}
    </ScreenSizeConsumer>
  );
}
