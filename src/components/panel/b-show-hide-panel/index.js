
import { BComponent, BComponentComposer } from 'b-component';

@BComponentComposer
export class BShowHidePanel extends BComponent {
  state =
  {
    show: false
  };

  constructor(props, context) {
    super(props, context);
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false });
  }

  render() {
    return (this.state.show === true ? this.props.children : null);
  }
}

export default BShowHidePanel;
