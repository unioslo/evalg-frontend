/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react';
import { fireEvent, render } from 'test-utils';
import Button from './Button';

describe('<Button /> component', () => {
  it('should render the text prop of the button', () => {
    const testString =
      'this is my PrimaryButton there are many like it but this one is mine';
    const { getByRole } = render(<Button action={() => 1} text={testString} />);
    expect(getByRole('button').textContent).toEqual(testString);
  });

  it('is not disabled', () => {
    const { getByRole } = render(<Button action={() => 1} text="test" />);
    const button = getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should trigger the action callback on click', () => {
    const onClick = jest.fn();
    const { getByText } = render(<Button action={onClick} text="test" />);
    fireEvent.click(getByText('test'));
    expect(onClick).toHaveBeenCalled();
  });

  it('is disabled', () => {
    const { getByRole } = render(
      <Button action={() => 1} text="test" disabled />
    );
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not trigger the action callback when disabled', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button action={onClick} text="test" disabled />
    );
    fireEvent.click(getByText('test'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
