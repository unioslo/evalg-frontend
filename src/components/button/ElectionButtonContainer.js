/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const styles = theme => ({
  container: {
    display: 'flex'
  }

})

type Props = {
  children?: ReactChildren
}

const ElectionButtonContainer = (props: Props) => {
  let spaceBetween = false;
  const { children } = props;
  if (children && children.length && children.length > 2) {
    spaceBetween = true;
  }
  const cls = classNames({
    'electionbuttoncontainer': true,
    'electionbuttoncontainer-margin': !spaceBetween,
    'electionbuttoncontainer-spacebetween': spaceBetween
  });
  return (
    <div className={cls}>
      {children}
    </div>
  );
};

export default ElectionButtonContainer;
