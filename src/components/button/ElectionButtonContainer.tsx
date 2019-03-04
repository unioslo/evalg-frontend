import * as React from 'react';
import classNames from 'classnames';
// import injectSheet from 'react-jss';

// const styles = (theme: any) => ({
//   container: {
//     display: 'flex'
//   }
// })

type IProps = {
  children?: React.ReactNode[],
}

const ElectionButtonContainer = (props: IProps) => {
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
