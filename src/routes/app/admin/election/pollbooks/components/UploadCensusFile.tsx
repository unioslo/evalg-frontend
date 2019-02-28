import * as React from 'react';

// import { Trans } from 'react-i18next';
import axios from 'axios';
import {
  Form,
  Field,
  FormRenderProps,
  FieldRenderProps,
} from 'react-final-form';
import { Trans, translate } from 'react-i18next';
import { ApolloQueryResult } from 'apollo-client';

import Button from '../../../../../../components/button';
import { FormField } from '../../../../../../components/form';
import { RadioButtonGroup } from '../../../../../../components/form';
import Modal from '../../../../../../components/modal';
import { restBackend } from '../../../../../../appConfig';
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

interface IProps {
  closeAction: (proc: IReturnStatus) => void;
  // submitAction: (valus: any) => void,
  header: string | React.ReactElement<any>;
  pollBooks: any;
  i18n: any;
  t: (t: string) => string;
  groupId: string;
  refetchData?: (
    variables?: { id: string } | undefined
  ) => Promise<ApolloQueryResult<any>>;
  classes: any;
}

interface IState {
  censusFile: File | null;
  fileName: string;
  // pollbook: any,
}

interface IHTMLInputEvent extends React.FormEvent {
  target: HTMLInputElement & EventTarget;
}

// interface IFormSubmit {
//   pollbookId: string;
//   censusFile: string;
// }

export interface IReturnStatus {
  parseCompleded: boolean;
  showMsg: boolean;
  ok: number;
  failed: number;
  error_msg: string,
  pollBookName: string;
}

class UploadCensusFileModal extends React.Component<
  IProps,
  IState,
  IHTMLInputEvent
> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      censusFile: null,
      fileName: '',
    };

    this.renderForm = this.renderForm.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.required = this.required.bind(this);
    this.fileInputWrapper = this.fileInputWrapper.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  public onSubmit(values: any) {
    const {
      i18n: { language: lang },
    } = this.props;

    const data = new FormData();

    if (this.state.censusFile !== null) {
      data.append('census_file', this.state.censusFile);
    }
    data.append('pollbook_id', values.pollbookId);

    axios
      .create({ baseURL: restBackend })
      .post('upload/', data)
      .then(response => {
        const ret: IReturnStatus = {
          parseCompleded: true,
          showMsg: true,
          ok: response.data.ok,
          failed: response.data.failed,
          error_msg: '',
          pollBookName: this.props.pollBooks[values.pollbookId].name[lang],
        };
        if (this.props.refetchData !== undefined) {
          this.props.refetchData();
        }
        this.props.closeAction(ret);
      })
      .catch(error => {

        const ret: IReturnStatus = {
          parseCompleded: false,
          showMsg: true,
          ok: 0,
          failed: 0,
          error_msg: error.response.details,
          pollBookName: this.props.pollBooks[values.pollbookId].name[lang],
        };
        this.props.closeAction(ret);
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

  /**
   * Close the modal on escape
   */
  private handleKeyPress(e: KeyboardEvent) {
    if (e.keyCode === 27) {
      const status: IReturnStatus = {
        parseCompleded: false,
        showMsg: false,
        ok: 0,
        failed: 0,
        error_msg: '',
        pollBookName: '',
      };

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
          className={this.props.classes.hiddenFileInput}
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
    const {
      i18n: { language: lang },
    } = this.props;

    // Wrapper to call preventDefault on submit
    const submitWrapper = (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSubmit(event);
    };

    const renderCloseFormButton = (
      <Button
        text={<Trans>general.cancel</Trans>}
        action={this.props.closeAction}
        secondary={true}
        key="cancelButton"
      />
    );

    const renderSaveFormButton = (
      <Button
        text={<Trans>general.upload</Trans>}
        disabled={pristine || invalid}
        action={submitWrapper}
        key="SaveButton"
      />
    );

    /**
     * Create the pollbook radiobutton options
     */
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
                name="test"
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

export default injectSheet(styles as any)(translate()(UploadCensusFileModal));
