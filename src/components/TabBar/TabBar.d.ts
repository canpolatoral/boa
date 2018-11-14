import ComponentBase,
{
  ComponentBaseInstance,
  ComponentBaseProps,
} from '../../base/ComponentBase';

export interface TabBarProps extends ComponentBaseProps {
  className?: string;
  contentContainerClassName?: string;
  contentContainerStyle?: any;
  initialSelectedIndex?: number;
  inkBarStyle?: any;
  onChange?: (event: any, value: any) => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  style?: React.CSSProperties;
  tabItemContainerStyle?: any;
  tabTemplate?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
  tabTemplateStyle?: any;
  value?: any;
  tabItems?: any; // tip handle edilemedi. özelleştirilebilir
  mode?: any;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface TabBarInstance extends ComponentBaseInstance {
// }

export default class TabBar extends ComponentBase<TabBarProps, ComponentBaseInstance> { }
