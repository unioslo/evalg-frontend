/* @flow */
import React from 'react';
import injectSheet from 'react-jss';
import { Classes } from 'jss';

interface IProps {
  text: string;
  classes: Classes;
}

const styles = (theme: any) => ({
  boundingbox: {
    cursor: 'pointer',
  },
  background: {
    fill: theme.colors.lightBlueGray,
  },
  icon: {
    fill: theme.colors.lightTurquoise,
  },
  text: {
    fill: theme.colors.greyishBrown,
    fontSize: '2rem',
    textDecoration: 'underline',
    textDecorationColor: theme.colors.darkTurquoise,
  },
});

const ActionButton: React.SFC<IProps> = (props) => {
  const { classes } = props;
  return (
    <svg
      className={classes.boundingbox}
      width="286"
      height="98"
      viewBox="0 0 286 98"
    >
      <g fill="none">
        <path
          d="M61.358 86L48 98V86H0V0h286v86H61.358z"
          className={classes.background}
        />
        <path
          className={classes.icon}
          d="M44.86 44.58h7v-3.5h-7v-7h-3.5v7h-7v3.5h7v7h3.5v-7zM43 57c-7.732 0-14-6.268-14-14s6.268-14 14-14 14 6.268 14 14-6.268 14-14 14z"
        />
        <text className={classes.text} transform="translate(29 27)">
          <tspan x="40" y="22" style={{ borderBottom: '1px solid black' }}>
            {props.text}
          </tspan>
        </text>
        {/*<path stroke="#2294A8" strokeLinecap="square" d="M71.5 55.5h143"/>*/}
      </g>
    </svg>
  );
};

export default injectSheet(styles)(ActionButton);
