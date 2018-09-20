import * as React from 'react';
import { Trans } from 'react-i18next';
import injectSheet from 'react-jss';

import Icon from 'components/icon';
import { InfoList, InfoListItem } from 'components/infolist'
import { PageSubSection } from 'components/page';
import { ScreenSizeConsumer } from 'providers/ScreenSize';

const styles = (theme: any) => ({
  header: theme.subSectionHeader,
  headerContainer: {
    alignItems: 'center',
    display: 'flex',
  },
  helpTexts: {
    marginTop: '2rem'
  },
  iconContainer: {
    cursor: 'pointer',
    marginBottom: '1rem',
    marginLeft: '1rem',
  }
});

interface IHelpSubProps {
  classes: any,
  header: React.ReactNode
  helpTextTags: string[]
  desc: React.ReactNode
}

interface IHelpSubState {
  showHelpTexts: boolean
}


class HelpSubSection extends React.Component<IHelpSubProps, IHelpSubState> {
  constructor(props: IHelpSubProps) {
    super(props);
    this.state = { showHelpTexts: false };
    this.toggleShowHelpTexts = this.toggleShowHelpTexts.bind(this);
  }

  public render() {
    return (
      <ScreenSizeConsumer>
        {({ screenSize }) => {
          const { classes } = this.props;
          const Header = () => (
            <div className={classes.headerContainer}>
              <h3 className={classes.header}>{this.props.header}</h3>
              <div className={classes.iconContainer}>
                <Icon
                  type="help"
                  onClick={this.toggleShowHelpTexts}
                  custom={screenSize !== 'sm' ? 'small' : false}
                />
              </div>
            </div>
          )
          return (
            <PageSubSection header={<Header />} customHeader={true}>
              {this.props.desc}
              {this.state.showHelpTexts ?
                <div className={classes.helpTexts}>
                  <InfoList>
                    {this.props.helpTextTags.map((text, index) => (
                      <InfoListItem key={index} bulleted={true} noLeftMargin={true}>
                        <Trans>{text}</Trans>
                      </InfoListItem>
                    ))}
                  </InfoList>
                </div> : null
              }
              {this.props.children}
            </PageSubSection>
          )
        }}
      </ScreenSizeConsumer>
    )
  }

  private toggleShowHelpTexts() {
    this.setState({ showHelpTexts: !this.state.showHelpTexts });
  }
}

export default injectSheet(styles)(HelpSubSection);