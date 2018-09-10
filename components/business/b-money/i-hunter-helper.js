import { BDevice } from 'b-device';

export class IHunterHelper {
  static getBankNoteFromCounter(context, finished) {
    // var devices = BDevice.getDefaultDeviceByFunctionality(context.applicationContext.availableDevices, 0);
    var promise = BDevice.cashCount();
    promise.done((response) => {
      finished(response);
    }).fail(() => {
      finished(null);
      // / TESTTEST
       /*  var arr =
          [
            {
              DepositeAmount: 0,
              DepositeCount: 1,
              Fec: 0,
              FecCode: 'TL',
              isSelectable: true,
              isSelected: false,
              Name: '200 TL',
              UnitPrice: 200,
              WithdrawalAmount: 0,
              WithdrawalCount: 0
  
            },
            {
              DepositeAmount: 0,
              DepositeCount: 2,
              Fec: 0,
              FecCode: 'TL',
              isSelectable: true,
              isSelected: false,
              Name: '50 TL',
              UnitPrice: 50,
              WithdrawalAmount: 0,
              WithdrawalCount: 0
  
            }
          ];*/
      //  finished(arr);
    });
  }

  static checkDevice(context, finished) {
    // var devices = BDevice.getDefaultDeviceByFunctionality(context.applicationContext.availableDevices, 0);
    var promise = BDevice.cashCount();
    promise.done(() => {
      finished(true);
    }).fail(() => {
      finished(false);
      // finished(true); ///TESTTEST
    });
  }
}

export default IHunterHelper;
