import React from 'react';
import { fireEvent, render } from 'test-utils';
import ActionItem from './index';

describe('<ActionItem /> component', () => {
  it('should render children', () => {
    const children = <div>Hello</div>;
    const { getByText } = render(
      <ActionItem action={() => 1}>{children}</ActionItem>
    );
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('should trigger the action callback on click', () => {
    const onClick = jest.fn();
    const { getByTestId } = render(<ActionItem action={onClick} />);
    fireEvent.click(getByTestId('action-item'));
    expect(onClick).toHaveBeenCalled();
  });

  it('aligns to the center', () => {
    const { getByTestId } = render(<ActionItem action={() => 1} alignCenter />);
    expect(getByTestId('action-item')).toHaveStyle('justify-content: center');
  });

  it('aligns to the right', () => {
    const { getByTestId } = render(<ActionItem action={() => 1} alignRight />);
    expect(getByTestId('action-item')).toHaveStyle('justify-content: flex-end');
  });
});
