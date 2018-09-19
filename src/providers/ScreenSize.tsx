import * as React from 'react';

const mediaQueryMd = window.matchMedia("(min-width: 640px)");
const mediaQueryLg = window.matchMedia("(min-width: 1140px)");

const getScreenSize = (md: MediaQueryList, lg: MediaQueryList) => {
  if (lg.matches) {
    return 'lg';
  }
  if (md.matches) {
    return 'md';
  }
  return 'sm';
};

const ScreenSizeContext = React.createContext({
  screenSize: 'sm'
});

interface IState {
  screenSize: 'sm' | 'md' | 'lg'
}
class ScreenSizeProvider extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.setScreenSize = this.setScreenSize.bind(this);
  }
  public componentDidMount() {
    mediaQueryMd.addListener(this.setScreenSize.bind(this));
    mediaQueryLg.addListener(this.setScreenSize.bind(this));
    this.setScreenSize();
  }

  public componentWillUnmount() {
    mediaQueryMd.removeListener(this.setScreenSize.bind(this));
    mediaQueryLg.removeListener(this.setScreenSize.bind(this));
  }

  public render() {
    return (
      <ScreenSizeContext.Provider value={this.state}>
        {this.props.children}
      </ScreenSizeContext.Provider>
    )
  }

  private setScreenSize() {
    this.setState({ screenSize: getScreenSize(mediaQueryMd, mediaQueryLg) });
  }
}

const ScreenSizeConsumer = ScreenSizeContext.Consumer;

export {
  ScreenSizeConsumer, ScreenSizeProvider
}