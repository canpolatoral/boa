declare namespace _BValidator {
    export class BValidator {
        constructor(context: any);
        validate(request: any, parameter: any): boolean;
        validateAsync(request: any, parameter: any, callback?: (isValid: boolean, errors: any) => void): any;
    }
}


declare module "b-validator" {
    export import BValidator = _BValidator.BValidator;
}


declare namespace _BValidationHelper {
    export  class BValidationHelper {
        constructor(context: any);
        static isValidEmail(mail: string): boolean;
        static isValidTaxNumber(taxNumber: string): boolean;
        static isValidTCNumber(TCNumber: string): boolean;
        static isValidIBAN(iban: string): boolean;
    }
}


declare module "b-validator" {
    export import BValidationHelper = _BValidationHelper.BValidationHelper;
}