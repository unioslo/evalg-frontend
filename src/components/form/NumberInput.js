/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

const styles = theme => ({
  numberInput: {
    height: '3.5rem',
    width: '5.3rem',
    border: `${theme.formFieldBorder} ${theme.formFieldBorderColor}`,
    borderRadius: theme.formFieldBorderRadius,
    textAlign: 'center',
    fontSize: '1.6rem',
    color: theme.colors.greyishBrown,
    '&:disabled': {
      background: theme.colors.mediumWhite
    }
  }
})

type Props = {
  name: string,
  disabled: boolean,
  value: number,
  onChange: Function,
  classes: Object
}

type State = {
  value: string | null
}

class NumberInput extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({ value: `${this.props.value}` });
  }

  handleOnChange(event: Object) {
    const val = event.target.value;
    if (val === '') {
      this.setState({ value: '0' });
      this.props.onChange('0')
    }
    else if (!isNaN(parseInt(val, 10))) {
      const newVal = `${parseInt(val, 10)}`;
      this.setState({ value: newVal });
      this.props.onChange(newVal);
    }
  }

  render() {
    const { name, disabled } = this.props;
    return (
      <input type="text"
        name={name}
        value={this.state.value}
        onChange={this.handleOnChange.bind(this)}
        className={this.props.classes.numberInput}
        disabled={disabled}
      />
    )
  }
}

const StyledNumberInput = injectSheet(styles)(NumberInput);

export default StyledNumberInput;


type RFProps = {
  input: {
    onChange: Function,
    name: string,
    value: number
  },
  disabled: boolean
}

export const NumberInputRF = (props: RFProps) => {
  const { input, disabled } = props;
  return (
    <StyledNumberInput
      name={input.name}
      value={input.value}
      onChange={input.onChange}
      disabled={disabled}
    />
  )
};