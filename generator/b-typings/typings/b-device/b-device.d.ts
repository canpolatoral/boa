import DeviceManagement = BOA.Types.DeviceManagement;

declare namespace _BDevice {
    export class BDevice {
        static getDeviceByFunctionality: (avaliableDevices: any, functionality: any) => any;
        static numeratorOpen: (deviceInstance: any) => any;
        static transferToBOAContainer: (methodName: string, data: any) => any;
        static numeratorLogin: (deviceInstance: any) => any;
        static numeratorIsLogined: (deviceInstance: any) => any;
        static numeratorWaitingCustomerCount: (deviceInstance: any) => any;
        static numeratorGetTerminalId: (deviceInstance: any) => any;
        static numeratorAsk: (deviceInstance: any) => any;
        static numeratorNext: (deviceInstance: any) => any;
        static numeratorGenerateFictitiousNumber: (deviceInstance: any) => any;
        static numeratorLogout: (deviceInstance: any) => any;
        static numeratorClose: (deviceInstance: any) => any;
        static numeratorLogoutAndClose: (deviceInstance: any) => any;
        static scannerScan: (deviceInstance: any) => any;
        static printSlip: (slipDataInformation: any) => any;
        static passbookPrint: (model: DeviceManagement.PassbookPrintModel) => any;
        static printerPrint: (printFile: DeviceManagement.PrintFileModel) => any;
        static getMachineName: () => any;
        static setMachineName: (machineName: any) => void;
        static setAvailableDevice: (availableDevices: any) => void;
    }
}

declare module "b-device" {
    export import BDevice = _BDevice.BDevice;
}
