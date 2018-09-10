
declare namespace __BSlider {
    interface BSliderProps extends __BComponent.BComponentProps {
        axis?: any; // tip handle edilemedi. özelleştirilebilir
        defaultValue?: any; // tip handle edilemedi. özelleştirilebilir
        disableFocusRipple?: boolean;
        disabled?: boolean;
        max?: any; // tip handle edilemedi. özelleştirilebilir
        min?: any; // tip handle edilemedi. özelleştirilebilir
        name?: string;
        required?: boolean;
        sliderStyle?: any;
        step?: number;
        style?: React.CSSProperties;
        value?: any; // tip handle edilemedi. özelleştirilebilir
        onChange?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onDragStart?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
        onDragStop?: () => void; // method parametreleri ve dönüş tipi varsa eklenmeli
    }

    interface BSliderInstance extends __BComponent.BComponentInstance {
    }

    export class BSlider extends __BComponent.BComponetBase<BSliderProps, BSliderInstance> { }
}

declare module 'b-slider' {
    export import BSlider = __BSlider.BSlider;
    export default BSlider;
}