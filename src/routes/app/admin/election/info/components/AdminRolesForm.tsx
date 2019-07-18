import React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

import {
  TableRowForm,
  TableRowFormFields,
  FormField,
  TextInputRF,
} from 'components/form';
import { ConfirmModal } from 'components/modal';
import { PageSubSection } from 'components/page';
import Text from 'components/text';
import { Button, ButtonContainer } from 'components/button';
import Spinner from 'components/animations/Spinner';
import { IRoleGrant, PersonIdType } from 'interfaces';
import { validateFeideId, validateNin } from 'utils/validators';
import { getPersonIdTypeDisplayName } from 'utils/i18n';

const styles = (theme: any) => ({
  form: {
    display: 'flex',
  },
  formSection: {
    marginTop: '3rem',
    display: 'inline-block',
    marginRight: '8rem',
  },
  list: {
    display: 'inline-block',
    listStyleType: 'none',
    marginTop: '1rem',
  },
  removeButton: {
    background: 'url("/remove.svg") no-repeat right top 30%',
    backgroundSize: '1.4rem',
    height: '1.4rem',
    width: '1.4rem',
    paddingRight: '2.5rem',
    display: 'inline-block',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  feedback: {
    marginTop: '1.5rem',
  },
  feedbackError: {
    color: theme.formErrorTextColor,
  },
});

interface IProps extends WithTranslation {
  classes: Classes;
  adminRoles: IRoleGrant[];
  onClose: () => void;
  onAddRole: (role: string, idType: PersonIdType, idValue: string) => void;
  onRemoveRole: (role: IRoleGrant) => void;
}

interface IState {
  roleToRemove: IRoleGrant | null;
  feedback: {
    text: string;
    isBackendError: boolean;
  };
}

class AdminRolesForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      roleToRemove: null,
      feedback: { text: '', isBackendError: false },
    };
    this.removeAndClose = this.removeAndClose.bind(this);
    this.abortRemovalAndClose = this.abortRemovalAndClose.bind(this);
    this.setFeedback = this.setFeedback.bind(this);
    this.addRoleAndSetFeedback = this.addRoleAndSetFeedback.bind(this);
  }

  getPrincipalDisplayName = (role: IRoleGrant): string => {
    if (role.principal.__typename === 'PersonPrincipal') {
      return role.principal.person.displayName;
    } else if (role.principal.__typename === 'PersonIdentifierPrincipal') {
      return role.principal.idValue;
    } else if (role.principal.__typename === 'GroupPrincipal') {
      return role.principal.group.name;
    }
    return role.grantId;
  };

  setRoleToRemove = (role: IRoleGrant | null): void => {
    this.setState({
      roleToRemove: role,
    });
  };

  removeAndClose = (): void => {
    if (this.state.roleToRemove === null) {
      return;
    }

    this.props.onRemoveRole(this.state.roleToRemove);

    this.setRoleToRemove(null);
  };

  abortRemovalAndClose = (): void => {
    this.setRoleToRemove(null);
  };

  setFeedback = (feedback: { text: string; isBackendError: boolean }): void => {
    this.setState({
      feedback: feedback,
    });
  };

  addRoleAndSetFeedback = async (values: any) => {
    const { onAddRole, t } = this.props;

    const idValue = values.idValue;
    if (!idValue) return;

    let idType: PersonIdType;
    if (validateFeideId(idValue)) {
      idType = 'feide_id';
    }
    // else if (validateNin(idValue)) {
    //   idType = 'nin';
    // }
    else {
      return;
    }

    const idTypeDisplayName = getPersonIdTypeDisplayName(idType, t);

    try {
      await onAddRole('admin', 'feide_id', idValue);
      const feedback = t('admin.roles.addedElectionAdminByIdentifier', {
        idType: idTypeDisplayName,
        idValue,
      });
      this.setFeedback({ text: feedback, isBackendError: false });
    } catch (error) {
      this.setFeedback({
        text:
          error.toString() +
          ` (idType: ${idTypeDisplayName}, idValue: ${idValue})`,
        isBackendError: true,
      });
    }
  };

  validateAddRoleForm = (values: object) => {
    const { t } = this.props;
    if (!values.hasOwnProperty('idValue')) {
      return {};
    }

    const { idValue } = values as { idValue: string };
    const errors: object = {};

    if (!idValue) {
      return {};
    } else if (!validateFeideId(idValue)) {
      errors['idValue'] = t('formErrors.invalidFeideId');
    }

    if (errors) {
      // Don't display error messages within the fields themselves
      return { _errors: errors };
    } else {
      return {};
    }
  };

  render() {
    const { classes, adminRoles, t } = this.props;
    const { roleToRemove, feedback } = this.state;
    return (
      <>
        <div>
          <PageSubSection header={<Trans>admin.roles.electionAdmins</Trans>}>
            <Text>
              <Trans>admin.roles.electionAdminsDescription</Trans>
            </Text>
            <div className={classes.form}>
              <div className={classes.formSection}>
                <Text bold>
                  <Trans>admin.roles.singleUsers</Trans>
                </Text>
                <ul className={classes.list}>
                  {adminRoles.map((role, index) => (
                    <li key={index}>
                      <Text inline>{this.getPrincipalDisplayName(role)}</Text>
                      <div
                        className={classes.removeButton}
                        onClick={() => this.setRoleToRemove(role)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PageSubSection>
          <PageSubSection>
            <Form
              onSubmit={this.addRoleAndSetFeedback}
              validate={this.validateAddRoleForm}
              render={formProps => {
                const {
                  handleSubmit,
                  errors,
                  valid,
                  pristine,
                  touched,
                  submitting,
                  form,
                } = formProps;

                const showValidationErrorFeedback =
                  !pristine && errors._errors && touched && touched['idValue'];

                const handleSubmitAndReset = async (e: any) => {
                  e.preventDefault();
                  await handleSubmit();
                  if (valid) {
                    form.reset();
                  }
                };

                return (
                  <form onSubmit={handleSubmitAndReset}>
                    <TableRowForm header={t('admin.roles.addNewElectionAdmin')}>
                      <TableRowFormFields>
                        <FormField inline>
                          <Field
                            name="idValue"
                            component={TextInputRF}
                            large={true}
                            placeholder={t('idTypes.feide_id')}
                            // inputRef={inputEl}
                          />
                        </FormField>
                        <Button
                          height="4.5rem"
                          action={handleSubmitAndReset}
                          disabled={pristine}
                          text={
                            submitting ? (
                              <>
                                <span>{t('general.add')}</span>{' '}
                                <Spinner size="2rem" marginLeft="0.8rem" thin />
                              </>
                            ) : (
                              t('general.add')
                            )
                          }
                        />
                      </TableRowFormFields>
                      <div
                        className={classNames({
                          [classes.feedback]: true,
                          [classes.feedbackError]:
                            feedback.isBackendError ||
                            showValidationErrorFeedback,
                        })}
                      >
                        {showValidationErrorFeedback
                          ? errors._errors.idValue
                          : feedback.text}
                      </div>
                    </TableRowForm>
                  </form>
                );
              }}
            />
          </PageSubSection>
          <ButtonContainer noTopMargin>
            <Button
              action={this.props.onClose}
              text={t('general.close')}
              secondary
            />
          </ButtonContainer>
        </div>

        {roleToRemove && (
          <ConfirmModal
            confirmAction={this.removeAndClose}
            closeAction={this.abortRemovalAndClose}
            header={<Trans>admin.roles.confirmRemoval</Trans>}
            body={
              <Trans
                values={{
                  target: this.getPrincipalDisplayName(roleToRemove),
                }}
              >
                admin.roles.confirmRemovalElectionAdmin
              </Trans>
            }
            confirmText={<Trans>general.remove</Trans>}
            closeText={<Trans>general.cancel</Trans>}
          />
        )}
      </>
    );
  }
}

export default injectSheet(styles)(withTranslation()(AdminRolesForm));
