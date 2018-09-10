/* @flow */
import * as React from 'react';
import DropDownBase from 'components/baseComponents/DropDownBase';
import injectSheet from 'react-jss';

const styles = theme => ({
  autoCompleteDropDown: {
    position: 'relative',
    fontSize: '1.4rem',
    minWidth: '20rem',
    display: 'flex',
    alignItems: 'center',
    marginTop: '1.5rem',
  },
  input: {
    border: `2px solid ${theme.formFieldBorderColor}`,
    height: '3rem',
    borderRadius: '0.3rem',
    fontSize: '1.4rem',
    paddingLeft: '1rem',
    '&:focus': {
      borderColor: theme.formFieldBorderActiveColor
    }
  },
  button: {
    marginLeft: '1.5rem',
    background: theme.colors.white,
    borderRadius: '0.4rem',
    border: `2px solid ${theme.colors.lightBlueGray}`,
    transition: 'border-color 200ms ease-in, color 200ms ease-in',
    width: '7.5rem',
    height: '3rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer'
    },
    '&:disabled': {
      cursor: 'not-allowed',
      borderColor: theme.colors.veryLightGray
    }
  },
  list: {
    position: 'absolute',
    top: '3.3rem',
    listStyleType: 'none',
    background: theme.colors.white,
    border: `1px solid ${theme.formFieldBorderColor}`,
    borderRadius: '0.3rem',
  },
  listItem: {
      lineHeight: 2,
      borderTop: `1px solid ${theme.formFieldBorderColor}`,
      padding: '0 1rem',
      minWidth: '20rem',
      '&:first-child': {
        borderTop: 0
      },
      '&:hover': {
        background: theme.colors.lightBlueGray,
        cursor: 'pointer'
      }
    }
})

const filterObjects = (objects: Array<Object>,
                       filter: string,
                       filterOn: Array<string>) => {
  // We don't want to return anything if the user hasn't typed in a filter yet.
  if (filter === '') {
    return [];
  }
  return objects.filter(obj => {
    for (let i = 0; i < filterOn.length; i++) {
      let value = '';
      if (typeof filterOn[i] === 'string') {
        value = obj[filterOn[i]];
      }
      else if (Array.isArray(filterOn[i])) {
        const values = filterOn[i].map(attr => obj[attr]);
        value = values.join(' ');
      }
      if (typeof value === 'string' && value.toLowerCase().includes(filter)) {
        return true;
      }
    }
    return false;
  })
};

type Props = {
  userInput: string,
  objects: Array<Object>,
  objRenderer: Function,
  onChange: Function,
  buttonAction: Function,
  buttonText: ReactElement | string,
  classes: Object
}

class AutoCompleteDropDown extends DropDownBase {
  props: Props;

  componentWillReceiveProps(newProps: Props) {
    this.setState({ open: newProps.objects.length > 0 && !!this.props.userInput})
  }

  handleSelect(obj: Object) {
    this.setState({ selected: obj});
  }

  handleOnChange(e: any) {
    this.props.onChange(e.target.value);
    this.setState({ selected: null });
  }

  handleButtonClick() {
    if (this.state.selected) {
      this.props.buttonAction(this.state.selected);
    }
    this.props.onChange('');
    this.setState({ selected: null, open: false });
  }

  render() {
    const {
      userInput, objRenderer, buttonText, classes
    } = this.props;
    const { selected } = this.state;
    return (
      <div className={classes.autoCompleteDropDown}>
        <input type="text"
               className={classes.input}
               value={ selected ? objRenderer(selected) : userInput }
               onChange={ this.handleOnChange.bind(this) } />
        <button
          onClick={ this.handleButtonClick.bind(this) }
          className={classes.button}
          disabled={!this.state.selected}>
          { buttonText }
        </button>
        {!this.state.selected && this.state.open &&
          <ul className={classes.list}>
            {this.props.objects.map((obj, index) => {
              return (
                <li key={index}
                    className={classes.listItem}
                    onClick={ this.handleSelect.bind(this, obj) }>
                  { objRenderer(obj) }
                </li>
              )
            })}
          </ul>
        }
      </div>
    )
  }
}

export default injectSheet(styles)(AutoCompleteDropDown);