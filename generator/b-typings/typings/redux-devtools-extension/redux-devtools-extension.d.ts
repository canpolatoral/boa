declare namespace __ReduxDevToolsExtension {
    export function composeWithDevTools(): void;
}


declare module 'redux-devtools-extension' {
    export import composeWithDevTools = __ReduxDevToolsExtension.composeWithDevTools;
}