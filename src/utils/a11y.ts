export const buttonize = (
  handler: (
    event:
      | React.KeyboardEvent<HTMLInputElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => any,
  key: string
) => {
  return {
    role: 'button',
    onClick: handler,
    tabIndex: 0,
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === key) handler(event);
    },
  };
};
