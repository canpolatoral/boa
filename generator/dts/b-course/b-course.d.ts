
declare namespace __BCourse {
    import React = __React;
    interface BCourseProps extends __BComponent.BComponentProps {
        label?: string;
        value?: string;
    }

    export class BCourse extends  __BComponent.BComponetBase<BCourseProps> {
    }
}

declare module 'b-course' {
    export import BCourse = __BCourse.BCourse;
    export default BCourse;
}