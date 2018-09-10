/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';

const styles = theme => ({
  checkBox: {
    display: 'inline-block',
    position: 'relative',
    width: '2.1rem',
    height: '2.1rem',
    marginRight: '2rem',
    verticalAlign: 'super',
    '& input[type=checkbox]:checked + label > $icon': {
      visibility: 'visible'
    }
  },
  iconContainer: {
    display: 'inline-block',
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '2.1rem',
    height: '2.1rem',
    border: `0.2rem solid ${theme.colors.darkTurquoise}`,
    borderRadius: theme.formFieldBorderRadius,
  },
  icon: {
    visibility: 'hidden',
    position: 'absolute',
    top: '-0.2rem',
    left: '-0.2rem',
  },
  iconBg: {
    fill: theme.colors.darkTurquoise
  },
  iconCheckMark: {
    fill: theme.colors.white
  },
  label: {
    display: 'inline-block',
    fontSize: '1.6rem',
    lineHeight: '2.1rem',
    verticalAlign: 'bottom'
  }
})

type Props = {
  name: string,
  onChange: Function,
  id: string,
  value: boolean,
  label: ReactElement | string,
  classes: Object
};

const CheckBox = (props: Props) => {
  const { name, onChange, id, value, label, classes } = props;
  return (
    <div>
      <div className={classes.checkBox}>
        <input type="checkbox"
               name={ name }
               id={ id }
               checked={ !!value }
               onChange={ onChange } />
        <label htmlFor={ name } className={classes.iconContainer}>
          <svg width="21" height="21" viewBox="0 0 21 21"
               className={classes.icon}>
            <path className={classes.iconBg}
                  d="M3.009 0A3.008 3.008 0 0 0 0 3.009V17.99A3.008 3.008
                     0 0 0 3.009 21H17.99A3.002 3.002 0 0 0 21
                     17.997V3.006A3.006 3.006 0 0 0 17.991 0H3.01z"/>
            <path className={classes.iconCheckMark}
                  d="M4 12.14l4.888 4.9 9.544-9.567L15.958
                     5l-7.081 7.082-2.404-2.415" />
          </svg>
        </label>
      </div>
      <label htmlFor={ name } className="checkbox--label">{ label }</label>
    </div>
  )
};


const StyledCheckBox = injectSheet(styles)(CheckBox);

type RFProps = {
  input: {
    name: string,
    onChange: Function,
    value: boolean
  },
  label: ReactElement | string,
  classes: Object
}

const CheckBoxRF = (props: RFProps) => {
  const { input, label, classes } = props;
  return (
    <CheckBox
      name={ input.name }
      onChange={ input.onChange }
      id={ input.name }
      value={ input.value }
      label={ label }
      classes={classes}
    />
  );
};

const StyledCheckBoxRF = injectSheet(styles)(CheckBoxRF);

export {
  StyledCheckBox as CheckBox,
  StyledCheckBoxRF as CheckBoxRF
}