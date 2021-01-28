import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

import Icon from 'components/icon';
import { InfoList, InfoListItem } from 'components/infolist';
import { PageSubSection } from 'components/page';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

const styles = (theme: any) => ({
  header: theme.subSectionHeader,
  headerContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  helpTexts: {
    marginTop: '2rem',
  },
  iconContainer: {
    cursor: 'pointer',
    marginBottom: '1rem',
    marginLeft: '1rem',
  },
});

interface IHelpSubProps {
  classes: Classes;
  header: React.ReactNode;
  helpTextTags: string[];
  helpText?: string[];
  desc?: React.ReactNode;
}

const HelpSubSection: React.FunctionComponent<IHelpSubProps> = props => {
  const [showHelpTexts, setShowHelpTexts] = useState<boolean>(false);

  const { classes, children, desc, header, helpTextTags, helpText } = props;
  const { t } = useTranslation();

  const toggleShowHelpTexts = () => {
    setShowHelpTexts(!showHelpTexts);
  };

  return (
    <ScreenSizeConsumer>
      {({ screenSize }) => {
        const Header = () => (
          <div className={classes.headerContainer}>
            <h3 className={classes.header}>{header}</h3>
            <div className={classes.iconContainer}>
              <Icon
                type="help"
                onClick={toggleShowHelpTexts}
                custom={
                  screenSize !== 'mobile' && screenSize !== 'sm'
                    ? 'small'
                    : false
                }
              />
            </div>
          </div>
        );
        return (
          <PageSubSection header={<Header />} customHeader>
            {desc}
            {showHelpTexts ? (
              <div className={classes.helpTexts}>
                <InfoList>
                  {helpText
                    ? helpText.map((text, index) => (
                        <InfoListItem key={index} bulleted noLeftMargin>
                          {text}
                        </InfoListItem>
                      ))
                    : helpTextTags.map((text, index) => (
                        <InfoListItem key={index} bulleted noLeftMargin>
                          {t(text)}
                        </InfoListItem>
                      ))}
                </InfoList>
              </div>
            ) : null}
            {children}
          </PageSubSection>
        );
      }}
    </ScreenSizeConsumer>
  );
};

export default injectSheet(styles)(HelpSubSection);
