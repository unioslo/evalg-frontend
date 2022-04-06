import { CumulateIcon } from 'components/icons';
import { createUseStyles, useTheme } from 'react-jss';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

interface StyleProps {
  marked: boolean;
  disabled: boolean;
}

const useStyles = createUseStyles((theme: any) => ({
  buttonRemove: {
    marginRight: '0.5rem',
    composes: '$button $buttonText',
    gridArea: 'remove',
    fill: (props: StyleProps) => {
      if (props.marked) {
        if (props.disabled) {
          return '#999999';
        }
        return theme.colors.lightTurquoise;
      }
      return theme.colors.white;
    },
  },
  disabled: {
    '&:hover': {
      cursor: 'not-allowed',
    },
  },
  hover: {
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
  preCumulatedText: {
    marginLeft: '1rem',
    fontSize: '1.1rem',
    fontStyle: 'italic',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
}));

interface CumulateButtonProps {
  onClick: () => void;
  title: string;
  large?: boolean;
  marked?: boolean;
  preCumulated?: boolean;
  disabled?: boolean;
}

export default function CumulateButton({
  onClick,
  large = false,
  title,
  marked = false,
  preCumulated = false,
  disabled = false,
}: CumulateButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme, disabled, marked });

  return (
    <>
      <button
        className={classNames({
          [classes.buttonRemove]: true,
          [classes.disabled]: disabled,
          [classes.hover]: !disabled,
          'button-no-style': true,
        })}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        disabled={disabled}
      >
        <div className={classes.buttonContent}>
          <CumulateIcon large={large} title={title} disabled={disabled} />
          <div className={classes.textContainer}>
            <div className={classes.buttonText}>
              {t('listElec.ballot.cumulate')}
            </div>
            {preCumulated && (
              <div className={classes.preCumulatedText}>
                {t('listElec.ballot.preCumulated')}
              </div>
            )}
          </div>
        </div>
      </button>
    </>
  );
}
