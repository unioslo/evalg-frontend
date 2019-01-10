import * as React from 'react';
import { Trans } from 'react-i18next';

import ActionText from 'components/actiontext';
import Text from 'components/text';
import injectSheet from 'react-jss';

const styles = (theme: any) => ({
  section: {
    color: theme.colors.greyishBrown,
    padding: `${theme.contentVertPadding} ${theme.contentHorPadding}`,
    [theme.breakpoints.mdQuery]: {
      borderBottom: `10px solid ${theme.contentSectionBorderColor}`,
      padding: `${theme.contentVertMdPadding} ${theme.contentHorMdPadding}`,
    },
  },
  top: {
    marginBottom: '3rem',
  },
  topAction: {
    display: 'inline-block',
  },
  topDescription: {
    display: 'block',
    [theme.breakpoints.mdQuery]: {
      margin: '3rem 0',
    },
  },
  topHeader: {
    alignItems: 'baseline',
    color: theme.colors.greyishBrown,
    display: 'inline-block',
    fontSize: '2.4rem',
    fontWeight: 'bold',
    marginRight: '2rem',
  },
});

export type activeStatusType = 'minimized' | 'active' | 'inactive';

interface IProps {
  header: React.ReactNode;
  desc?: React.ReactNode;
  activeStatus: activeStatusType;
  setActive: () => void;
  activeElement: React.ReactNode;
  inactiveElement: React.ReactNode;
  classes: any;
}

const SettingsSection: React.SFC<IProps> = props => {
  const {
    desc,
    header,
    classes,
    activeStatus,
    setActive,
    activeElement,
    inactiveElement,
  } = props;

  return (
    <section className={classes.section}>
      <div className={classes.top}>
        {header && <h2 className={classes.topHeader}>{header}</h2>}
        {activeStatus !== 'active' && setActive && (
          <div className={classes.topAction}>
            <ActionText action={setActive} bottom={true}>
              <Trans>general.edit</Trans>
            </ActionText>
          </div>
        )}
        {activeStatus === 'active' && desc && (
          <div className={classes.topDescription}>
            <Text size="large">{desc}</Text>
          </div>
        )}
      </div>
      {activeStatus !== 'minimized'
        ? activeStatus === 'active'
          ? activeElement
          : inactiveElement
        : null}
    </section>
  );
};

export default injectSheet(styles)(SettingsSection);
