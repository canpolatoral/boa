
declare namespace _Mousetrap {
    export class Mousetrap {
        static bind(keys?: String, callback?: () => void, action?: String): void;
    }
}

declare module "mousetrap" {
    export import Mousetrap = _Mousetrap.Mousetrap;
    export default _Mousetrap;
}