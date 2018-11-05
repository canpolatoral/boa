import * as React from 'react'

export interface Utils {
  getIcon: (cmpProps: any) => React.ReactElement<any>;
  stringFormat: (value: string, args: any) => string;
}
