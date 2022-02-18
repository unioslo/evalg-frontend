import React, { useState } from 'react';

const ScreenSizeContext = React.createContext({
  screenSize: 'lg',
});

interface IState {
  screenSize: 'mobile' | 'sm' | 'md' | 'lg';
}
const ScreenSizeProvider: React.FunctionComponent<any> = (props: any) => {
  const { children } = props;

  const [screenSize] = useState<IState>({ screenSize: 'lg' });

  return (
    <ScreenSizeContext.Provider value={screenSize}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

const ScreenSizeConsumer = ScreenSizeContext.Consumer;

export { ScreenSizeConsumer, ScreenSizeProvider };
