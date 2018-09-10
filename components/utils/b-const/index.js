var ActionCommand;
(function (ActionCommand) {
  ActionCommand[ActionCommand['Ok'] = 'Ok'] = 'Ok';
  ActionCommand[ActionCommand['Yes'] = 'Yes'] = 'Yes';
  ActionCommand[ActionCommand['No'] = 'No'] = 'No';
  ActionCommand[ActionCommand['Save'] = 'Save'] = 'Save';
  ActionCommand[ActionCommand['New'] = 'New'] = 'New';
  ActionCommand[ActionCommand['Update'] = 'Update'] = 'Update';
  ActionCommand[ActionCommand['Cancel'] = 'Cancel'] = 'Cancel';
  ActionCommand[ActionCommand['Print'] = 'Print'] = 'Print';
  ActionCommand[ActionCommand['Download'] = 'Download'] = 'Download';
  ActionCommand[ActionCommand['Clean'] = 'Clean'] = 'Clean';
  ActionCommand[ActionCommand['Delete'] = 'Delete'] = 'Delete';
  ActionCommand[ActionCommand['GetInfo'] = 'GetInfo'] = 'GetInfo';


})(ActionCommand || (ActionCommand = {}));

export class BConst {
}

BConst.ActionCommand = ActionCommand;

export default BConst;
