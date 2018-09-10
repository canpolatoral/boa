declare namespace _BLocalization {

    export class BLocalization {
        static formatDateTime: (date: any, format: string) => string;
        static formatCurrency: (currency: any, format: string) => string;
        static formatMoney: (currency: any) => string;
        static stringUpperCase: (value: string) => string;
        static stringLowerCase: (value: string) => string;
        static getDateTimeFormat: (format: string) => string;
    }
}

declare module "b-localization" {
    export import BLocalization = _BLocalization.BLocalization;
}