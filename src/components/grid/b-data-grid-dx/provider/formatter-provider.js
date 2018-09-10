import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';
import { UIHelper } from './../ui-helper';


class FormatterProvider extends React.Component {

  constructor (props) {
    super(props);
  }

  render() {
    return (
      <DataTypeProvider
        formatterComponent={ (data ) =>{
          return UIHelper.getFormatedColumnValue(data.value, data.column, data);
        }}
        {...this.props}
  />
    );
  }

}

export default FormatterProvider;
