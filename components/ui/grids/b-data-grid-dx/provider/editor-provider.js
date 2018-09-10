import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

class EditorProvider extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <DataTypeProvider
        formatterComponent={ (data ) =>{

          let reactElement = data.column.reactTemplate && data.column.reactTemplate(data.row, this.props.context, data.column);
          if (reactElement)
            reactElement = React.cloneElement( reactElement, { inlineGridMode: true } );
          else {
            reactElement=<div></div>;
          }

          return reactElement;

        }}
        {...this.props}
  />
    );
  }

}

export default EditorProvider;
