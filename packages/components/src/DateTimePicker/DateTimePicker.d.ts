import { ComponentBase, ComponentBaseInstance, ComponentBaseProps } from '@kuveytturk/boa-base';

export interface DateTimePickerProps extends ComponentBaseProps {
  minDate?: any; // TODO: propType handle edilemedi.
  maxDate?: any; // TODO: propType handle edilemedi.
  value?: any; // TODO: propType handle edilemedi.
  defaultValue?: any; // TODO: propType handle edilemedi.
  onChange?: () => void; // TODO: method parametre ve dönüş tipi eklenmeli!
  dateOnChange?: (event: any, value: any) => void;
  timeOnChange?: (event: any, value: any) => void;
  hintTextDate?: string;
  hintTextTime?: string;
  floatingLabelTextDate?: string;
  floatingLabelTextTime?: string;
  firstDayOfWeek?: number;
  mode?: string;
  cancelLabel?: string;
  okLabel?: string;
  isBusiness?: boolean;
  format?: string;
  canSelectOldDates?: boolean;
  canSelectWeekendDays?: boolean;
  canSelectSpecialDays?: boolean;
  disabled?: boolean;
  errorTextDate?: string;
  errorTextTime?: string;
  pageType?: 'browse' | 'transactional';
  valueConstraint?: any;
}

// Commented-Tslint: An interface declaring no members is equivalent to its supertype.

// export interface DateTimePickerInstance extends ComponentBaseInstance {
// }

export default class DateTimePicker extends ComponentBase<
  DateTimePickerProps,
  ComponentBaseInstance
> {}
