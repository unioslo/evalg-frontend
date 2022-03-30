import { useTranslation } from 'react-i18next';
import { createUseStyles, useTheme } from 'react-jss';

import { CumulateIcon } from 'components/icons';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

const useCumulateStatusStyles = createUseStyles((theme: any) => ({
  content: {
    display: 'flex',
    alignItems: 'center',
    fill: theme.colors.lightTurquoise,
    justifyContent: 'flex-end',
    marginRight: '1rem',
  },
  text: {
    marginLeft: '1rem',
  },
  preCumulatedText: {
    marginLeft: '1rem',
    fontSize: '1.4rem',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
}));

interface CumulateStatusPros {
  cumulated: boolean;
  preCumulated: boolean;
}

export default function CumulateStatus(props: CumulateStatusPros) {
  const { cumulated, preCumulated } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useCumulateStatusStyles({ theme });

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => (
        <div className={classes.content}>
          {cumulated && <CumulateIcon large title={''} disabled={false} />}
          {screenSize !== 'mobile' && screenSize !== 'sm' && (
            <div className={classes.textContainer}>
              {cumulated && (
                <div className={classes.text}>
                  {t('listElec.ballot.cumulate')}
                </div>
              )}
              {preCumulated && (
                <div className={classes.preCumulatedText}>
                  {t('listElec.ballot.preCumulated')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </ScreenSizeConsumer>
  );
}
