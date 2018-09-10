
declare namespace __BBrowseForm {
    interface BBrowseFormProps extends __BBaseForm.BBaseFormProps {
        dataSource: any[]; // TODO: any yerine, yukarıda type tanımlanıp o verilebilir.
        columns?: Object;
        visibleHelpButton?:boolean;
        visibleInfoButton?:boolean;
        visibleOptionsButton?:boolean,
        hideCriteriaPanel?:boolean,

    }

    interface BBrowseFormInstance extends __BBaseForm.BBaseFormInstance {
    }

    export class BBrowseForm extends __BBaseForm.BBaseForm<BBrowseFormProps, BBrowseFormInstance> { }
}

declare module 'b-browse-form' {
    export import BBrowseForm = __BBrowseForm.BBrowseForm;
    export default BBrowseForm;
}
