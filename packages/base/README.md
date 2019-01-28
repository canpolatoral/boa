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

- componentSize: In our design guideline, all components on a page must be placed inside a card. The ComponentSize prop defines the size of the component.  The ComponentSize constant exported from [`enums`](packages/base/src/enums/index.js#L10).
- context: The context property defines application requirements such as localization, theme, platform.
- disabled: All components should be have disabled prop.
- id: All components should be have id prop.
- newLine: As described in `componentSize` prop, if any components take part in the new line on a card we're using this prop.
- persistState: // TODO
- snapKey: // TODO
- snapshot: In our SPA, we want to keep the state of each component when a page will unmount. And the same page will mount again, the component mounts with snapshot prop and it should get the previous state.
- style: All components should be have style prop.
- valueConstraint: ...
- visible: In ComponentComposer, we change the visibility of the component with this prop.

Also it has a Mui CHANNEL contextType in the ```contextTypes```. If the theme change from the AppProvider, the ComponentBase assign new theme to ```props.context.theme```.

ComponentBase methods:

- getInstance: Returns component instance.
- getMessage: Get message online or offline from [@boa/utils](packages/utils#messaging) 
- getMessageCode: TODO
- getSnapKey: TODO
- getSnapshot: Returns the component current state to provide status. 
- setSnapshot: Change component status to the given snapshot.
- validateConstraint:

### ComponentComposer

ComponentComposer is a Higher-Order Component. It renders the wrapped component inside a [error wrapper](#ErrorBoundary) to prevent minimal component's crashes.


### EditorBase

ErrorBoundary is a wrapper for input components. It has some validation methods.

### ErrorBoundary

ErrorBoundary is an error wrapper. It has the componentDidCatch method from the React lifecyle to prevent crashes when an error occurs in components. If any errors occur they are indicated by Dialog.

### Themes

We're using different color palettes with [custom themes](packages/base/src/themes). To get theme

```js
import { getTheme } from '@boa/base';
const theme = getTheme({ themeName: themeName });
```

After get theme, theme prop of the AppProvider should be re-assigned.

Current theme palettes:

```js
export function getThemeList() {
  return [
    { name: 'winter', id: 0 },
    { name: 'summer', id: 1 },
    { name: 'fall', id: 2 },
    { name: 'spring', id: 3 },
    { name: 'night', id: 4 },
    { name: 'violet', id: 5 },
    { name: 'rose', id: 6 },
    { name: 'sea', id: 7 },
    { name: 'dark', id: 8 },
    { name: 'kuveytturk', id: 9 },
    { name: 'ash', id: 10 },
    { name: 'orange', id: 11 },
    { name: 'magenta', id: 12 },
  ];
}
```

### Utils

@boa/base package some utility exports.

#### setLocalization

Configure the [@boa/utils](packages/utils) package. 

```js
import { Localization, setMessagingOptions } from '@boa/utils';

export default function setLocalization(options) {
  setMessagingOptions(options);
  Localization.staticConstructor(options.languageId);
}
```

### Utils

Utils class has some utility functions:

- generateUUID: Generate a UUID v4.
- stringFormat: Replace `{[number]}` values with args.
- stringPadLeft: Add padding to string.
- getShowStatusMessageReplacedText: 
- getUniqueKey: Generate a sequential id.
- getFormChildren: 
- getFormChildrenRecursive:
- getCardChildren:
- getCardChildrenRecursive:
- isMobile: Check platform is mobile.
- formHeaderTransactionTypesColor: 
- isMobileOrTablet: Check platform is mobile or tablet.
- getDisplayName: 
- shallowEqual: 
- isWrappedWithStyles: The component composed with `withStyles` from the `@material-ui/core` package.
