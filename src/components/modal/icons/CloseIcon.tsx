import React from 'react';
import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  closeIconCircle: {
    fill: theme.closeIconColor,
  },
  closeIconLine: {
    fill: theme.colors.white,
  },
}));

interface IProps {
  closeAction: (a: any) => void;
}

const CloseIcon: React.FunctionComponent<IProps> = ({ closeAction }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles({ theme });

  return (
    <button className="button-no-style" onClick={closeAction}>
      <svg width="19px" height="19px" viewBox="0 0 19 19">
        <g
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
          className={classes.closeIconCircle}
        >
          <circle cx="9.5" cy="9.5" r="9.5" />
          <rect
            className={classes.closeIconLine}
            transform="translate(9.500000, 9.500000) rotate(45.000000) translate(-9.500000, -9.500000) "
            x="8"
            y="2.5"
            width="3"
            height="14"
            rx="0.8"
          />
          <rect
            className={classes.closeIconLine}
            transform="translate(9.500000, 9.500000) rotate(-45.000000) translate(-9.500000, -9.500000) "
            x="8"
            y="2.5"
            width="3"
            height="14"
            rx="0.8"
          />
        </g>
        <title>{t('icons.close')}</title>
      </svg>
    </button>
  );
};

export default CloseIcon;
