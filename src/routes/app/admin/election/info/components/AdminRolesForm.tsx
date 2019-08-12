import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';
import { Form, Field } from 'react-final-form';
import classNames from 'classnames';

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
import {
  IRoleGrant,
  PersonIdType,
  ElectionGroupRoleType,
  IMutationResponse,
} from 'interfaces';
import { validateFeideId } from 'utils/validators';
import { translateBackendError, buttonize } from 'utils';
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
  onAddRole: (
    role: ElectionGroupRoleType,
    idType: PersonIdType,
    idValue: string
  ) => Promise<IMutationResponse | null>;
  onRemoveRole: (role: IRoleGrant) => Promise<IMutationResponse | null>;
}

interface IState {
  roleToRemove: IRoleGrant | null;
  feedback: {
    text: string;
    isError: boolean;
  };
}

class AdminRolesForm extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      roleToRemove: null,
      feedback: { text: '', isError: false },
    };
  }

  getPrincipalDisplayName = (role: IRoleGrant): string => {
    if (role.principal.__typename === 'PersonPrincipal') {
      return role.principal.person.displayName;
    }
    if (role.principal.__typename === 'PersonIdentifierPrincipal') {
      return role.principal.idValue;
    }
    if (role.principal.__typename === 'GroupPrincipal') {
      return role.principal.group.name;
    }
    return role.grantId;
  };

  setRoleToRemove = (role: IRoleGrant | null): void => {
    this.setState({
      roleToRemove: role,
    });
  };

  removeAndClose = async (): Promise<void> => {
    const { roleToRemove } = this.state;
    if (roleToRemove === null) {
      return;
    }
    const { onRemoveRole } = this.props;
    onRemoveRole(roleToRemove);
    this.setRoleToRemove(null);
  };

  abortRemovalAndClose = (): void => {
    this.setRoleToRemove(null);
  };

  setFeedback = (feedback: { text: string; isError: boolean }): void => {
    this.setState({ feedback });
  };

  addRoleAndSetFeedback = async (values: any) => {
    const { onAddRole, t } = this.props;

    const { idValue } = values;
    if (!idValue) return;

    let idType: PersonIdType;
    if (validateFeideId(idValue)) {
      idType = 'feide_id';
    } else {
      return;
    }

    const idTypeDisplayName = getPersonIdTypeDisplayName(idType, t);

    try {
      const result = await onAddRole('admin', 'feide_id', idValue);
      if (result && result.success) {
        const feedback = t('admin.roles.addedElectionAdminByIdentifier', {
          idType: idTypeDisplayName,
          idValue,
        });
        this.setFeedback({ text: feedback, isError: false });
      } else {
        const feedback = translateBackendError({
          errorCode: (result && result.code) || null,
          t,
          codePrefix: 'admin.roles.backend',
        });
        this.setFeedback({ text: feedback, isError: true });
      }
    } catch (error) {
      this.setFeedback({
        text: error.toString(),
        isError: true,
      });
    }
  };

  validateAddRoleForm = (values: object) => {
    const { t } = this.props;
    if (!Object.prototype.hasOwnProperty.call(values, 'idValue')) {
      return {};
    }

    const { idValue } = values as { idValue: string };
    const errors = {} as { idValue: string };

    if (!idValue) {
      return {};
    }
    if (!validateFeideId(idValue)) {
      errors.idValue = t('formErrors.invalidFeideId');
    }

    if (errors) {
      // Don't display error messages within the fields themselves
      return { _errors: errors };
    }
    return {};
  };

  render() {
    const { classes, adminRoles, t, onClose } = this.props;
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
                    <li key={role.grantId}>
                      <Text inline>{this.getPrincipalDisplayName(role)}</Text>
                      <div
                        className={classes.removeButton}
                        {...buttonize(
                          () => this.setRoleToRemove(role),
                          'Enter'
                        )}
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
                  !pristine && errors._errors && touched && touched.idValue;

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
                            large
                            placeholder={t('idTypes.feide_id')}
                          />
                        </FormField>
                        <Button
                          height="4.5rem"
                          action={handleSubmitAndReset}
                          disabled={pristine}
                          text={
                            submitting ? (
                              <>
                                <span>{t('general.add')}</span>
                                <> </>
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
                            feedback.isError || showValidationErrorFeedback,
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
            <Button action={onClose} text={t('general.close')} secondary />
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
