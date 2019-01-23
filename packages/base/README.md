# @boa/base

@boa/base package is the core package of boa.

## Installation


```sh
// with npm
npm install @boa/base

// with yarn
yarn add @boa/base
```

## API Reference

### AppProvider

This component wraps MuiThemeProvider and also it has a [error wrapper](#ErrorBoundary). It takes a theme property. It makes the theme available down the React tree thanks to React context. This component should preferably be used at the root of your component tree.

### ComponentBase

This component is the base component of UI components. All UI components are inherited from ComponentBase. It has some common props:

- componentSize:
- content:
- disabled:
- id:
- newLine:
- persistState:
- snapKey:
- snapshot:
- style:
- valueConstraint:
- visible:

Also it has a Mui CHANNEL contextType in the ```contextTypes```. If the theme change from the AppProvider, the ComponentBase assign new theme to ```props.context.theme```.

ComponentBase methods:

- getInstance:
- getMessage:
- getMessageCode:
- getSnapKey:
- getSnapshot:
- setSnapshot:
- validateConstraint:

### ComponentComposer

ComponentComposer is a Higher-Order Component. It renders the wrapped component inside a [error wrapper](#ErrorBoundary) to prevent minimal component's crashes.


### EditorBase

ErrorBoundary is a wrapper for input components. It has some validation methods.

### ErrorBoundary

ErrorBoundary is an error wrapper. It has the componentDidCatch method from the React lifecyle to prevent crashes when an error occurs in components. If any errors occur they are indicated by Dialog.





