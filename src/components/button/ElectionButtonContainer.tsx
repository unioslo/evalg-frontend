import React from 'react';
import classNames from 'classnames';

type IProps = {
  children?: React.ReactNode[];
};

const ElectionButtonContainer: React.FunctionComponent<IProps> = (props) => {
  let spaceBetween = false;
  const { children } = props;
  if (children && children.length && children.length > 2) {
    spaceBetween = true;
  }
  const cls = classNames({
    electionbuttoncontainer: true,
    'electionbuttoncontainer-margin': !spaceBetween,
    'electionbuttoncontainer-spacebetween': spaceBetween,
  });
  return <div className={cls}>{children}</div>;
};

export default ElectionButtonContainer;
