import React, { useState } from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

import DropdownArrowIcon from 'components/icons/DropdownArrowIcon';

interface IProps {
  children?: React.ReactNode;
  classes: any;
  header?: React.ReactNode;
  noBorder?: boolean;
  noBtmPadding?: boolean;
  noTopPadding?: boolean;
  desc?: React.ReactNode;
}

const styles = (theme: any) => ({
  paragraph: {
    marginBottom: '4rem',
  },
  paragraphTitle: {
    fontSize: '1.8rem',
    fontWeight: 'normal',
    display: 'flex',
    alignItems: 'center',
  },
  section: {
    color: theme.colors.greyishBrown,
    padding: `${theme.contentVertPadding} ${theme.contentHorPadding}`,
    [theme.breakpoints.mdQuery]: {
      '&:not(:last-child)': {
        borderBottom: `${theme.sectionBorderWidth} ${
          theme.sectionBorderStyle
        } ${theme.sectionBorderColor}`,
      },
      padding: `4rem ${theme.contentHorMdPadding} 4rem`,
    },
  },
  noBtmPadding: {
    paddingBottom: 0,
  },
  noTopPadding: {
    paddingTop: 0,
  },
  noBorder: {
    border: '0 !important',
  },
  subSection: {
    marginTop: '3rem',
  },
  subSectionHeader: theme.subSectionHeader,
  subSectionHeaderRegular: {
    fontWeight: 'normal',
  },
  top: {
    '& + p, & + $subSection': {
      marginTop: 0,
    },
    marginBottom: '3rem',
  },
  topDescription: theme.ingress,
  topHeader: {
    alignItems: 'baseline',
    color: theme.colors.greyishBrown,
    display: 'inline-block',
    fontSize: '2.4rem',
    fontWeight: 'bold',
    marginRight: '2rem',
  },
  pointerOnHover: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const PageSection: React.SFC<IProps> = props => {
  const { header, noBorder, noBtmPadding, noTopPadding, desc, classes } = props;
  const cls = classNames({
    [classes.section]: true,
    [classes.noBorder]: noBorder,
    [classes.noBtmPadding]: noBtmPadding,
    [classes.noTopPadding]: noTopPadding,
  });
  const descClassNames = classNames({
    [classes.topDescription]: desc,
  });
  return (
    <section className={cls}>
      {(header || desc) && (
        <div className={classes.top}>
          {header && <h2 className={classes.topHeader}>{header}</h2>}
          {desc && <div className={descClassNames}>{desc}</div>}
        </div>
      )}
      {props.children}
    </section>
  );
};

const StyledSection = injectSheet(styles)(PageSection);

interface ISubProps {
  classes: any;
  header?: React.ReactNode;
  notBoldHeader?: boolean;
  customHeader?: boolean;
}

const PageSubSection: React.SFC<ISubProps> = props => {
  const { classes } = props;
  const headerClassNames = classNames({
    [classes.subSectionHeader]: true,
    [classes.subSectionHeaderRegular]: props.notBoldHeader,
  });
  return (
    <div className={classes.subSection}>
      {props.customHeader ? (
        props.header
      ) : (
        <h3 className={headerClassNames}>{props.header}</h3>
      )}
      {props.children}
    </div>
  );
};

const StyledSubSection = injectSheet(styles)(PageSubSection);

interface IExpandableSubSectionProps {
  classes: any;
  header: string;
  startExpanded?: boolean;
}

const PageExpandableSubSection: React.FunctionComponent<
  IExpandableSubSectionProps
> = props => {
  const { header, startExpanded, classes } = props;
  const topBarCls = classNames({
    [classes.pointerOnHover]: true,
  });

  const [isExpanded, setIsExpanded] = useState(startExpanded || false);

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={classes.subSection}>
      <div className={topBarCls} onClick={toggleIsExpanded}>
        <DropdownArrowIcon selected={isExpanded} />
        <span className={classes.subSectionHeader}>{header}</span>
      </div>
      {isExpanded && props.children}
    </div>
  );
};

const StyledExpandableSubSection = injectSheet(styles)(
  PageExpandableSubSection
);

const PageParagraph: React.SFC<ISubProps> = props => {
  const { classes } = props;
  return (
    <div className={classes.paragraph}>
      {props.customHeader ? (
        props.header
      ) : (
        <h3 className={classes.paragraphTitle}>{props.header}</h3>
      )}
      {props.children}
    </div>
  );
};

const StyledParagraph = injectSheet(styles)(PageParagraph);

export {
  StyledSection as PageSection,
  StyledSubSection as PageSubSection,
  StyledExpandableSubSection as PageExpandableSubSection,
  StyledParagraph as PageParagraph,
};
