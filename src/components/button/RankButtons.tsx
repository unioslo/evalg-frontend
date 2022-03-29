import { DownArrowIcon, UpArrowIcon } from 'components/icons';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';

interface StylesProps {
  disabled: boolean;
}

const useStyles = createUseStyles({
  rankButton: {
    composes: '$button $buttonText',
    gridArea: 'add',
    '&:hover': {
      cursor: (props: StylesProps) => (props.disabled ? 'grab' : 'pointer'),
    },
    marginRight: '2rem',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: '1rem',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

interface RankButtonsProps {
  onRankUp: () => void;
  onRankDown: () => void;
  titleDown: string;
  titleUp: string;
  buttonText?: string;
  first: boolean;
  last: boolean;
}

export default function RankButtons({
  onRankDown,
  onRankUp,
  titleDown,
  titleUp,
  buttonText,
  first,
  last,
}: RankButtonsProps) {
  const classes = useStyles({ disabled: first || last });

  return (
    <div className={classes.buttons}>
      <button
        className={classNames({
          [classes.rankButton]: true,
          'button-no-style': true,
        })}
        onClick={(e) => {
          e.preventDefault();
          onRankUp();
        }}
        disabled={first}
      >
        <div className={classes.buttonContent}>
          <UpArrowIcon title={titleUp} disabled={first} />
          {buttonText && <div className={classes.buttonText}>{buttonText}</div>}
        </div>
      </button>
      <button
        className={classNames({
          [classes.rankButton]: true,
          'button-no-style': true,
        })}
        onClick={(e) => {
          e.preventDefault();
          onRankDown();
        }}
        disabled={last}
      >
        <div className={classes.buttonContent}>
          <DownArrowIcon title={titleDown} disabled={last} />
          {buttonText && <div className={classes.buttonText}>{buttonText}</div>}
        </div>
      </button>
    </div>
  );
}
