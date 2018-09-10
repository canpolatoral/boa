
declare namespace __BStepper {
    interface BStepperProps extends __BComponent.BComponentProps {
        resourceInfo: any;
        page?: any;
        stepList?: any[];
        finisherPage?: any[];
        onActionClick?: () => void;
        onFinishClick?: () => void;
        processState?: number;
        activeStep?: number;
        classes?: any;
        nonLinear?: boolean;
        orientation?: string;
        alternativeLabel?: boolean;
    }

    interface BStepperInstance extends __BComponent.BComponentInstance { }

    export class BStepper extends __BComponent.BComponetBase<BStepperProps, BStepperInstance> { }
}

declare module 'b-stepper' {
    export import BStepper = __BStepper.BStepper;
    export default BStepper;
}