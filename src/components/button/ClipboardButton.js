/* @flow */
import * as React from 'react';
import ReactClipboardButton from 'react-clipboard.js';
import Icon from 'components/icon';

type Props = {
  text: ReactElement | string,
  data: string
}

const ClipboardButton = (props: Props) => {
  const { text, data } = props;
  return (
    <ReactClipboardButton data-clipboard-text={data}
      className="button button-primary">
      {text}
      <span className="button--icon-smlmargin">
        <Icon type="clipboard" />
      </span>
    </ReactClipboardButton>
  )
};


export default ClipboardButton;