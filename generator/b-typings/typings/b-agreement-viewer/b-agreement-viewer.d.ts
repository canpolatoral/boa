declare namespace _BAgreementViewer {
    export class BAgreementViewer {
        static showAgreement: (context: any, documentContractList: any, code: string, displayName: string) => void;

    }

    interface AgreementListContract {
        DocumentType: string;
        FieldCode: string;
        Text: string;
        Image: any;
        RowCount: number;
        ColumnCount: number;
        DocumentContractList: any;
    }
}

declare module "b-agreement-viewer" {
    export import BAgreementViewer = _BAgreementViewer.BAgreementViewer;
}