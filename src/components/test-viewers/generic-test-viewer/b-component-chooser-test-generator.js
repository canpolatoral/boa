import React from 'react';
import { BComponentChooser } from 'b-component-chooser';
import { BCard } from 'b-card';

export class BComponentChooserTestGenerator {
  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }

  onComponentSelect = (Selected) => {
    this.self.setState({ SelectedComponent: Object.assign({}, Selected) });
  }

  generate(context) {
    let { SelectedComponent } = this.self.state;
    return [
      {
        'text': 'Default',
        'component': <div style={{ marginBottom: '10px' }}>

          <BComponentChooser
            context={context}
            floatingLabelText={'Bileşen'}
            dialogTitle={'Bileşen Seçimi'}
            selectedItems={SelectedComponent}
            isSingleElement={true}
            onComponentSelect={(Selected) => this.onComponentSelect(Selected)}
          />
          {SelectedComponent ?
            <BCard
              context={context}>
              {SelectedComponent}
            </BCard>
            : null}
        </div>
      }
    ];
  }
}
export default BComponentChooserTestGenerator;
