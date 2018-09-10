/* @flow */
import * as React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import classNames from 'classnames';
import { translate } from 'react-i18next';
import injectSheet from 'react-jss';

import Icon from 'components/icon';
import TextInput from './TextInput';

const styles = theme => ({
  outerContainer: {
    width: '9.6rem',
  },
  innerContainer: {
    position: 'relative',
  },
  timeInput: {
    background: 'url("clock.svg") no-repeat 90% 50%',
    backgroundSize: '16px 16px'
  },
  timePicker: {
    position: 'absolute',
    top: '9.6rem',
    background: theme.colors.white,
    zIndex: 100,
    width: '19.7rem',
    height: '11.6rem',
    border: `${theme.formFieldBorder} ${theme.formFieldBorderColor}`,
    borderRadius: theme.formFieldBorderRadius,
    textAlign: 'center'
  },
  timePickerNoLabel: {
    top: '4.6rem',
  },
  timePickerInputContainer: {
    margin: '0.8rem 0.5rem',
    textAlign: 'center',
    display: 'inline-block',
    '&:first-child': {
      marginLeft: 0
    },
    '&:last-child': {
      marginRight: 0
    }
  },
  timePickerInput: {
    width: '5.2rem',
    height: '4.2rem',
    marginTop: '0.7rem',
    marginBottom: '0.8rem',
    borderRadius: theme.formFieldBorderRadius,
    boxShadow: 'inset 0 0 3px 0 rgba(0, 0, 0, 0.5)',
    border: 'solid 1px #979797',
    textAlign: 'center',
    fontSize: '1.6rem',
    color: theme.colors.greyishBrown,
    transition: `border-color ${theme.formFieldFocusTransition}`,
    '&:focus': {
      borderColor: theme.formFieldBorderActiveColor,
      transition: `border-color ${theme.formFieldFocusTransition}`
    }
  },
  timePickerSeparator: {
    position: 'relative',
    fontSize: '2.5rem',
    display: 'inline-block',
    top: '-3.5rem',
  },
  timePickerIcon: {
    cursor: 'pointer'
  }
})

type Props = {
  value: string,
  onChange: Function,
  name: string,
  t: Function,
  label?: ReactElement,
  small?: boolean,
  error?: any,
  classes: Object
};

type State = {
  hourValue: string,
  minuteValue: string,
  hasFocus: boolean,
  inputValue: string
}

class TimeInput extends React.Component<Props, State> {
  wrapperRef: any;
  handleClickOutside: Function;
  handleHourChange: Function;
  handleMinuteChange: Function;
  incrementHourValue: Function;
  decrementHourValue: Function;
  incrementMinuteValue: Function;
  decrementMinuteValue: Function;

  constructor(props: Props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleHourChange = this.handleHourChange.bind(this);
    this.handleMinuteChange = this.handleMinuteChange.bind(this);
    this.incrementHourValue = this.incrementHourValue.bind(this);
    this.decrementHourValue = this.decrementHourValue.bind(this);
    this.incrementMinuteValue = this.incrementMinuteValue.bind(this);
    this.decrementMinuteValue = this.decrementMinuteValue.bind(this);
    this.state = {
      hasFocus: false,
      hourValue: "",
      minuteValue: "",
      inputValue: ''
    }
  }

  componentWillMount() {
    if (this.props.value.length === 5) {
      const hrMinValues = this.props.value.split(':');
      this.setState({
        hourValue: hrMinValues[0],
        minuteValue: hrMinValues[1],
        inputValue: `${hrMinValues[0]}:${hrMinValues[1]}`
      });
    }
    else {
      this.setState({
        hourValue: "00", minuteValue: "00", inputValue: ""
      });
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
      this.setState({ hasFocus: false });
    }
  }

  handleOnFocus() {
    this.setState({ hasFocus: true });
  }

  handleChangedValue(hourValue, minuteValue) {
    this.props.onChange(`${hourValue}:${minuteValue}:00`);
    this.setState({
      inputValue: `${hourValue}:${minuteValue}`,
      hourValue,
      minuteValue
    });
  }

  handleHourChange(event: Object) {
    const newVal = parseInt(event.target.value, 10);
    if (!isNaN(newVal) && newVal < 24) {
      this.handleChangedValue(this.intToString(newVal), this.state.minuteValue);
    }
  }

