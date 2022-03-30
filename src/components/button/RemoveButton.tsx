import { RemoveIcon } from 'components/icons';
import { createUseStyles, useTheme } from 'react-jss';
import classNames from 'classnames';

interface StyleProps {
  marked: boolean;
}

const useStyles = createUseStyles((theme: any) => ({
  buttonRemove: {
    marginRight: '0.5rem',
    composes: '$button $buttonText',
    gridArea: 'remove',
    fill: (props: StyleProps) =>
      props.marked ? theme.colors.lightTurquoise : theme.colors.white,
    '&:hover': {
      fill: (props: StyleProps) =>
        props.marked ? theme.colors.white : theme.colors.lightTurquoise,
    },
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: '1rem',
  },
}));

interface RemoveButtonProps {
  onClick: () => void;
  title: string;
  large?: boolean;
  buttonText?: string;
  marked?: boolean;
}

export default function RemoveButton({
  onClick,
  large = false,
  title,
  buttonText,
  marked = false,
}: RemoveButtonProps) {
  const theme = useTheme();
  const classes = useStyles({ theme, marked });

  return (
    <>
      <button
        className={classNames({
          [classes.buttonRemove]: true,
          'button-no-style': true,
        })}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        <div className={classes.buttonContent}>
          <RemoveIcon color="teal" large={large} title={title} />
          {buttonText && <div className={classes.buttonText}>{buttonText}</div>}
        </div>
      </button>
    </>
  );
}
