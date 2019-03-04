import * as React from 'react';
import ReactClipboardButton from 'react-clipboard.js';
import Icon from '../../components/icon';

const ClipboardButton = (props) => {
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