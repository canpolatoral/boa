
declare namespace __BDesigner {
    interface BDesignerProps extends __BBaseForm.BBaseFormProps {
        menuItems: any;
        designerType: string;
        model: any;
    }

    interface BDesignerInstance extends __BBaseForm.BBaseFormInstance {
        getModel(): any;
        getValues(): any;
    }

    export class BDesigner extends __BBaseForm.BBaseForm<BDesignerProps, BDesignerInstance> { }
}

declare module 'b-designer' {
    export import BDesigner = __BDesigner.BDesigner;
    export default BDesigner;
}