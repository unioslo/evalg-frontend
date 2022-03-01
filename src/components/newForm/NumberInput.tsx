import { useState } from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { FieldRenderProps } from 'react-final-form';

const useStyles = createUseStyles((theme: any) => ({
  numberInput: {
    height: '3.5rem',
    width: '5.3rem',
    border: `${theme.formFieldBorder} ${theme.formFieldBorderColor}`,
    borderRadius: theme.formFieldBorderRadius,
    textAlign: 'center',
    fontSize: '1.6rem',
    color: theme.colors.greyishBrown,
    '&:disabled': {
      background: theme.colors.mediumWhite,
    },
  },
}));

interface NumberInputProps extends FieldRenderProps<number, any> {
  defaultValue?: number;
  disabled?: boolean;
}

export default function NumberInput(props: NumberInputProps) {
  const { defaultValue, input, disabled } = props;

  const [currentValue, setCurrentValue] = useState<number>(input.value);

  const theme = useTheme();
  const classes = useStyles({ theme });

  const handleOnChange = (event: any) => {
    const val = event.target.value;
    if (val === '') {
      if (defaultValue) {
        setCurrentValue(defaultValue);
      } else {
        setCurrentValue(0);
      }
      input.onChange('0');
    } else if (!isNaN(parseInt(val, 10))) {
      const newVal = parseInt(val, 10);
      setCurrentValue(newVal);
      input.onChange(newVal);
    }
  };

  return (
    <input
      type="text"
      name={input.name}
      value={currentValue}
      onChange={handleOnChange}
      className={classes.numberInput}
      disabled={disabled}
    />
  );
}

NumberInput.defaultProps = {
  defaultValue: 0,
  disabled: false,
};
