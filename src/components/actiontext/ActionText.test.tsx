import React from 'react';
import { fireEvent, render } from 'test-utils';
import ActionText from './index';

describe('<ActionText /> component', () => {
  it('should render children', () => {
    const children = <div>Hello</div>;
    const { getByText } = render(
      <ActionText action={() => 1}>{children}</ActionText>
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('should trigger the action callback on click', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<ActionText action={onClick} />);
    fireEvent.click(getByTestId('action-text'));
    expect(onClick).toHaveBeenCalled();
  });
});
