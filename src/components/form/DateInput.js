/* @flow */
import * as React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import injectSheet from 'react-jss';
import classNames from 'classnames';
import { translate } from 'react-i18next';

import css from './react-datepicker.min.css';

const styles = theme => ({
  dateInput: {
    fontSize: theme.formFieldFontSize,
    lineHeight: theme.formFieldLineHeight,
    border: theme.formFieldBorder,
    borderRadius: theme.formFieldBorderRadius,
    width: '15rem',
    height: theme.formFieldHeight,
    color: theme.colors.greyishBrown,
    paddingLeft: theme.formFieldHorizontalPadding,
    paddingTop: '0.4rem',
    background: 'url("/kalender.svg") no-repeat right 1.3rem top 50%',
    backgroundSize: '19px 18px',
    borderColor: theme.formFieldBorderColor,
    transition: `${theme.borderColor} ${theme.formFieldFocusTransition}`,
    '&:focus': {
      borderColor: theme.formFieldBorderActiveColor,
      transition: `${theme.borderColor} ${theme.formFieldFocusTransition}`,
    },
  },
  small: {
    height: '3.5rem'
  },
  error: {
    borderColor: theme.formFieldBorderErrorColor
  },
  label: {
    order: 1,
    fontSize: '2rem',
    lineHeight: 1.45,
    color: theme.formFieldLabelUnfocusedColor,
    transition: 'color 200ms ease-in',
    marginBottom: '2rem',
    display: 'block'
  },
  labelSmall: {
    fontSize: '1.8rem',
    lineHeight: 1.61,
  },
  labelFocus: {
    color: theme.formFieldLabelFocusedColor,
    transition: 'color 200ms ease-in',
  }
});

type Props = {
  value: string,
  onChange: Function,
  onFocus: Function,
  onBlur: Function,
  name: string,
  lang: string,
  label?: ReactElement,
  t: Function,
  small?: boolean,
  error?: any,
  classes: Object
}

type State = {
  hasFocus: boolean
};

class DateInput extends React.Component<Props, State> {
  props: Props;
  state: State;
  wrapperRef: any;
  handleClickOutside: Function;

  constructor(props: Props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      hasFocus: false
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event: Event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.hasFocus) {
        this.setState({ hasFocus: false });
        this.props.onBlur();
      }
    }
  }

  handleOnChange(value: any) {
    if (!value) {
      return this.props.onChange(null);
    }
    this.props.onChange(value.format('YYYY-MM-DD'));
  }

  handleOnFocus() {
    this.setState({ hasFocus: true });
    this.props.onFocus();
  }
  render() {
    const {
      value, lang, name, label, small, error, classes
    } = this.props;
    const momentValue = value ? moment(value) : value;
    const inputClassNames = classNames({
      [classes.dateInput]: true,
      [classes.small]: small,
      [classes.error]: error
    });
    const labelClassNames = classNames({
      [classes.label]: true,
      [classes.labelSmall]: true,
      [classes.labelFocus]: this.state.hasFocus
    });

    return (
      <div ref={(node) => (this.wrapperRef = node)} >
        {!!label &&
          <label htmlFor={name} className={labelClassNames}>
            {label}
          </label>
        }
        <DatePicker
          className={inputClassNames}
          selected={momentValue}
          onChange={this.handleOnChange.bind(this)}
          locale={lang}
          name={name}
          id={name}
          onFocus={this.handleOnFocus.bind(this)}
          placeholderText={this.props.t('i18n.datePlaceHolder')}
        />
      </div>
    )
  }
}

const DateInputHOC = injectSheet(styles)(translate()(DateInput));

export default DateInputHOC;


/* Redux Form Wrapper */

type RFProps = {
  input: {
    value: string,
    onChange: Function,
    name: string,
    onFocus: Function,
    onBlur: Function,
  },
  meta: { error: any },
  label?: ReactElement,
  small?: boolean
}

export const DateInputRF = (props: RFProps) => {
  const { input, meta, ...restProps } = props;
  return (
    <DateInputHOC
      name={input.name}
      value={input.value}
      error={meta.error}
      onChange={input.onChange}
      onFocus={input.onFocus}
      onBlur={input.onBlur}
      {...restProps}
    />
  )
};
