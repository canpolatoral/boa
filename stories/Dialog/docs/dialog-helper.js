/* eslint-disable max-len */
export default `
# DialogHelper
DialogHelper is a static class that helps create a Dialog window from outside. So no need put a \`<Dialog />\` component inside the render method.
It provides some static methods.

## Usage

\`\`\`js
import { DialogHelper } from '@boa/components/Dialog';
\`\`\`

## Methods
- **DialogHelper.show**: Creates a dialog window. Returns ref of the \`<Dialog />\`.
  - **context**: The context parameter. Please refer to \`@boa/base\` documentation for detailed documentation.
  - **content**: The content parameter. It supports, string, object, array or any React Element.
  - **dialogType**: \`DialogType\` enum from the \`@boa/base\` package.
  - **dialogResponseStyle**: \`DialogResponseStyle\` enum from the \`@boa/base\` package.
  - **title**: The of dialog window.
  - **onClose**: Callback function that will fire on the dialog window closed.
  - **style**: Override the style of \`<Dialog />\` element.
  - **onClosin**: Callback function that will fire on the dialog window is closing.
  - **showHeader**: Flag the visibility of the title.,
`;
