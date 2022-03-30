import { AddIcon } from 'components/icons';
import { createUseStyles, useTheme } from 'react-jss';
import classNames from 'classnames';
import CheckMarkIcon from 'components/icons/CheckMarkIcon';

const useStyles = createUseStyles((theme: any) => ({
  buttonAdd: {
    composes: '$button $buttonText',
    gridArea: 'add',
    '&:hover': {
      '& circle': {
        fill: theme.colors.lightTurquoise,
        stroke: theme.colors.darkTurquoise,
      },
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

interface AddButtonProps {
  buttonText?: string;
  checkMark?: boolean;
  disabled?: boolean;
  large?: boolean;
  onClick: () => void;
  title: string;
}

export default function AddButton({
  buttonText,
  checkMark = false,
  disabled = false,
  large = false,
  onClick,
  title,
}: AddButtonProps) {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <button
      className={classNames({
        [classes.buttonAdd]: true,
        'button-no-style': true,
      })}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <div className={classes.buttonContent}>
        {checkMark ? (
          <CheckMarkIcon title={title} large={large} />
        ) : (
          <AddIcon disabled={disabled} title={title} large={large} />
        )}

        {buttonText && <div className={classes.buttonText}>{buttonText}</div>}
      </div>
    </button>
  );
}
