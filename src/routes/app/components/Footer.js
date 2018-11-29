/* @flow */
import * as React from 'react';
import injectSheet from 'react-jss';
import { testWarning } from 'appConfig'

const styles = theme => ({
  footer: {
    background: `url('/uio-app-uio-sickle-medium.png') left ${theme.horizontalPadding} top no-repeat`,
    height: '8rem',
    maxWidth: theme.appMaxWidth,
    margin: '0 auto',
    padding: `0rem ${theme.horizontalPadding}`,
    [theme.breakpoints.mdQuery]: {
      padding: `0rem ${theme.horizontalMdPadding}`,
      background: `url('/uio-app-uio-sickle-medium.png') left ${theme.horizontalMdPadding} top no-repeat`
    }
  },
  wrapper: {
    background: theme.colors.black,
    padding: '3.5rem 0'
  }
})

type Props = {
  children?: ReactElement,
  classes: Object
};

const Footer = (props: Props, ctx: Context) => {
  return (
    <React.Fragment>
      <footer className={props.classes.wrapper}>
        <div className={props.classes.footer}>
          <p>Footer content</p>
        </div>
      </footer>
      {testWarning &&
        <div className="alert">
          Test av evalg 3. For spørsmål om løsningen ta kontakt med <a href='mailto:evalg-kontakt@usit.uio.no'>evalg-drift</a>
        </div>}
    </React.Fragment>
  )
};

export default injectSheet(styles)(Footer);