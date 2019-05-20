import React from 'react';

import {
  Form,
  Field,
  FormRenderProps,
  FieldRenderProps,
} from 'react-final-form';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { ApolloQueryResult } from 'apollo-client';
import { withApollo, WithApolloClient } from 'react-apollo';

import { translateBackendError } from '../../../../../../utils';
import Button from '../../../../../../components/button';
import { FormField } from '../../../../../../components/form';
import { RadioButtonGroup } from '../../../../../../components/form';
import Modal from '../../../../../../components/modal';
import injectSheet from 'react-jss';
import classNames from 'classnames';

const styles = (theme: any) => ({
  modalSize: {
    minHeight: '55rem',
  },

  hiddenFileInput: {
    opacity: 0,
    position: 'absolute',
    pointerEvents: 'none',
    // alternative to pointer-events, compatible with all browsers, just make it impossible to find
    width: '1px',
    height: '1px',
  },

  size: {
    display: 'flex',
    minWidth: '26rem',
  },

  button: {
    width: '9rem',
    height: '4rem',
    border: `0.3rem solid`,
    borderRadius: '0.4rem',
    cursor: 'pointer',
    display: 'block',
    objectFit: 'contain',
    fontFamily: 'Arial',
    fontSize: '1.8rem',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: '1.7',
    letterSpacing: 'normal',
    textAlign: 'center',
    transition: 'background 100ms ease-in',
  },

  secondary: {
    background: theme.secondaryBtnBgColor,
    borderColor: theme.secondaryBtnBorderColor,
    color: theme.secondaryBtnColor,
  },

  fileNameBox: {
    width: '39.2rem',
    height: '4rem',
    border: `0.2rem solid`,
    borderRadius: '0.4rem',
    borderColor: '#dfdddd',
    backgroundColor: '#ffffff',
    marginRight: '2rem',
    paddingLeft: '1.2rem',
  },

  formHeader: {
    fontFamily: 'Arial',
    fontSize: '2.4rem',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: '1.88',
    letterSpacing: 'normal',
    textAlign: 'left',
    color: '#555555',
  },
});

const UploadCensusFileMutation = gql`
  mutation($censusFile: Upload!, $pollbookId: UUID!) {
    uploadCensusFile(censusFile: $censusFile, pollbookId: $pollbookId) {
      success
      code
      message
      numOk
      numFailed
    }
  }
`;

interface IUploadCensusFileResponse {
  uploadCensusFile: {
    success: boolean;
    code?: string;
    message?: string;
    numOk?: number;
    numFailed?: number;
  };
}

interface IProps extends WithTranslation {
  closeAction: (proc: IUploadCensusFileModalStatus) => void;
  header: string | React.ReactElement<any>;
  pollBooks: any;
  groupId: string;
  refetchData?: (
    variables?: { id: string } | undefined
  ) => Promise<ApolloQueryResult<any>>;
  classes: any;
}

type PropsInternal = WithApolloClient<IProps>;

interface IState {
  censusFile: File | null;
  fileName?: string;
  isUploading: boolean;
}

interface IHTMLInputEvent extends React.FormEvent {
  target: HTMLInputElement & EventTarget;
}

export interface IUploadCensusFileModalStatus {
  success: boolean;
  message?: string;
  numOk?: number;
  numFailed?: number;
}

class UploadCensusFileModal extends React.Component<
  PropsInternal,
  IState,
  IHTMLInputEvent
