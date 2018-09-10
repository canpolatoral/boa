/*eslint-disable*/

import { BValidator } from './validator';


var model = {
  field1: true,
  field2: 'safa'
};

var schema = {
  fields: [
    {
      name: 'field1',
      path: 'field1',
    },
    {
      name: 'field2',
      path: 'field2'
    }
  ],
  groupValidations: [
    {
      name: 'deneme',
      type: 'Condition',
      fields: ['field1', 'field2'],
      condition: 'True',
      validation: 'NotEquals',
      secondCompareValue: 'safa',
      firstCompareValue: 'mert'
    }
  ]
};


var result = BValidator.validate(model, schema);
console.log('true'==true)
console.log(result);

