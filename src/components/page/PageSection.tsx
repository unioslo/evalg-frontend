import classNames from 'classnames';
import * as React from 'react';
import injectSheet from 'react-jss';

import ActionText from 'components/actiontext';
import { Trans } from 'react-i18next';;
import Text from 'components/text';

interface IProps {
  children?: React.ReactNode,
  classes: any,
  header?: React.ReactNode,
  active?: boolean,
  setActive?: () => void,
  noBorder?: boolean,
  noBtmPadding?: boolean,
  desc?: React.ReactNode
}

const styles = (theme: any) => ({
  noBorder: {
    border: 0
  },
  noBtmPadding: {
    paddingBottom: 0
  },
  noTopPadding: {
    paddingTop: 0
  },
  section: {
    color: theme.colors.greyishBrown,
    padding: `2rem ${theme.contentHorPadding} 2rem`,
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      borderBottom: `10px solid ${theme.contentSectionBorderColor}`,
      padding: `4rem ${theme.contentHorMdPadding} 4rem`,
    },
  },
  subSection: {
    marginTop: '3rem',
  },
  subSectionHeader: {
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  subSectionHeaderRegular: {
    fontWeight: 'normal'
  },
  top: {
    '& + p, & + $subSection': {
      marginTop: 0
    },
    marginBottom: '3rem',
  },
  topAction: {
    display: 'inline-block',
  },
  topDescription: {
    display: 'block',
    margin: '3rem 0 3rem',
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

const PageSection: React.SFC<IProps> = (props) => {
  const {
    header, active, setActive, noBorder, noBtmPadding, desc, classes
  } = props;
  const cls = classNames({
    [classes.section]: true,
    [classes.noBorder]: noBorder,
    [classes.noBtmPadding]: noBtmPadding
  });
  const descClassNames = classNames({
    [classes.topDescription]: desc
  });
  return (
    <section className={cls}>
      {(header || (!active && setActive) || desc) &&
        <div className={classes.top}>
          {header &&
            <h2 className={classes.topHeader}>
              {header}
            </h2>
          }
          {!active && setActive &&
            <div className={classes.topAction}>
              <ActionText action={setActive} bottom={true}>
                <Trans>general.edit</Trans>
              </ActionText>
            </div>
          }
          {desc &&
            <div className={descClassNames}>
              <Text size="large">{desc}</Text>
            </div>
          }
        </div>
      }
      {props.children}
    </section>
  )
};

const StyledSection = injectSheet(styles)(PageSection);

interface ISubProps {
  classes: any,
  header: React.ReactNode,
  notBoldHeader?: boolean,
};

const PageSubSection: React.SFC<ISubProps> = (props) => {
  const { classes } = props;
  const headerClassNames = classNames({
    [classes.subSectionHeader]: true,
    [classes.subSectionHeaderRegular]: props.notBoldHeader,
  });
  return (
    <div className={classes.subSection}>
      <h3 className={headerClassNames}>{props.header}</h3>
      {props.children}
    </div>
  );
};

const StyledSubSection = injectSheet(styles)(PageSubSection);

export {
  StyledSection as PageSection,
  StyledSubSection as PageSubSection
}
