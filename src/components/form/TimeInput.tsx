import * as React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import Icon from '../icon';
import TextInput from './TextInput';
import { Classes } from 'jss';
import { WithTranslation, withTranslation } from 'react-i18next';

const styles = (theme: any) => ({
  outerContainer: {
    width: '9.6rem',
  },
  innerContainer: {
    position: 'relative',
    '&:focus': {
      outlineWidth: '0rem',
    },
  },
  timeInput: {
    background: 'url("/clock.svg") no-repeat 90% 50%',
    backgroundSize: '16px 16px',
    '&:focus': {
      outlineWidth: '0rem',
    },
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
    textAlign: 'center',
  },
  timePickerNoLabel: {
    top: '4.6rem',
  },
  timePickerInputContainer: {
    margin: '0.8rem 0.5rem',
    textAlign: 'center',
    display: 'inline-block',
    '&:first-child': {
      marginLeft: 0,
    },
    '&:last-child': {
      marginRight: 0,
    },
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
      transition: `border-color ${theme.formFieldFocusTransition}`,
    },
  },
  timePickerSeparator: {
    position: 'relative',
    fontSize: '2.5rem',
    display: 'inline-block',
    top: '-3.5rem',
  },
  timePickerIcon: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    height: '1.8rem',
    justifyContent: 'center',
  },
});

interface IProps extends WithTranslation {
  value: string;
  onChange: (event: any) => void;
  name: string;
  label?: any;
  small?: boolean;
  error?: any;
  classes: Classes;
}

interface IState {
  hourValue: string;
  minuteValue: string;
  hasFocus: boolean;
  inputValue: any;
}

class TimeInput extends React.Component<IProps, IState> {
  wrapperRef: any;
  timeoutID: any;
  hourInput: any;
  minuteInput: any;
  // handleClickOutside: Function;
  // handleHourChange: Function;
  // handleMinuteChange: Function;
  // incrementHourValue: Function;
  // decrementHourValue: Function;
  // incrementMinuteValue: Function;
  // decrementMinuteValue: Function;

