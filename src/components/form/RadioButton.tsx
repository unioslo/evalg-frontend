import React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

const styles = (theme: any) => ({
  radioButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    marginBottom: '2rem',
  },
  input: {
    visibility: 'visible',
    width: '21px',
    height: '21px',
    margin: 0
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'url("/radiobg.svg") no-repeat left top',
    width: '21px',
    height: '21px'
  },
  checkedIcon: {
    background: 'url("/radiobg-selected.svg") no-repeat left 50%'
  },
  label: {
    fontSize: '1.6rem',
    paddingLeft: '0.5rem',
  }
});

interface IProps {
  name: string,
  onChange: (event: any) => void,
  id: string,
  value: any,
  checked: boolean,
  label: any | string,
  classes: Classes,
};

const RadioButton = (props: IProps) => {
  const { name, onChange, id, value, checked, label, classes } = props;
  const iconClassNames = classNames({
    [classes.icon]: true,
    [classes.checkedIcon]: checked
  });

  return (
    <div className={classes.radioButton}>
      <input type="radio"
        className={classes.input}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        checked={checked} />
      <label htmlFor={id}
        className={iconClassNames} />
      <label htmlFor={id}
        className={classes.label}>
        {label}
      </label>
    </div>
  )
};

const StyledRadioButton = injectSheet(styles)(RadioButton);
export { StyledRadioButton as RadioButton };

interface IGroupProps {
  input: any,
  options: Array<{
    label: any | string,
    id: string,
    value: any
  }>
}

interface IGroupState {
  value: any
}

export class RadioButtonGroup extends React.Component<IGroupProps, IGroupState> {
  // handleChange: Function;

  constructor(props: IGroupProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.setState({ value: this.props.input.value });
  }

  handleChange(value: any) {
    this.setState({ value });
    this.props.input.onChange(value);
  }

  render() {
    const { options, input } = this.props;
    return (
      <div>
        {options.map((option, index) => {
          return (
            <StyledRadioButton
              key={index}
              name={input.name}
              onChange={this.handleChange.bind(null, option.value)}
              checked={input.value === option.value}
              label={option.label}
              id={option.id}
              value={option.value}
            />
          )
        })}
      </div>
    )
  }
}

type RFProps = {
  input: {
    name: string,
    onChange: (event: any) => void,
    value: any,
  },
  checked: boolean,
  label: any | string,
  id: string
}

export const RadioButtonRF = (props: RFProps) => {
  const { input, checked, label, id } = props;
  return (
    <StyledRadioButton
      id={id}
      label={label}
      checked={checked}
      name={input.name}
      onChange={input.onChange}
      value={input.value}
    />
  );
};
