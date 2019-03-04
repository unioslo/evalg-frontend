import * as React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import injectSheet from 'react-jss';
import { translate, TranslationFunction } from 'react-i18next';
import { Classes } from 'jss';

const calculatePath = (groupId: string | number ) => (subRoute: string | number) => (
  '/admin/elections/' + groupId + '/' + subRoute
);

const styles = (theme: any) => ({
  navBar: {
    display: 'flex',
    justifyContent: 'center'
  },
  rectangle: {
    fill: theme.adminNavBarColor
  },
  sectionNumber: {
    fontSize: '2.4rem',
    fontWeight: 'bold'
  },
  sectionNumberActive: {
    fill: theme.adminNavBarSectionTextColorActive
  },
  sectionNumberInactive: {
    fill: theme.adminNavBarSectionTextColorInactive
  },
  sectionCircleActive: {
    fill: theme.adminNavBarSectionCircleColorActive
  },
  sectionCircleInactive: {
    fill: theme.adminNavBarSectionCircleColorInactive
  }
})

interface ISectionProps {
  translateX: string,
  translateY: string,
  number: string,
  desc: any,
  active: boolean,
  groupId: number | string,
  classes: Classes,
}

const ElectionNavBarSection = (props: ISectionProps) => {
  const { translateX, translateY, number: num, desc, active, classes } = props;
  const numberClassNames = classNames({
    [classes.sectionNumber]: true,
    [classes.sectionNumberActive]: active,
    [classes.sectionNumberInactive]: !active
  });
  const circleClassNames = classNames({
    [classes.sectionCircleActive]: active,
    [classes.sectionCircleInactive]: !active
  });

  return (
    <g transform={"translate(" + translateX + ", " + translateY + ")"}>
      <text className="electionnavbar--sectiondesc">
        <tspan x="65" y="31">{desc}</tspan>
      </text>
      <circle className={circleClassNames} cx="25" cy="25" r="25" />
      <text className={numberClassNames}>
        <tspan x="18" y="34">{num}</tspan>
      </text>
    </g>
  )
};

interface IProps {
  groupId: number | string,
  path: string,
  t: TranslationFunction,
  classes: Classes,
};

const ElectionNavBar = (props: IProps) => {
  const { groupId, path, t, classes } = props;
  const activeSection = path.split('/').pop();
  const linkGenerator = calculatePath(groupId);
  return (
    <div className={classes.navBar}>
      <svg width="897px" height="56px" viewBox="0 0 897 56">
        <title>Admin Wizard</title>
        <rect className={classes.rectangle}
          x="0" y="0" width="897" height="56" rx="28" />
        <Link to={linkGenerator('info')}>
          <ElectionNavBarSection
            translateX="4"
            translateY="3"
            number="1"
            groupId={groupId}
            desc={t('election.electionInfo')}
            active={activeSection === 'info'}
            classes={classes}
          />
        </Link>
        <Link to={linkGenerator('candidates')}>
          <ElectionNavBarSection
            translateX="234"
            translateY="3"
            number="2"
            groupId={groupId}
            desc={t('election.candidates')}
            active={activeSection === 'candidates'}
            classes={classes}
          />
        </Link>
        <Link to={linkGenerator('pollbooks')}>
          <ElectionNavBarSection
            translateX="464"
            translateY="3"
            number="3"
            groupId={groupId}
            desc={t('election.censuses')}
            active={activeSection === 'pollbooks'}
            classes={classes}
          />
        </Link>
        <Link to={linkGenerator('status')}>
          <ElectionNavBarSection
            translateX="694"
            translateY="3"
            number="4"
            groupId={groupId}
            desc={t('election.electionStatus')}
            active={activeSection === 'status'}
            classes={classes}
          />
        </Link>
      </svg>
    </div>
  )
};

export default injectSheet(styles)(translate()(ElectionNavBar));