> {
  constructor(props: PropsInternal) {
    super(props);

    this.state = {
      censusFile: null,
      fileName: '',
      isUploading: false,
    };

    this.renderForm = this.renderForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.required = this.required.bind(this);
    this.fileInputWrapper = this.fileInputWrapper.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async onSubmit(values: any) {
    this.setState({
      isUploading: true,
    });
    const lang: string = this.props.i18n.language;
    await this.props.client
      .mutate<IUploadCensusFileResponse>({
        mutation: UploadCensusFileMutation,
        variables: {
          censusFile: this.state.censusFile,
          pollbookId: values.pollbookId,
        },
      })
      .then(result => {
        const response = result && result.data && result.data.uploadCensusFile;

        this.setState({ isUploading: false });

        if (!response || !response.success) {
          let errorMessage = this.props.t('census.errors.backend.unknown');
          if (response && response.code) {
            errorMessage = translateBackendError({
              errorCode: response.code,
              t: this.props.t,
              codePrefix: 'census.errors.backend',
              tOptions: {
                mimetype: this.state.censusFile && this.state.censusFile.type,
              },
            });
          }
          const status: IUploadCensusFileModalStatus = {
            success: false,
            message: errorMessage,
          };
          this.props.closeAction(status);
        } else {
          if (this.props.refetchData !== undefined) {
            this.props.refetchData();
          }
          const feedbackTemplate = response.numFailed
            ? 'uploadSuccessfulWithFailures'
            : 'uploadSuccessful';
          const message = this.props.t(`census.${feedbackTemplate}`, {
            numOk: response.numOk,
            numFailed: response.numFailed,
            pollbookName: this.props.pollBooks[values.pollbookId].name[lang],
          });
          const status: IUploadCensusFileModalStatus = {
            success: true,
            message,
            numOk: response.numOk,
            numFailed: response.numFailed,
          };
          this.props.closeAction(status);
        }
      })
      .catch(error => {
        this.setState({ isUploading: false });
        const errorMessage = this.props.t('census.errors.backend.unknown');
        const status: IUploadCensusFileModalStatus = {
          success: false,
          message: errorMessage,
          numOk: 0,
          numFailed: 0,
        };
        this.props.closeAction(status);
      });
  }

  public onChange(e: IHTMLInputEvent) {
    if (e !== undefined) {
      if (e.target.files !== null) {
        this.setState({
          censusFile: e.target.files[0],
          fileName: e.target.files[0].name,
        });
      }
    }
  }

  public render() {
    return <Form onSubmit={this.onSubmit} render={this.renderForm} />;
  }

  public componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  private handleKeyPress(e: KeyboardEvent) {
    // Close the modal on escape
    if (e.keyCode === 27) {
      const status: IUploadCensusFileModalStatus = { success: false };
      this.props.closeAction(status);
    }
  }

  private required(value: any) {
    return value ? undefined : 'Required';
  }

  private fileInputWrapper(fieldProps: FieldRenderProps) {
    const onChangeWrapper = (e: IHTMLInputEvent) => {
      fieldProps.input.onChange(e);
      this.onChange(e);
    };

    const labelClassNames = classNames({
      [this.props.classes.button]: true,
      [this.props.classes.secondary]: true,
    });

    return (
      <div className={this.props.classes.size}>
        <Field
          name="censusFile"
          id="censusFile"
          validate={this.required}
          className={`${this.props.classes.hiddenFileInput} file-input`}
          onChange={onChangeWrapper}
          component="input"
          type="file"
        />
        <label htmlFor="censusFile" className={labelClassNames}>
          <Trans>general.chooseFile</Trans>
        </label>
      </div>
    );
  }

  private renderForm(formProps: FormRenderProps) {
    const { handleSubmit, pristine, invalid } = formProps;
    const { i18n } = this.props;
    const lang = i18n.language;

    // Wrapper to call preventDefault on submit
    const submitWrapper = (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSubmit(event);
    };

    const renderCloseFormButton = (
      <Button
        text={<Trans>general.cancel</Trans>}
        action={this.props.closeAction}
        disabled={this.state.isUploading}
        secondary={true}
        key="cancelButton"
      />
    );

    const renderSaveFormButton = (
      <Button
        text={<Trans>general.upload</Trans>}
        disabled={pristine || invalid || this.state.isUploading}
        showSpinner={this.state.isUploading}
        action={submitWrapper}
        key="saveButton"
      />
    );

    // Create the pollbook radio button options
    const pollBookOptions: any = [];
    Object.keys(this.props.pollBooks).forEach(pollBookID => {
      if (this.props.pollBooks[pollBookID].active) {
        pollBookOptions.push({
          label: this.props.pollBooks[pollBookID].name[lang],
          value: this.props.pollBooks[pollBookID].value,
          id: this.props.pollBooks[pollBookID].value,
        });
      }
    });

    return (
      <div>
        <Modal
          closeAction={this.props.closeAction}
          header={this.props.header}
          buttons={[renderCloseFormButton, renderSaveFormButton]}
        >
          <form onSubmit={submitWrapper}>
            <br />
            <p className={this.props.classes.formHeader}>
              <Trans>census.censusType</Trans>
            </p>
            <FormField>
              <Field
                name="pollbookId"
                component={RadioButtonGroup as any}
                validate={this.required}
                options={pollBookOptions}
              />
            </FormField>

            <p className={this.props.classes.formHeader}>
              <Trans>census.chooseFile</Trans>
            </p>

            <div className={this.props.classes.size}>
              <input
                className={this.props.classes.fileNameBox}
                name="filename"
                type="text"
                value={this.state.fileName}
                disabled={true}
              />

              <Field name="censusFile" validate={this.required}>
                {this.fileInputWrapper}
              </Field>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}

export default injectSheet(styles)(
  withTranslation()(withApollo(UploadCensusFileModal))
);
