/* @flow */
import * as React from 'react';

class Toggler extends React.Component<any> {
  changeLanguage() {
    return;
  }
  render() {
    const lang = 'en';
    return (
      <span onClick={this.changeLanguage.bind(this)}
        className="languagetoggler">
        {lang === 'en' ? "Norsk"
          : "Engelsk"}
      </span>
    )
  }
}

export default Toggler;