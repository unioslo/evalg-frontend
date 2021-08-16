import React from 'react';
import { Trans } from 'react-i18next';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

import ActionText from 'components/actiontext';
import Text from 'components/text';

import { ElectionGroup } from 'interfaces';

const useStyles = createUseStyles((theme: any) => ({
  section: {
    color: theme.colors.greyishBrown,
    padding: `${theme.contentVertPadding} ${theme.contentHorPadding}`,
    [theme.breakpoints.mdQuery]: {
      '&:not(:last-child)': {
        borderBottom: `${theme.sectionBorderWidth} ${
          theme.sectionBorderStyle
        } ${theme.sectionBorderColor}`,
      },
      padding: `${theme.contentVertMdPadding} ${theme.contentHorMdPadding}`,
    },
  },
  topMarginBottom: {
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
  title: {
    alignItems: 'baseline',
    color: theme.colors.greyishBrown,
    display: 'inline-block',
    fontSize: '2.4rem',
    fontWeight: 'bold',
    marginRight: '2rem',
  },
}));

export type SettingsSectionDisplayStatus = 'minimized' | 'active' | 'inactive';

export interface ISettingsSectionContents {
  sectionName: string;
  activeComponent: React.FunctionComponent<IActiveComponentProps>;
  inactiveComponent: React.FunctionComponent<IInactiveComponentProps>;
  header: React.ReactNode;
  description: React.ReactNode;
}

export interface IActiveComponentProps {
  electionGroupData: ElectionGroup;
  submitAction: () => void;
  closeAction: () => void;
}

export interface IInactiveComponentProps {
  electionGroupData: ElectionGroup;
}

interface IProps {
  sectionIndex: number;
  settingsSectionContents: ISettingsSectionContents;
  electionGroupData: ElectionGroup;
  displayStatus: SettingsSectionDisplayStatus;
  onSetActive: (sectionIndex: number) => void;
  onSubmitSettingsSection: () => void;
  onCloseSettingsSection: () => void;
}

const SettingsSection: React.FunctionComponent<IProps> = props => {
  const {
    sectionIndex,
    settingsSectionContents: { header, description },
    electionGroupData,
    displayStatus,
    onSetActive,
    onSubmitSettingsSection,
    onCloseSettingsSection,
  } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

  const handleSetActive = () => {
    onSetActive(sectionIndex);
  };

  const topClasses = classNames({
    [classes.topMarginBottom]: displayStatus !== 'minimized',
  });

  const sectionTop = (
    <div className={topClasses}>
      {header && <h2 className={classes.title}>{header}</h2>}
      {displayStatus !== 'active' && onSetActive && (
        <div className={classes.topAction}>
          <ActionText action={handleSetActive} bottom>
            <Trans>general.edit</Trans>
          </ActionText>
        </div>
      )}
      {displayStatus === 'active' && description && (
        <div className={classes.topDescription}>
          <Text size="large">{description}</Text>
        </div>
      )}
    </div>
  );

  const sectionContent =
    displayStatus === 'active' ? (
      <props.settingsSectionContents.activeComponent
        electionGroupData={electionGroupData}
        submitAction={onSubmitSettingsSection}
        closeAction={onCloseSettingsSection}
      />
    ) : displayStatus === 'inactive' ? (
      <props.settingsSectionContents.inactiveComponent
        electionGroupData={electionGroupData}
      />
    ) : null;

  return (
    <section className={classes.section}>
      {sectionTop}
      {sectionContent}
    </section>
  );
};

export default SettingsSection;
