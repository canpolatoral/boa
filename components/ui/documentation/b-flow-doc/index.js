import React from 'react'; import PropTypes from 'prop-types';
import { BComponent } from 'b-component';
import convert from './converter';

export class BFlowDoc extends BComponent {
  static propTypes = {
    content: PropTypes.string
  };

  static defaultProps = {
  };

  constructor(props, context) {
    super(props, context); 
    this.state = {
      converted: ''
    };
  }
  componentDidMount() {
    let converted = convert(this.props.content);
    this.setState({ converted: converted });
  }
  getSnapshot() {
    return {
      state: this.state
    };
  }

  setSnapshot(snapShot) {
    let snapState = { ...snapShot.state };
    this.setState(snapState);
  }

  render() {

    return (
      <div style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: this.state.converted }} >

      </div>
    );
  }
}

export default BFlowDoc;
