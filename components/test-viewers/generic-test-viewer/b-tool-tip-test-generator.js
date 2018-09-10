import React from 'react';
var BButton = require('b-button').BButton;
var BToolTip = require('b-tool-tip').BToolTip;

export class BTooltipTestGenerator {

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
    //  this.self.state.FEC = 2;
    //  this.self.state.totalValue = 2;
  }

  generate(context, self) {
    let pos = ['left', 'top', 'right', 'bottom', 'left-start', 'left-end', 'top-start', 'top-end',
      'right-start', 'right-end', 'bottom-start', 'bottom-end'];

    return pos.map((item) => ({
      'component': <BToolTip
        context={self.props.context}
        title='At first, it would appear that this question is impossible to answer. Amazingly, however, this is possible.'
        placement={item}
        children={<BButton context={self.props.context}
          type='flat'
          text={item}
          backgroundColor={self.props.context.theme.boaPalette.pri500}
          textStyle={{ color: 'white' }}
        />}
      />
    }));

  }
}
export default BTooltipTestGenerator;
