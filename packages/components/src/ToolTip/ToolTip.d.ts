import * as React from 'react';
import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface ToolTipProps extends ComponentBaseProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  theme?: any;
  tooltip?: React.ReactNode;
  tooltipPosition?: 'down' | 'up' | 'right' | 'left';
  tooltipStyle?: any;
}

export default class Button extends ComponentBase<ToolTipProps, ComponentBaseInstance> {}
