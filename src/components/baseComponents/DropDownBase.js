/* @flow */
import * as React from 'react';

class DropDownBase extends React.Component<Object, DropDownState> {
  state: DropDownState;
  wrapperRef: any;
  handleClickOutside: Function;

  constructor(props: Object) {
    super(props);
    this.state = {
      inputValue: '',
      objects: [],
      open: false,
      selected: null
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClick() {
    this.setState({ open: !this.state.open });
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