  handleMinuteChange(event: Object) {
    const newVal = parseInt(event.target.value, 10);
    if (!isNaN(newVal) && newVal < 60) {
      this.setState({ minuteValue: this.intToString(newVal) });
      this.handleChangedValue(this.state.hourValue, this.intToString(newVal));
    }
  }

  intToString(num: number): string {
    if (num < 10) {
      return `0${num}`;
    }
    return num.toString();
  }

  incrementHourValue(e: Event) {
    e.stopPropagation();
    const hourValue = parseInt(this.state.hourValue, 10);
    let newHourValue = null;
    if (hourValue === 23) {
      newHourValue = "00";
    }
    else {
      newHourValue = this.intToString(hourValue + 1);
    }
    this.handleChangedValue(newHourValue, this.state.minuteValue);
  }

  decrementHourValue(e: Event) {
    e.stopPropagation();
    const hourValue = parseInt(this.state.hourValue, 10);
    let newHourValue = null;
    if (hourValue === 0) {
      newHourValue = "23";
    }
    else {
      newHourValue = this.intToString(hourValue - 1)
    }
    this.handleChangedValue(newHourValue, this.state.minuteValue);
  }

  incrementMinuteValue(e: Event) {
    e.stopPropagation();
    let newMinuteValue = null;
    const minuteValue = parseInt(this.state.minuteValue, 10);
    if (minuteValue === 59) {
      newMinuteValue = "00";
    }
    else {
      newMinuteValue = this.intToString(minuteValue + 1);
    }
    this.handleChangedValue(this.state.hourValue, newMinuteValue);
  }

  decrementMinuteValue(e: Event) {
    e.stopPropagation();
    let newMinuteValue = null;
    const minuteValue = parseInt(this.state.minuteValue, 10);
    if (minuteValue === 0) {
      newMinuteValue = "59";
    }
    else {
      newMinuteValue = this.intToString(minuteValue - 1);
    }
    this.handleChangedValue(this.state.hourValue, newMinuteValue);
  }

  render() {
    const { name, label, small, error, classes } = this.props;
    const { hasFocus, inputValue } = this.state;
    const timepickerClassNames = classNames({
      [classes.timePicker]: true,
      [classes.timePickerNoLabel]: !label
    });
    return (
      <div className={classes.outerContainer}>
        <div className={classes.innerContainer}
          ref={(node) => (this.wrapperRef = node)}>
          <TextInput
            name={name}
            className={classes.timeInput}
            placeholder={this.props.t('i18n.timePlaceHolder')}
            small={small}
            label={label}
            error={error}
            smallLabel
            readOnly
            value={inputValue}
            onFocus={this.handleOnFocus.bind(this)}
          />
          <ReactCSSTransitionGroup
            transitionName="fade-in-and-out"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {hasFocus &&
              <div className={timepickerClassNames} >
                <div className={classes.timePickerInputContainer}>
                  <div className={classes.timePickerIcon}
                    onClick={this.incrementHourValue} >
                    <Icon type="upArrow" />
                  </div>
                  <input
                    type="text"
                    name="hourValue"
                    className={classes.timePickerInput}
                    value={this.state.hourValue}
                    onChange={this.handleHourChange}
                  />
                  <div className={classes.timePickerIcon}
                    onClick={this.decrementHourValue} >
                    <Icon type="downArrow" />
                  </div>
                </div>
                <div className={classes.timePickerSeparator}>:</div>
                <div className={classes.timePickerInputContainer}>
                  <div className={classes.timePickerIcon}
                    onClick={this.incrementMinuteValue} >
                    <Icon type="upArrow" />
                  </div>
                  <input
                    type="text"
                    name="minuteValue"
                    className={classes.timePickerInput}
                    value={this.state.minuteValue}
                    onChange={this.handleMinuteChange}
                  />
                  <div className={classes.timePickerIcon}
                    onClick={this.decrementMinuteValue} >
                    <Icon type="downArrow" />
                  </div>
                </div>
              </div>
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}

const TimeInputHOC = translate()(injectSheet(styles)(TimeInput));

export default TimeInputHOC;


/* Redux Form Wrapper */

type RFProps = {
  input: {
    value: string,
    onChange: Function,
    name: string,
  },
  meta: { error: any },
  label?: ReactElement,
  small?: boolean
}

export const TimeInputRF = (props: RFProps) => {
  const { input, meta, ...restProps } = props;
  return (
    <TimeInputHOC
      value={input.value}
      onChange={input.onChange}
      name={input.name}
      error={meta.error}
      {...restProps}
    />
  )
};