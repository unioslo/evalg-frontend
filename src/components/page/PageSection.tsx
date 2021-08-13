import React, { useState } from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

import DropdownArrowIcon from 'components/icons/DropdownArrowIcon';

interface IProps {
  children?: React.ReactNode;
  header?: React.ReactNode;
  noBorder?: boolean;
  noBtmPadding?: boolean;
  noTopPadding?: boolean;
  desc?: React.ReactNode;
}

const useStyles = createUseStyles((theme: any) => ({
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
        borderBottom: `${theme.sectionBorderWidth} ${theme.sectionBorderStyle} ${theme.sectionBorderColor}`,
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
}));

const PageSection: React.FunctionComponent<IProps> = (props) => {
  const { header, noBorder, noBtmPadding, noTopPadding, desc } = props;
  const theme = useTheme();
  const classes = useStyles({ theme });

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

interface ISubProps {
  header?: React.ReactNode;
  notBoldHeader?: boolean;
  customHeader?: boolean;
}

const PageSubSection: React.FunctionComponent<ISubProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
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

interface IExpandableSubSectionProps {
  header: string;
  startExpanded?: boolean;
}

const PageExpandableSubSection: React.FunctionComponent<IExpandableSubSectionProps> =
  (props) => {
    const { header, startExpanded } = props;
    const theme = useTheme();
    const classes = useStyles({ theme });
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

interface IStatelessExpandableSubSectionProps
  extends IExpandableSubSectionProps {
  isExpanded: boolean;
  setIsExpanded: (newIsExpanded: boolean) => void;
}

const StatelessExpandableSubSection: React.FunctionComponent<IStatelessExpandableSubSectionProps> =
  (props) => {
    const { header, isExpanded, setIsExpanded } = props;
    const theme = useTheme();
    const classes = useStyles({ theme });
    const topBarCls = classNames({
      [classes.pointerOnHover]: true,
    });

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

const PageParagraph: React.FunctionComponent<ISubProps> = (props) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
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

export {
  PageSection,
  PageSubSection,
  PageExpandableSubSection,
  StatelessExpandableSubSection,
  PageParagraph,
};
