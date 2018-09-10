declare namespace __BDivitHelper {

  interface BDivitHelperProps extends __BComponent.BComponentProps {
  }

  export class BDivitHelper {
    static showDivitDialog(context: any, content: any, divitId?: string, instanceId?: string, editorMode?: string, onClose?: any): void;

    static showPersonDivitDialog(context: any, personId: number, customerId: number, editorMode?: string, onClose?: any): void;

    static saveFile(base64Content: string, filename: string, contentType?: string): void;

    static base64ToBlob(base64Content: string, contentType?: string, sliceSize?: number): Blob;
  }
}

declare module 'b-divit-helper' {
  export import BDivitHelper = __BDivitHelper.BDivitHelper;
  export default BDivitHelper;
}
