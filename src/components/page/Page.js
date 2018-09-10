import * as React from 'react';
import injectSheet from 'react-jss';

type Props = {
  header: ReactElement,
  children: ReactChildren,
  classes: Object
}

const styles = theme => ({
  header: {
    color: theme.contentPageHeaderColor,
    margin: 0,
    fontWeight: 'bold',
    [`media (min-width: ${theme.breakpoints.lg})`]: {
      margin: `4rem ${theme.contentHorMdPadding} 0 ${theme.contentHorMdPadding}`,
      fontWeight: 'normal'
    }
  }
})

const Page = (props: Props) => {
  return (
    <div>
      <h1 className={props.classes.header}>{ props.header }</h1>
      { props.children }
    </div>
  )
};

export default injectSheet(styles)(Page);