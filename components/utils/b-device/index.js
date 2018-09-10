import { getProxy, setMachineName} from 'b-proxy';

export class BDevice {

  static machineName = '';

  static setMachineName(machineName) {
    this.machineName = machineName;
    setMachineName(this.machineName);
  }

  static setAvailableDevice(avaliableDevices) {
    this.avaliableDevices = avaliableDevices;
  }


  static getDefaultDeviceByFunctionality(avaliableDevices, functionality) {
    if (avaliableDevices) {
      for (var i = 0; i < avaliableDevices.length; i++) {
        if (avaliableDevices[i].functionality == functionality && this.machineName.toLowerCase() == avaliableDevices[i].machineName.toLowerCase())
          return avaliableDevices[i];
      }
    }
    return null;
  }

  static getDeviceByFunctionality(avaliableDevices, functionality) {
    for (var i = 0; i < avaliableDevices.length; i++) {
      if (avaliableDevices[i].functionality == functionality) return avaliableDevices[i];
    }
    return null;
  }

  static baseServiceCall(serviceUrl, controller, methodName, params, data) {
    var request =
      {
        baseUrl: serviceUrl + controller,
        servicePath: methodName + (params ? '?' + params : ''),
        method: 'POST',
        data: data
      };
    return getProxy().callManual(request);
  }

  /* Service Connector Method */
  static serviceCall(controller, methodName, deviceInstance, params, data, isBOAService) {
    var deferred = jQuery.Deferred();
    const deviceServiceURL = 'https://' + this.machineName + ':'+ window.BOA_SETTINGS.DEVICE_PARAMETERS.DEVICE_PORT +'/';
    const boaServiceURL = 'https://' + this.machineName + ':'+ window.BOA_SETTINGS.DEVICE_PARAMETERS.CONTAINER_PORT  +'/';
    var restServiceBase = isBOAService ? boaServiceURL : deviceServiceURL;
    if (deviceInstance && deviceInstance.machineName && deviceInstance.ConnectionType != '1') {
      restServiceBase = 'https://' + deviceInstance.machineName + ':'+ window.BOA_SETTINGS.DEVICE_PARAMETERS.CONTAINER_PORT + '/';
    }

    var serviceCallData = deviceInstance ? deviceInstance : data; // todo bu logic incelenmeli (coral)

    var promise = this.baseServiceCall(restServiceBase, controller, methodName, params, serviceCallData);
    promise.done((response) => {
      deferred.resolve(response);
    }).fail((error) => {
      deferred.reject(error);
    });
    return deferred.promise();
  }

  /* Service Connector Device Methods */
  static cashCount() {
    return this.serviceCall('Device', 'CashCountCount', null);
  }

  static numerator(deviceInstance, methodName) {
    return this.serviceCall('Device', methodName, deviceInstance);
  }

  static numeratorOpen(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorOpen', deviceInstance);
  }

  static numeratorLogin(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorLogin', deviceInstance);
  }

  static numeratorIsLogined(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorIsLogined', deviceInstance);
  }

  static numeratorWaitingCustomerCount(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorWaitingCustomerCount', deviceInstance);
  }

  static numeratorGetTerminalId(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorGetTerminalId', deviceInstance);
  }

  static numeratorAsk(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorAsk', deviceInstance);
  }

  static numeratorNext(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorNext', deviceInstance);
  }

  static numeratorGenerateFictitiousNumber(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorGenerateFictitiousNumber', deviceInstance);
  }

  static numeratorLogout(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorLogout', deviceInstance);
  }

  static numeratorClose(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorClose', deviceInstance);
  }

  static numeratorLogoutAndClose(deviceInstance) {
    return this.serviceCall('Device', 'NumeratorLogoutAndClose', deviceInstance);
  }

  static scannerScanToTemp(deviceInstance, dpi, isSimplex) {
    return this.serviceCall('Device', 'ScannerScanToTemp', null, 'dpi=' + dpi + '&isSimplex=' + isSimplex, null);
  }

  static scannerGetPage(deviceInstance, scanGuid, pageNumber) {
    return this.serviceCall('Device', 'ScannerGetPage', null, 'scanGuid=' + scanGuid + '&pageNumber=' + pageNumber);
  }

  static scannerGetScannedTiff(deviceInstance, scanGuid) {
    return this.serviceCall('Device', 'ScannerGetScannedTiff', null, 'scanGuid=' + scanGuid, null);
  }

  static scannerCleanScan(deviceInstance, scanGuid) {
    return this.serviceCall('Device', 'ScannerCleanScan', null, 'scanGuid=' + scanGuid);
  }

  static passbookPrint(deviceInstance, passbookItems) {
    return this.serviceCall('Device', 'PassbookPrint', { deviceInstance: deviceInstance, passbookItems: passbookItems });
  }

  static printerPrint(deviceInstance, fileName, base64FileData) {
    return this.serviceCall('Device', 'PrinterPrint', { deviceInstance: deviceInstance, fileName: fileName, base64FileData: base64FileData });
  }

  /* Service Connector BOA Methods */

  static transferToBOAContainer(methodName, data) {
    return this.serviceCall('Container', methodName, null, null, data, true);
  }

  static getMachineName() {
    return this.serviceCall('Container', 'GetMachineName');
  }

  static printSlip(businessKey) {
    // let device = BDevice.getDefaultDeviceByFunctionality(this.avaliableDevices, 2);    // passbook device enum

    var request = {
      servicePath: 'development/Generic',
      data: {
        type: 'BOA.Types.Kernel.BusinessHelper.SlipRequest',
        body:  {
          DataContract: {  businessKey: businessKey},
          MethodName: 'PrintSlip'
        },
      },
      method: 'POST'
    };
   
    let promise = getProxy().callManual(request);
    promise.then(response => {
      if (response.success && response.value.length > 0) {
        var passbookItems = response.value;
        promise = this.passbookPrint(null, passbookItems);
        promise.done(() => {
          // insert printlog
          var request = {
            servicePath: 'development/Generic',
            data: {
              type: 'BOA.Types.Kernel.BusinessHelper.SlipRequest',
              body: {
                DataContract: { businessKey: businessKey },
                MethodName: 'InsertSlipPrintCount'
              },
            },
            method: 'POST'
          };

          promise = getProxy().callManual(request);
          promise.then(() => {

          });
        }).fail(() => {
        });
      }  
    }).fail(() => {
    });

  }
}