  constructor(props: IProps) {
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
      hourValue: '',
      minuteValue: '',
      inputValue: '',
    };
    this.hourInput = React.createRef();
    this.minuteInput = React.createRef();
  }

  componentWillMount() {
    if (this.props.value.length === 5) {
      const hrMinValues = this.props.value.split(':');
      this.setState({
        hourValue: hrMinValues[0],
        minuteValue: hrMinValues[1],
        inputValue: `${hrMinValues[0]}:${hrMinValues[1]}`,
      });
    } else {
      this.setState({
        hourValue: '00',
        minuteValue: '00',
        inputValue: '',
      });
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event: any) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ hasFocus: false });
    }
  }

  handleOnFocus() {
    clearTimeout(this.timeoutID);
    if (!this.state.hasFocus) {
      this.setState({ hasFocus: true });
      this.timeoutID = setTimeout(() => {
        this.hourInput.current.select();
      }, 0);
    }
  }

  handleOnBlur() {
    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      this.setState({ hasFocus: false });
    }, 0);
  }

  handleChangedValue(hourValue: any, minuteValue: any) {
    this.props.onChange(`${hourValue}:${minuteValue}:00`);
    this.setState({
      inputValue: `${hourValue}:${minuteValue}`,
      hourValue,
      minuteValue,
    });
  }

  handleHourChange(event: any) {
    const newVal = parseInt(event.target.value, 10);
    if (!isNaN(newVal) && newVal < 24) {
      this.handleChangedValue(this.intToString(newVal), this.state.minuteValue);
    }
  }

  handleMinuteChange(event: any) {
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

  incrementHourValue(event: any) {
    event.stopPropagation();
    const hourValue = parseInt(this.state.hourValue, 10);
    let newHourValue = null;
    if (hourValue === 23) {
      newHourValue = '00';
    } else {
      newHourValue = this.intToString(hourValue + 1);
    }
    this.handleChangedValue(newHourValue, this.state.minuteValue);
  }

  decrementHourValue(event: any) {
    event.stopPropagation();
    const hourValue = parseInt(this.state.hourValue, 10);
    let newHourValue = null;
    if (hourValue === 0) {
      newHourValue = '23';
    } else {
      newHourValue = this.intToString(hourValue - 1);
    }
    this.handleChangedValue(newHourValue, this.state.minuteValue);
  }

  incrementMinuteValue(event: any) {
    event.stopPropagation();
    let newMinuteValue = null;
    const minuteValue = parseInt(this.state.minuteValue, 10);
    if (minuteValue === 59) {
      newMinuteValue = '00';
    } else {
      newMinuteValue = this.intToString(minuteValue + 1);
    }
    this.handleChangedValue(this.state.hourValue, newMinuteValue);
  }

  decrementMinuteValue(event: any) {
    event.stopPropagation();
    let newMinuteValue = null;
    const minuteValue = parseInt(this.state.minuteValue, 10);
    if (minuteValue === 0) {
      newMinuteValue = '59';
    } else {
      newMinuteValue = this.intToString(minuteValue - 1);
    }
    this.handleChangedValue(this.state.hourValue, newMinuteValue);
  }

  handleKeyDownHourValue = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.incrementHourValue(event);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrementHourValue(event);
    }
  };

  handleKeyDownMinuteValue = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.incrementMinuteValue(event);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrementMinuteValue(event);
    }
  };

  render() {
    const { name, label, small, error, classes } = this.props;
    const { hasFocus, inputValue } = this.state;
    const timepickerClassNames = classNames({
      [classes.timePicker]: true,
      [classes.timePickerNoLabel]: !label,
    });
    return (
      <div className={classes.outerContainer}>
        <div
          onFocus={this.handleOnFocus.bind(this)}
          onBlur={this.handleOnBlur.bind(this)}
          tabIndex={hasFocus ? -1 : 0}
          className={classes.innerContainer}
          ref={node => (this.wrapperRef = node)}
        >
          <TextInput
            name={name}
            className={classes.timeInput}
            placeholder={this.props.t('general.timePlaceHolder')}
            small={small}
            label={label}
            error={error}
            smallLabel
            tabIndex={-1}
            readOnly
            value={inputValue}
          />
          <TransitionGroup>
            <CSSTransition
              classNames="fade-in-and-out"
              timeout={{ enter: 500, exit: 500 }}
            >
              <div>
                {hasFocus && (
                  <div className={timepickerClassNames}>
                    <div className={classes.timePickerInputContainer}>
                      <div className={classes.timePickerIcon}>
                        <Icon
                          type="upArrowSmall"
                          onClick={this.incrementHourValue}
                          elementType="div"
                        />
                      </div>
                      <input
                        type="text"
                        name="hourValue"
                        ref={this.hourInput}
                        className={classes.timePickerInput}
                        value={this.state.hourValue}
                        onChange={this.handleHourChange}
                        onKeyDown={this.handleKeyDownHourValue}
                      />
                      <div className={classes.timePickerIcon}>
                        <Icon
                          type="downArrowSmall"
                          onClick={this.decrementHourValue}
                          elementType="div"
                        />
                      </div>
                    </div>
                    <div className={classes.timePickerSeparator}>:</div>
                    <div className={classes.timePickerInputContainer}>
                      <div className={classes.timePickerIcon}>
                        <Icon
                          type="upArrowSmall"
                          onClick={this.incrementMinuteValue}
                          elementType="div"
                        />
                      </div>
                      <input
                        type="text"
                        name="minuteValue"
                        ref={this.minuteInput}
                        className={classes.timePickerInput}
                        value={this.state.minuteValue}
                        onChange={this.handleMinuteChange}
                        onKeyDown={this.handleKeyDownMinuteValue}
                      />
                      <div className={classes.timePickerIcon}>
                        <Icon
                          type="downArrowSmall"
                          onClick={this.decrementMinuteValue}
                          elementType="div"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

const TimeInputHOC = withTranslation()(injectSheet(styles)(TimeInput));

export default TimeInputHOC;

/* Redux Form Wrapper */

interface IRFProps {
  input: {
    value: string;
    onChange: (event: any) => void;
    name: string;
  };
  meta: { error: any };
  label?: any;
  small?: boolean;
}

export const TimeInputRF = (props: IRFProps) => {
  const { input, meta, ...restProps } = props;
  return (
    <TimeInputHOC
      value={input.value}
      onChange={input.onChange}
      name={input.name}
      error={meta.error}
      {...restProps}
    />
  );
};
