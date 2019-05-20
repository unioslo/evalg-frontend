import React from 'react';

const mediaQuerySm = window.matchMedia('(min-width: 480px)');
const mediaQueryMd = window.matchMedia('(min-width: 768px)');
const mediaQueryLg = window.matchMedia('(min-width: 1140px)');

const getScreenSize = (
  sm: MediaQueryList,
  md: MediaQueryList,
  lg: MediaQueryList
) => {
  if (lg.matches) {
    return 'lg';
  }
  if (md.matches) {
    return 'md';
  }
  if (sm.matches) {
    return 'sm';
  }
  return 'mobile';
};

const ScreenSizeContext = React.createContext({
  screenSize: 'mobile',
});

interface IState {
  screenSize: 'mobile' | 'sm' | 'md' | 'lg';
}
class ScreenSizeProvider extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.setScreenSize = this.setScreenSize.bind(this);
  }
  public componentDidMount() {
    mediaQuerySm.addListener(this.setScreenSize.bind(this));
    mediaQueryMd.addListener(this.setScreenSize.bind(this));
    mediaQueryLg.addListener(this.setScreenSize.bind(this));
    this.setScreenSize();
  }

  public componentWillUnmount() {
    mediaQuerySm.addListener(this.setScreenSize.bind(this));
    mediaQueryMd.removeListener(this.setScreenSize.bind(this));
    mediaQueryLg.removeListener(this.setScreenSize.bind(this));
  }

  public render() {
    return (
      <ScreenSizeContext.Provider value={this.state}>
        {this.props.children}
      </ScreenSizeContext.Provider>
    );
  }

  private setScreenSize() {
    this.setState({
      screenSize: getScreenSize(mediaQuerySm, mediaQueryMd, mediaQueryLg),
    });
  }
}

const ScreenSizeConsumer = ScreenSizeContext.Consumer;

export { ScreenSizeConsumer, ScreenSizeProvider };
