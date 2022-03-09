import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  logoBar: {
    display: 'flex',
    margin: '0 auto',
    maxWidth: theme.appMaxWidth,
    padding: `0 ${theme.horizontalPadding}`,
    [theme.breakpoints.mdQuery]: {
      padding: `0 ${theme.horizontalMdPadding}`,
    },
  },
  logoBarWrapper: {
    backgroundColor: theme.headerMainAreaColor,
  },
  logo: {
    marginTop: '2rem',
    height: '8rem',
    backgroundSize: 'contain',
  },
}));

export default function UiBLogoBar() {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const { i18n } = useTranslation();

  return (
    <div className={classes.logoBarWrapper}>
      <div className={classes.logoBar}>
        <a href="https://uib.no">
          <img
            className={classes.logo}
            src={
              i18n.language === 'en' ? '/uib/logo_en.png' : '/uib/logo_no.png'
            }
            alt="UiB logo"
          />
        </a>
      </div>
    </div>
  );
}
