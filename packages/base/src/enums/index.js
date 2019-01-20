/* eslint-disable */
export var Sizes;
(function(Sizes) {
  Sizes[(Sizes['XSMALL'] = 1)] = 'XSMALL';
  Sizes[(Sizes['SMALL'] = 2)] = 'SMALL';
  Sizes[(Sizes['MEDIUM'] = 3)] = 'MEDIUM';
  Sizes[(Sizes['LARGE'] = 4)] = 'LARGE';
})(Sizes || (Sizes = {}));

export var ComponentSize;
(function(ComponentSize) {
  ComponentSize[(ComponentSize['XSMALL'] = 0)] = 'XSMALL';
  ComponentSize[(ComponentSize['SMALL'] = 1)] = 'SMALL';
  ComponentSize[(ComponentSize['MEDIUM'] = 2)] = 'MEDIUM';
  ComponentSize[(ComponentSize['LARGE'] = 3)] = 'LARGE';
})(ComponentSize || (ComponentSize = {}));

export var ContentAlignMode;
(function(ContentAlignMode) {
  ContentAlignMode[(ContentAlignMode['MOBILE'] = 1)] = 'MOBILE';
  ContentAlignMode[(ContentAlignMode['SINGLE'] = 2)] = 'SINGLE';
  ContentAlignMode[(ContentAlignMode['MULTI'] = 3)] = 'MULTI';
})(ContentAlignMode || (ContentAlignMode = {}));

export var DialogResponseStyle;
(function(DialogResponseStyle) {
  DialogResponseStyle[(DialogResponseStyle['OK'] = 0)] = 'OK';
  DialogResponseStyle[(DialogResponseStyle['YESCANCEL'] = 1)] = 'YESCANCEL';
  DialogResponseStyle[(DialogResponseStyle['YESNO'] = 2)] = 'YESNO';
  DialogResponseStyle[(DialogResponseStyle['YESNOCANCEL'] = 3)] = 'YESNOCANCEL';
  DialogResponseStyle[(DialogResponseStyle['OKCANCEL'] = 4)] = 'OKCANCEL';
})(DialogResponseStyle || (DialogResponseStyle = {}));

export var DialogResponse;
(function(DialogResponse) {
  DialogResponse[(DialogResponse['NONE'] = 0)] = 'NONE';
  DialogResponse[(DialogResponse['OK'] = 1)] = 'OK';
  DialogResponse[(DialogResponse['YES'] = 2)] = 'YES';
  DialogResponse[(DialogResponse['NO'] = 3)] = 'NO';
  DialogResponse[(DialogResponse['CANCEL'] = 4)] = 'CANCEL';
})(DialogResponse || (DialogResponse = {}));

export var DialogType;
(function(DialogType) {
  DialogType[(DialogType['INFO'] = 0)] = 'INFO';
  DialogType[(DialogType['ERROR'] = 1)] = 'ERROR';
  DialogType[(DialogType['WARNING'] = 2)] = 'WARNING';
  DialogType[(DialogType['QUESTION'] = 3)] = 'QUESTION';
  DialogType[(DialogType['SUCCESS'] = 4)] = 'SUCCESS';
})(DialogType || (DialogType = {}));

export var Platforms;
(function(Platforms) {
  Platforms[(Platforms['MOBILE'] = 1)] = 'MOBILE';
  Platforms[(Platforms['TABLET'] = 2)] = 'TABLET';
  Platforms[(Platforms['DESKTOP'] = 3)] = 'DESKTOP';
})(Platforms || (Platforms = {}));

export var FormHeaderTransactionTypes;
(function(FormHeaderTransactionTypes) {
  FormHeaderTransactionTypes[(FormHeaderTransactionTypes['TransactionalInput'] = 0)] =
    'TransactionalInput';
  FormHeaderTransactionTypes[(FormHeaderTransactionTypes['TransactionalOutput'] = 1)] =
    'TransactionalOutput';
  FormHeaderTransactionTypes[(FormHeaderTransactionTypes['TransactionalInputOutput'] = 2)] =
    'TransactionalInputOutput';
})(FormHeaderTransactionTypes || (FormHeaderTransactionTypes = {}));
