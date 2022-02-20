/**
 * @file Component for creating, updating, and deleting election lists
 */
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Field } from 'react-final-form';
import { useTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { Redirect } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';

import { listAddUpdateMsgVar, clearListAddUpdatedMsg } from 'cache';
import { ErrorPageSection } from 'components/errors';
import {
  TableRowForm,
  TableRowFormFields,
  FormButtons,
  FormField,
  FormFieldGroup,
} from 'components/form';
import Icon from 'components/icon';
import Link from 'components/link';
import { ConfirmModal } from 'components/modal';
import { TextAreaInput, TextInput } from 'components/newForm';
import { PageSection, PageSubSection } from 'components/page';
import Spinner from 'components/animations/Spinner';
import { ElectionGroup, ElectionList } from 'interfaces';
import { validateUrl } from 'utils/validators';

import {
  addElectionList,
  AddElectionListVars,
  AddElectionListData,
  deleteElectionList,
  DeleteElectionListVars,
  DeleteElectionListData,
  updateElectionList,
  UpdateElectionListVars,
  UpdateElectionListData,
} from './mutations';

const useStyles = createUseStyles({
  logout: {
    display: 'flex',
    justifyContent: 'center',
  },
  spinBox: {
    marginRight: '2rem',
  },
});

type RouteParams = {
  groupId: string;
  listId: string;
};

/**
 * Component for creating, deleting, or editing election lists.
 *
 * Limitations:
 * For now we only support singe_election type elections.
 * The first election in the election group is assumed to be the one
 * and only election present. This component needs to be extended, to
 * support multiple_election type elections.
 *
 * @param {boolean} [editList=false] - Enables the components "edit list" mode.
 *  A list id is required as a react-route-dom param
 * @param {ElectionGroup} electionGroup - The electionGroup of the election list.
 */
export default function AddEditElectionList({
  editList,
  electionGroup,
}: {
  editList?: boolean;
  electionGroup: ElectionGroup;
}) {
  const { i18n, t } = useTranslation();
  let history = useHistory();
  const classes = useStyles();
  const { listId } = useParams<RouteParams>();
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  let currentList: ElectionList | undefined = undefined;
  let initialValues: UpdateElectionListVars | undefined = undefined;

  /**
   * Get the current values when editing a list
   */
  if (editList && listId) {
    currentList = electionGroup.elections[0].lists.filter(
      (list) => list.id === listId
    )[0];
    if (currentList) {
      initialValues = {
        id: currentList.id,
        electionId: electionGroup.elections[0].id,
        name: currentList.name,
        description: currentList.description,
        informationUrl: currentList.informationUrl,
      };
    }
  }

  const [
    addList,
    { error: addListError, loading: addListLoading, data: addListData },
  ] = useMutation<AddElectionListData, AddElectionListVars>(addElectionList);

  const [
    updateList,
    {
      error: updateListError,
      loading: updateListLoading,
      data: updateListData,
    },
  ] = useMutation<UpdateElectionListData, UpdateElectionListVars>(
    updateElectionList
  );

  const [
    deleteList,
    {
      error: deleteListError,
      loading: deleteListLoading,
      data: deleteListData,
    },
  ] = useMutation<DeleteElectionListData, DeleteElectionListVars>(
    deleteElectionList
  );

  const cancelAction = () => {
    // Return to candidate page
    clearListAddUpdatedMsg();
    history.push(`/admin/elections/${electionGroup.id}/candidates`);
  };

  const validate = (values: AddElectionListVars | UpdateElectionListVars) => {
    const errors: any = {
      name: {},
      description: {},
      informationUrl: undefined,
    };
    if (values.name) {
      ['en', 'nb', 'nn'].forEach((lang) => {
        if (!values.name[lang]) {
          errors.name[lang] = t('admin.listElec.fieldErrors.nameMissing', {
            lang: t(`general.lang.${lang}`).toLowerCase(),
          });
        }
      });
    } else {
      ['en', 'nb', 'nn'].forEach((lang) => {
        errors.name[lang] = t('admin.listElec.fieldErrors.nameMissing', {
          lang: t(`general.lang.${lang}`).toLowerCase(),
        });
      });
    }
    if (values.description) {
      ['en', 'nb', 'nn'].forEach((lang) => {
        if (!values.description[lang]) {
          errors.description[lang] = t(
            'admin.listElec.fieldErrors.descMissing',
            {
              lang: t(`general.lang.${lang}`).toLowerCase(),
            }
          );
        }
      });
    } else {
      ['en', 'nb', 'nn'].forEach((lang) => {
        errors.description[lang] = t('admin.listElec.fieldErrors.descMissing', {
          lang: t(`general.lang.${lang}`).toLowerCase(),
        });
      });
    }

    if (values.informationUrl && !validateUrl(values.informationUrl)) {
      errors.informationUrl = t('formErrors.invalidUrl');
    }
    return errors;
  };

  const onDelete = () => {
    if (editList && currentList) {
      const { name } = currentList;
      deleteList({
        variables: { id: currentList.id },
        onCompleted: () => {
          listAddUpdateMsgVar({
            display: true,
            i18NextKey: 'admin.listElec.statusMsg.deleted',
            name: name,
          });
        },
      });
    }
  };

  const onSubmit = (values: AddElectionListVars | UpdateElectionListVars) => {
    // We only support single elections for now.
    if (!editList) {
      const addVars = values as AddElectionListVars;
      addVars.electionId = electionGroup.elections[0].id;
      addList({
        variables: { ...addVars },
        onCompleted: () => {
          listAddUpdateMsgVar({
            display: true,
            i18NextKey: 'admin.listElec.statusMsg.added',
            name: addVars.name,
          });
        },
      });
    } else {
      if (currentList) {
        const updateVars = values as UpdateElectionListVars;
        updateVars.electionId = electionGroup.elections[0].id;
        updateVars.id = currentList.id;
        updateList({
          variables: { ...updateVars },
          onCompleted: () => {
            listAddUpdateMsgVar({
              i18NextKey: 'admin.listElec.statusMsg.updated',
              display: true,
              name: updateVars.name,
            });
          },
        });
      }
    }
  };

  if (electionGroup.meta.candidateType !== 'party_list') {
    return (
      <ErrorPageSection
        errorHeader={t('admin.listElec.errors.notListElection.header')}
        errorMessage={t('admin.listElec.errors.notListElection.msg')}
      />
    );
  } else if (editList && !listId) {
    return (
      <ErrorPageSection
        errorHeader={t('admin.listElec.errors.listIdMissing.header')}
        errorMessage={t('admin.listElec.errors.listIdMissing.msg')}
      />
    );
  } else if (editList && !currentList) {
    return (
      <ErrorPageSection
        errorHeader={t('admin.listElec.errors.listNotFound.header')}
        errorMessage={t('admin.listElec.errors.listNotFound.msg', {
          listId: listId,
        })}
      />
    );
  } else if (addListLoading || deleteListLoading || updateListLoading) {
    return (
      <PageSection>
        <div className={classes.logout}>
          <div className={classes.spinBox}>
            <Spinner darkStyle />
          </div>
          {t('general.loading')}
        </div>
      </PageSection>
    );
  } else if (addListError) {
    return (
      <ErrorPageSection
        errorHeader={t('admin.listElec.errors.apiError.addError')}
        errorMessage={addListError.message}
      />
    );
  } else if (deleteListError) {
    return (
      <ErrorPageSection
        errorHeader={t('admin.listElec.errors.apiError.deleteError')}
        errorMessage={deleteListError.message}
      />
    );
  } else if (updateListError) {
    return (
      <ErrorPageSection
        errorHeader={t('admin.listElec.errors.apiError.updateError')}
        errorMessage={updateListError.message}
      />
    );
  } else if (addListData || deleteListData || updateListData) {
    // TODO add
    return (
      <Redirect push to={`/admin/elections/${electionGroup.id}/candidates`} />
    );
  }

  return (
    <>
      <PageSection noBorder noBtmPadding>
        <Link to={`/admin/elections/${electionGroup.id}/candidates`}>
          <Icon type="backArrow" title={t('pollElec.ballot.removeChoice')} />
          {t('general.back')}
        </Link>
      </PageSection>
      <PageSection
        header={
          editList
            ? t('admin.listElec.editList.header')
            : t('admin.listElec.newList.header')
        }
        desc={t('admin.listElec.newList.onDescription')}
      >
        {editList && displayModal && (
          <ConfirmModal
            confirmAction={onDelete}
            closeAction={() => {
              setDisplayModal(false);
            }}
            header={t('admin.listElec.deleteModal.header')}
            body={t('admin.listElec.deleteModal.body', {
              name: currentList ? currentList.name[i18n.language] : '',
            })}
            confirmText={t('general.delete')}
            closeText={t('general.cancel')}
            danger
          />
        )}
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          validate={validate}
          render={(formProps) => {
            const { handleSubmit, pristine, valid } = formProps;
            return (
              <form onSubmit={handleSubmit}>
                <TableRowForm header={t('admin.listElec.newList.nameHeader')}>
                  <TableRowFormFields>
                    <FormFieldGroup flexGrow>
                      <FormField>
                        <Field
                          name="name.nb"
                          component={TextInput}
                          label={t('general.lang.nb')}
                          placeholder={t('general.name')}
                          large
                        />
                      </FormField>
                      <FormField>
                        <Field
                          name="name.nn"
                          component={TextInput}
                          label={t('general.lang.nn')}
                          placeholder={t('general.name')}
                          large
                        />
                      </FormField>
                      <FormField>
                        <Field
                          name="name.en"
                          component={TextInput}
                          label={t('general.lang.en')}
                          placeholder={t('general.name')}
                          large
                        />
                      </FormField>
                    </FormFieldGroup>
                  </TableRowFormFields>
                </TableRowForm>

                <TableRowForm
                  header={t('admin.listElec.newList.descriptionHeader')}
                >
                  <TableRowFormFields>
                    <FormFieldGroup flexGrow>
                      <FormField>
                        <Field
                          name="description.nb"
                          component={TextAreaInput}
                          label={t('general.lang.nb')}
                          placeholder={t('admin.listElec.newList.description', {
                            lang: t('general.lang.nb').toLowerCase(),
                          })}
                        />
                      </FormField>
                      <FormField>
                        <Field
                          name="description.nn"
                          component={TextAreaInput}
                          label={t('general.lang.nn')}
                          placeholder={t('admin.listElec.newList.description', {
                            lang: t('general.lang.nn').toLowerCase(),
                          })}
                        />
                      </FormField>
                      <FormField>
                        <Field
                          name="description.en"
                          component={TextAreaInput}
                          label={t('general.lang.en')}
                          placeholder={t('admin.listElec.newList.description', {
                            lang: t('general.lang.en').toLowerCase(),
                          })}
                        />
                      </FormField>
                    </FormFieldGroup>
                  </TableRowFormFields>
                </TableRowForm>

                <PageSubSection
                  header={t('admin.listElec.newList.urlHeader')}
                />
                <TableRowForm>
                  <TableRowFormFields>
                    <FormFieldGroup flexGrow>
                      <FormField>
                        <Field name="informationUrl" component={TextInput} />
                      </FormField>
                    </FormFieldGroup>
                  </TableRowFormFields>
                </TableRowForm>

                {editList ? (
                  <FormButtons
                    saveAction={handleSubmit}
                    closeAction={cancelAction}
                    submitDisabled={pristine || !valid}
                    entityAction={() => {
                      setDisplayModal(true);
                    }}
                    entityText={t('admin.listElec.delete')}
                    entityDanger
                  />
                ) : (
                  <FormButtons
                    saveAction={handleSubmit}
                    closeAction={cancelAction}
                    submitDisabled={pristine || !valid}
                  />
                )}
              </form>
            );
          }}
        />
      </PageSection>
    </>
  );
}

AddEditElectionList.defaultProps = {
  editList: false,
};
