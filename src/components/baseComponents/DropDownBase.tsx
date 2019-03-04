/* @flow */
import * as React from 'react';

import {} from '../../interfaces'

interface IDropDownState {
  inputValue: any,
  objects: any[],
  open: boolean,
  selected: any
}


class DropDownBase<T> extends React.Component<T, IDropDownState> {
  state: IDropDownState;
  wrapperRef: any;
  // handleClickOutside: Function;

  constructor(props: T) {
    super(props);
    this.state = {
      inputValue: '',
      objects: [],
      open: false,
      selected: null,
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClick() {
    this.setState(({ open }) => ({ open: !open }));
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event: Event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ open: false });
    }
  }
}

export default DropDownBase;
