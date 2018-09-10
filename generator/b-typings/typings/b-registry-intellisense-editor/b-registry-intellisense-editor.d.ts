
declare namespace __BRegistryIntellisenseEditor {
    interface BRegistryIntellisenseEditorProps extends __BComponent.BComponentProps {
        propertySearchTextChanged?: () => void;
        isRegistrySourceVisible?: boolean;
        isProcessSourceVisible?: boolean;
        propertyType?: string,
        dataSource?: any,
        selectedRegistryTypeName?: string,
        selectedProcessName?: string,
        propertySearchText?: string,
        hintText?: string,
        labelText?: string,
    }

    interface BRegistryIntellisenseEditorInstance extends __BComponent.BComponentInstance {
        getValue(): any;
    }

    export class BRegistryIntellisenseEditor extends __BComponent.BComponetBase<BRegistryIntellisenseEditorProps, BRegistryIntellisenseEditorInstance> { }
}

declare module 'b-registry-intellisense-editor' {
    export import BRegistryIntellisenseEditor = __BRegistryIntellisenseEditor.BRegistryIntellisenseEditor;
    export default BRegistryIntellisenseEditor;
}