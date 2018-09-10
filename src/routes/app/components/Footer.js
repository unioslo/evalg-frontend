/* @flow */
import * as React from 'react';

type Props = {
  children?: React$Element<any>,
};

const Footer = (props : Props, ctx : Context): React$Element<any> => {
  return (
    <footer className="footer--wrapper">
      <div className="footer">
        <p>omglol</p>
      </div>
    </footer>
  )
};

export default Footer;