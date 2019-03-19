/* @flow */
import * as React from 'react';
import { I18n } from 'react-i18next';
import injectSheet from 'react-jss';

const styles = () => ({
  languageToggler: {},
});

class Toggler extends React.Component<any> {
  render() {
    const classes = this.props.classes;
    return (
      <I18n>
        {(t, { i18n }) => {
          const currentLang = i18n.language;
          return (
            <a
              className={classes.languageToggler}
              onClick={() => {
                const newLanguage = currentLang === 'nb' ? 'en' : 'nb';
                i18n.changeLanguage(newLanguage);
                document.documentElement.lang = newLanguage;
              }}
            >
              {currentLang === 'nb' ? 'English' : 'Norsk'}
            </a>
          );
        }}
      </I18n>
    );
  }
}

export default injectSheet(styles)(Toggler);
