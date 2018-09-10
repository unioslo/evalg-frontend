/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import ActionText from 'components/actiontext';
import { Trans } from 'react-i18next';;
import Text from 'components/text';

type Props = {
  children?: ReactChildren,
  header?: string | ReactChildren,
  active?: boolean,
  setActive?: Function,
  noBorder?: boolean,
  noBtmPadding?: boolean,
  desc?: ReactElement | string,
  classes: Object
}

const styles = theme => ({
  section: {
    padding: `2rem ${theme.contentHorPadding} 2rem`,
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      padding: `4rem ${theme.contentHorMdPadding} 4rem`,
      borderBottom: `10px solid ${theme.contentSectionBorderColor}`
    },
    color: theme.colors.greyishBrown
  },
  noBorder: {
    border: 0
  },
  noBtmPadding: {
    paddingBottom: 0
  },
  noTopPadding: {
    paddingTop: 0
  },
  top: {
    marginBottom: '3rem',
    '& + p, & + $subSection': {
      marginTop: 0
    }
  },
  topHeader: {
    color: theme.colors.greyishBrown,
    fontSize: '2.4rem',
    fontWeight: 'bold',
    alignItems: 'baseline',
    display: 'inline-block',
    marginRight: '2rem',
  },
  topAction: {
    display: 'inline-block',
  },
  topDescription: {
    display: 'block',
    margin: '3rem 0 3rem',
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
  }
});

const PageSection = (props: Props) => {
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
              <ActionText action={setActive} bottom>
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

type SubProps = {
  children?: ReactChildren,
  header: ReactElement,
  notBoldHeader?: boolean,
  classes: Object
};

const PageSubSection = (props: SubProps) => {
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