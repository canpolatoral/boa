import React from 'react';

import { BBusinessComponent } from 'b-business-component';
import { BIconButton } from 'b-icon-button';

export  class BDesignerEvents extends BBusinessComponent {

  render() {
    let style = {
      display: 'table',
      width: '100%'
    };

    return (
      <div style={{ ...style }}>
        <div>
          <label style={{ color: '#1976D2', fontWeight: 'bolder', fontSize: '13pt', marginRight: '15px' }}>Events</label>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{ position: 'absolute', top: '-30px', display: 'inline-block', }}>
              <BIconButton key='ExpandEvents'
                context={this.props.context}
                dynamicIcon={this.state.expanded ? 'ExpandLess' : 'ExpandMore'} />
            </div>
          </div>
        </div>
        <div style={{ display: 'table-row-group' }}>
        </div>
      </div >
    );
  }

}
export default  BDesignerEvents;
