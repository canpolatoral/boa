import * as React from 'react';

export interface ComponentBaseProps {
  context?: object;
  disabled?: boolean;
  id?: string;
  isVisible?: boolean;
  newLine?: boolean;
  persistState?: boolean;
  componentSize?: number;
  snapKey?: string;
  snapshot?: object;
  style?: object;
  valueConstraint?: object;
}

export class ComponentBaseInstance extends React.Component<any, any> {
  state: any;
  constructor(props: any, state?: any);
  getSnapshot(): object;
  setSnapshot(): object;
  getValue(): any;
  resetValue(): any;
  getSelectedRowIndexes?: () => any;
}

export default class ComponentBase<TProps = any, TInstance = any> extends React.Component<TProps, any> {
  state: any;
  constructor(props: any, state?: any);

  getInstance(): TInstance;
  getMessage(groupName: string, propertyName: string): string;
  getMessageCode(groupName: string, propertyName: string): string;
  getSnapKey(childSnapKey: string): string;
  getChildId(childName: string): string;
  getSnapshot(): object;
  setSnapshot(): object;
  getValue(): any;
  resetValue(): any;
}
