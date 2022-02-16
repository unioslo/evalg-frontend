import React from 'react';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
import { ApolloQueryResult, gql } from '@apollo/client';
import { withApollo, WithApolloClient } from '@apollo/client/react/hoc';
import {
  Form,
  Field,
  FormRenderProps,
  FieldRenderProps,
} from 'react-final-form';

import { translateBackendError } from 'utils';
import Button from 'components/button';
import { FormField, RadioButtonGroup } from 'components/form';
import Modal from 'components/modal';

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
  mutation ($censusFile: Upload!, $pollbookId: UUID!) {
    uploadCensusFile(censusFile: $censusFile, pollbookId: $pollbookId) {
      success
      code
      message
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
    this.fileInputWrapper = this.fileInputWrapper.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
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
      const { closeAction } = this.props;
      const status: IUploadCensusFileModalStatus = { success: false };
      closeAction(status);
    }
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

  async onSubmit(values: any) {
    this.setState({
      isUploading: true,
    });
    const { client, closeAction, i18n, pollBooks, refetchData, t } = this.props;
    const { censusFile } = this.state;

    const lang: string = i18n.language;

    if (!client) {
      this.setState({ isUploading: false });
      const errorMessage = t('census.errors.backend.unknown');
      const status: IUploadCensusFileModalStatus = {
        success: false,
        message: errorMessage,
        numOk: 0,
        numFailed: 0,
      };
      closeAction(status);
    } else {
      await client
        .mutate<IUploadCensusFileResponse>({
          mutation: UploadCensusFileMutation,
          variables: {
            censusFile,
            pollbookId: values.pollbookId,
          },
        })
        .then((result) => {
          const response =
            result && result.data && result.data.uploadCensusFile;

          this.setState({ isUploading: false });

          if (!response || !response.success) {
            let errorMessage = t('census.errors.backend.unknown');
            if (response && response.code) {
              errorMessage = translateBackendError({
                errorCode: response.code,
                t,
                codePrefix: 'census.errors.backend',
                tOptions: {
                  mimetype: censusFile && censusFile.type,
                },
              });
            }
            const status: IUploadCensusFileModalStatus = {
              success: false,
              message: errorMessage,
            };
            closeAction(status);
          } else {
            if (refetchData !== undefined) {
              refetchData();
            }
            const message = t('census.uploadSuccessful', {
              pollbookName: pollBooks[values.pollbookId].name[lang],
            });
            const status: IUploadCensusFileModalStatus = {
              success: true,
              message,
              numOk: response.numOk,
              numFailed: response.numFailed,
            };
            closeAction(status);
          }
        })
        .catch(() => {
          this.setState({ isUploading: false });
          const errorMessage = t('census.errors.backend.unknown');
          const status: IUploadCensusFileModalStatus = {
            success: false,
            message: errorMessage,
            numOk: 0,
            numFailed: 0,
          };
          closeAction(status);
        });
    }
  }

  private fileInputWrapper(fieldProps: FieldRenderProps<any, any>) {
    const { classes } = this.props;
    const onChangeWrapper = (e: IHTMLInputEvent) => {
      fieldProps.input.onChange(e);
      this.onChange(e);
    };

    const labelClassNames = classNames({
      [classes.button]: true,
      [classes.secondary]: true,
    });

    return (
      <div className={classes.size}>
        <Field
          name="censusFile"
          id="censusFile"
          validate={(value: any) => (value ? undefined : 'Required')}
          className={`${classes.hiddenFileInput} file-input`}
          onChange={onChangeWrapper}
          component="input"
          type="file"
        />
        {/* TODO convert to button */}
        <label htmlFor="censusFile" className={labelClassNames}>
          <Trans>general.chooseFile</Trans>
        </label>
      </div>
    );
  }

  private renderForm(formProps: FormRenderProps) {
    const { handleSubmit, pristine, invalid } = formProps;
    const { classes, closeAction, header, pollBooks } = this.props;
    const { fileName, isUploading } = this.state;
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
        action={closeAction}
        disabled={isUploading}
        secondary
        key="cancelButton"
      />
    );

    const renderSaveFormButton = (
      <Button
        text={<Trans>general.upload</Trans>}
        disabled={pristine || invalid || isUploading}
        showSpinner={isUploading}
        action={submitWrapper}
        key="saveButton"
      />
    );

    // Create the pollbook radio button options
    const pollBookOptions: any = [];
    Object.keys(pollBooks).forEach((pollBookID) => {
      if (pollBooks[pollBookID].active) {
        pollBookOptions.push({
          label: pollBooks[pollBookID].name[lang],
          value: pollBooks[pollBookID].value,
          id: pollBooks[pollBookID].value,
        });
      }
    });

    return (
      <div>
        <Modal
          closeAction={closeAction}
          header={header}
          buttons={[renderCloseFormButton, renderSaveFormButton]}
        >
          <form onSubmit={submitWrapper}>
            <br />
            <p className={classes.formHeader}>
              <Trans>census.censusType</Trans>
            </p>
            <FormField>
              <Field
                name="pollbookId"
                component={RadioButtonGroup as any}
                validate={(value: any) => (value ? undefined : 'Required')}
                options={pollBookOptions}
              />
            </FormField>

            <p className={classes.formHeader}>
              <Trans>census.chooseFile</Trans>
            </p>

            <div className={classes.size}>
              <input
                className={classes.fileNameBox}
                name="filename"
                type="text"
                value={fileName}
                disabled
              />

              <Field
                name="censusFile"
                validate={(value: any) => (value ? undefined : 'Required')}
              >
                {this.fileInputWrapper}
              </Field>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  public render() {
    return <Form onSubmit={this.onSubmit} render={this.renderForm} />;
  }
}

export default injectSheet(styles)(
  withTranslation()(withApollo<IProps, IState>(UploadCensusFileModal))
);
