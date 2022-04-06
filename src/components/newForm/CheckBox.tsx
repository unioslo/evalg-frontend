import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';
import { FieldRenderProps } from 'react-final-form';

const useStyles = createUseStyles((theme: any) => ({
  checkBoxAndLabel: {
    position: 'relative',
    top: '3px',
  },
  checkBox: {
    display: 'inline-block',
    position: 'relative',
    width: '2.1rem',
    height: '2.1rem',
    marginRight: '2rem',
    verticalAlign: 'super',
    float: 'left',
    top: '-3px',
    '& input[type=checkbox]:checked + label > $icon': {
      visibility: 'visible',
    },
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
    '&.disabled': {
      borderColor: theme.colors.lightGray,
    },
  },
  icon: {
    visibility: 'hidden',
    position: 'absolute',
    top: '-0.2rem',
    left: '-0.2rem',
  },
  iconBg: {
    fill: theme.colors.darkTurquoise,
    '&.disabled': {
      fill: theme.colors.lightGray,
    },
  },
  iconCheckMark: {
    fill: theme.colors.white,
  },
  label: {
    verticalAlign: 'bottom',
    '&:hover': {
      cursor: 'pointer',
    },
    '&.disabled': {
      color: theme.colors.lightGray,
    },
  },
}));

interface CheckBoxProps extends FieldRenderProps<string, any> {
  label?: any;
  disabled?: boolean;
}

export default function CheckBox(props: CheckBoxProps) {
  const { disabled, label, input } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <div className={classes.checkBoxAndLabel}>
      <div className={classes.checkBox}>
        <input
          name={input.name}
          id={input.name}
          type="checkbox"
          value={input.value}
          checked={input.checked}
          onChange={input.onChange}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          disabled={disabled}
        />
        <label
          htmlFor={input.name}
          className={classNames({
            [classes.iconContainer]: true,
            disabled,
          })}
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            className={classes.icon}
          >
            <path
              className={classNames({
                [classes.iconBg]: true,
                disabled,
              })}
              d="M3.009 0A3.008 3.008 0 0 0 0 3.009V17.99A3.008 3.008
                     0 0 0 3.009 21H17.99A3.002 3.002 0 0 0 21
                     17.997V3.006A3.006 3.006 0 0 0 17.991 0H3.01z"
            />
            <path
              className={classes.iconCheckMark}
              d="M4 12.14l4.888 4.9 9.544-9.567L15.958
                     5l-7.081 7.082-2.404-2.415"
            />
          </svg>
        </label>
      </div>
      <label
        htmlFor={input.name}
        className={classNames({
          [classes.label]: true,
          disabled,
        })}
      >
        {label}
      </label>
    </div>
  );
}

CheckBox.defaultProps = {
  label: '',
  disabled: false,
};
