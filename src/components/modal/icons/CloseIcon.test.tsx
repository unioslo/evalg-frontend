import React from 'react';
import { fireEvent, render } from 'test-utils';
import CloseIcon from './CloseIcon';

describe('<CloseIcon /> component', () => {
  it('should call closeAction prop on click', () => {
    const closeAction = jest.fn();
    const { getByRole } = render(<CloseIcon closeAction={closeAction} />);
    fireEvent.click(getByRole('button'));
    expect(closeAction).toHaveBeenCalled();
  });
});
