# Contributing
## Submitting a pull request

BOA is a community project, so pull requests are always welcome, but, before working on a large change, it is best to open an issue first to discuss it with the maintainers.

As with issues, please begin the title with [ComponentName].

## Getting started
### Building locally

To use the provided build scripts with yarn you have to install `yarn@^1.9.0`.
Depending on the package you want to build just run `yarn workspace @boa/PACKAGE build`.

```sh
git clone https://github.com/kuveytturk/boa.git
cd boa
## install dependencies
yarn
## start storybook
yarn start
## build base
yarn workspace @boa/base build
## build components
yarn workspace @boa/components build
## build utils
yarn workspace @boa/utils build
```

### Coding style

Please follow the coding style of the project. BOA uses eslint, so if possible, enable linting in your editor to get real-time feedback. The linting rules can be run manually with the following command `yarn lint`.

### Running Storybook

We're using [storybook](https://storybook.js.org/) as component catalog. To start stroybook run:
```sh 
yarn start
```

#### Writing stories

Stories are located in the ***stories*** folder. The [storybook guideline](https://storybook.js.org/basics/writing-stories/) is a good start point to writing stories. Also, we've some components that provide convenience to create stories. [Header](stories/base/header.js), [Preview](stories/base/preview.js), [PropsTable](stories/base/props-table.js) components can help you to write the story. Each component requires a [react-docgen's](https://github.com/reactjs/react-docgen) output. We can provide a script to generate required *doc.json*. For example, create doc.json for Button.js:

```sh
yarn generate:doc --input "packages/components/src/Button/Button.js" --output "stories/Buttons/Button/doc.json"
```

Please review ***stories*** folder before write new story.


### Testing

To run unit tests with mocha on node.js:

```sh
yarn test:unit
```

Code coverage:
```sh
yarn test:coverage:html
```

To run unit test with karma on real browser:

```sh
yarn test:karma
```
