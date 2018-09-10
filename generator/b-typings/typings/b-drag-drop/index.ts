declare namespace __BDragDrop {
    export class BDragDrop {
    }

    export function composeDragSource(Component: any): any;
    export function composeDropSource(Component: any): any;
    export const ItemTypes: {
        COMPONENT: string;
        CARD: string;
    };
}

declare module "b-drag-drop" {
    export import BDragDrop = __BDragDrop.BDragDrop;
    export default BDragDrop;
    export import composeDragSource = __BDragDrop.composeDragSource;
    export import composeDropSource = __BDragDrop.composeDragSource;
    export import ItemTypes = __BDragDrop.composeDragSource;
}