import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { Field, Form, FormSpy } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import { clearListAddUpdatedMsg } from 'cache';
import { ActionButton } from 'components/button';
import DropDown, { SelectOption } from 'components/newForm/DropDown';

import { MsgBox } from 'components/msgbox';
import { PageSection } from 'components/page';
import Spinner from 'components/animations/Spinner';
import { ElectionGroup } from 'interfaces';

import ListInfo from './ListInfo';

const useStyles = createUseStyles({
  logout: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinBox: {
    marginRight: '2rem',
  },
});

/**
 * Graphql query used to fetch add/updated messages
 * from the local cache.
 */
const listAddUpdatedMsgQuery = gql`
  query GetListAddUpdatedMsg {
    listAddUpdateMsg @client
  }
`;

interface IProps {
  electionGroup: ElectionGroup;
}

/**
 *
 * @param {ElectionGroup} electionGroup - The election group we want to handle
 *    election lists for.
 */
export default function ListMainPage(props: IProps) {
  const { i18n, t } = useTranslation();
  let history = useHistory();
  const classes = useStyles();
  const [selectedList, setSelectedList] = useState<string>('');

  const { data, loading } = useQuery(listAddUpdatedMsgQuery);

  const { electionGroup } = props;
  const { elections } = electionGroup;
  const { lists } = elections[0];

  useEffect(
    // Clear any add/update msgs on unmount.
    () => () => {
      clearListAddUpdatedMsg();
    },
    []
  );

  const listsOptions: Array<SelectOption> = lists.map((list) => {
    return {
      label: list.name[i18n.language],
      value: list.id,
    };
  });

  if (elections.length === 0) {
    return (
      <PageSection noBorder desc="No active election">
        <p>No active election.</p>
      </PageSection>
    );
  }

  if (loading) {
    return (
      <div className={classes.logout}>
        <div className={classes.spinBox}>
          <Spinner darkStyle />
        </div>
        {t('general.loading')}
      </div>
    );
  }

  return (
    <>
      {data && data.listAddUpdateMsg.display && (
        <div style={{ marginBottom: '2rem' }}>
          <MsgBox
            msg={t(data.listAddUpdateMsg.i18NextKey, {
              name: data.listAddUpdateMsg.name[i18n.language],
            })}
            timeout={false}
          />
        </div>
      )}
      <PageSection noBorder desc={t('admin.listElec.header')}>
        <div style={{ marginBottom: '1.2rem' }}>
          <button
            className="button-no-style"
            onClick={() => history.push('addlist')}
          >
            <ActionButton text={t('admin.listElec.add')} />
          </button>
        </div>
      </PageSection>
      {lists ? (
        <PageSection
          noBorder
          noTopPadding
          header={t('admin.listElec.showList.header')}
        >
          <div>
            <Form
              onSubmit={() => {}}
              render={(formProps) => {
                const { handleSubmit } = formProps;
                return (
                  <form onSubmit={handleSubmit}>
                    <Field
                      name="list"
                      component={DropDown}
                      placeholder={t('admin.listElec.showList.placeholder')}
                      options={listsOptions}
                      large
                    />
                    <FormSpy
                      subscription={{ values: true }}
                      onChange={(formState: any) => {
                        if ('list' in formState.values) {
                          setSelectedList(formState.values.list.value);
                        }
                      }}
                    />
                  </form>
                );
              }}
            />
          </div>
          {selectedList && (
            <ListInfo
              electionList={lists.filter((list) => list.id === selectedList)[0]}
            />
          )}
        </PageSection>
      ) : (
        <p>{t('admin.listElec.noListInElection')}</p>
      )}
    </>
  );
}
