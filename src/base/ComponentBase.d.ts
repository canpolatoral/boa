import * as React from 'react';

export interface ComponentBaseProps {
  context?: Object,
  disabled?: boolean,
  id?: string,
  isVisible?: boolean,
  newLine?: boolean,
  persistState?: boolean,
  size?: number,
  snapKey?: string
  snapshot?: Object,
  style?: Object,
  valueConstraint?: object
}

export class ComponentBaseInstance extends React.Component<any, any> {
  state: any;
  static Utils: Utils;
  constructor(props: any, state?: any);

  getInstance(): TInstance;
  getMessage(groupName: string, propertyName: string): string;
  getMessageCode(groupName: string, propertyName: string): string;
  getSnapKey(childSnapKey: string): string;
  getChildId(childName: string): string;
  getSnapshot(): Object;
  setSnapshot(): Object;
  getValue(): any;
  resetValue(): any;
}

export default class ComponentBase<TProps = any, TInstance = any> extends React.Component<TProps, any> {
  state: any;
  static Utils: Utils;
  constructor(props: any, state?: any);

  getInstance(): TInstance;
  getMessage(groupName: string, propertyName: string): string;
  getMessageCode(groupName: string, propertyName: string): string;
  getSnapKey(childSnapKey: string): string;
  getChildId(childName: string): string;
  getSnapshot(): Object;
  setSnapshot(): Object;
  getValue(): any;
  resetValue(): any;

}

