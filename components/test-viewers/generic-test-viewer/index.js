import React from 'react';
import { BComponent } from 'b-component';

export class GenericTestViewer extends BComponent {
  constructor(props, context) {
    super(props, context);

    let ItemGeneratorClass = this.props.generator;
    if (ItemGeneratorClass) {
      this.itemGenerator = new ItemGeneratorClass();
      if (this.itemGenerator && this.itemGenerator.initialize) {
        this.itemGenerator.initialize(this);
      }
    }
  }

  getStyle(size, platform) {
    return this.setStyle(size, platform, {});
  }

  renderItems() {
    if (this.itemGenerator && this.itemGenerator.generate) {
      let one = 1, zero = 0;
      let minusOne = -one;
      let tenpx = '10px';
      let thinGrayBorder = 'solid 1px #eeeeee';
      let dynamicBorder = (rowIndex) => { return rowIndex > zero ? thinGrayBorder : null; };

      let itemIndex = minusOne;

      let itemsList = this.itemGenerator.generate(this.props.context, this);
      let renderedItems = itemsList.length > 1 ? itemsList.map((item) => {
        itemIndex++;
        return (
          <tr key={itemIndex} style={{ borderTop: dynamicBorder(itemIndex) }}>
            <td style={{ verticalAlign: 'top', borderRight: thinGrayBorder, paddingRight: tenpx, paddingTop: tenpx, paddingBottom: tenpx }}>
              <label style={{ marginTop: tenpx }}>{itemIndex + one}. {item.text}:</label>
            </td>
            <td style={{ paddingTop: tenpx, paddingBottom: tenpx, paddingLeft: tenpx }}>
              {item.component}
            </td>
          </tr>
        );
      }) : itemsList[0].component;

      return renderedItems;
    }

    return null;
  }

  render() {
    let renderedItems = this.renderItems();

    return renderedItems && (renderedItems.length && renderedItems.length> 1 ? (
      <table style={{width:'100%'}}>
        <tbody>
          {renderedItems}
        </tbody>
      </table>
    ) : renderedItems);
  }
}

export default GenericTestViewer;
