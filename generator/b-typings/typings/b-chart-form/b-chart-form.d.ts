
declare namespace __BChartForm {
    interface BChartFormProps extends __BComponent.BComponentProps {
        resourceCode?: string;
        style?: any;
        disableDefaultScroll?:boolean;
    }

    interface BChartFormInstance extends __BComponent.BComponentInstance {
        getDataWithParameter(): void;
        setColumnCountAndMaxWidth(columnCount: number, maxWidth: number): void;
    }

    export class BChartForm extends __BComponent.BComponetBase<BChartFormProps, BChartFormInstance> { }
}

declare module 'b-chart-form' {
    export import BChartForm = __BChartForm.BChartForm;
    export default BChartForm;
}