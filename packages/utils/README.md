# @boa/utils

@boa/utils package has Localization and Messaging utilities.

## Installation


```sh
// with npm
npm install @boa/utils

// with yarn
yarn add @boa/utils
```

## API Reference

### Localization

We're using *moment* and *numeral* for localization to dates and numbers. Localization utility provides some functionality to format the variables.

### Messaging

We're receiving messages from a backend dynamically. The messaging utility receives messages and versions and caches them.

#### getMessage
ComponentBase has a function called [getMessage](https://github.com/kuveytturk/boa/blob/monorepo/packages/base/src/ComponentBase/index.js#L81). It takes two parameters: *groupName*, *propertyName*


```setMessagingOptions``` function provides to configure messaging library.

```js
export function setMessagingOptions(options)
````

Options:
- **url:** messaging service url (if empty, use window.location)
- **path:** messaging service path 
- **versionPath:** messaging versions path
- **fileNameFormat:** messaging file name formats
- **timeout:** timeout for HTTP request (minutes)
- **languageId:** message languages
```json
  { title: 'Türkçe', value: 1 },
  { title: 'English', value: 2 },
  { title: 'Deutsch', value: 3 },
  { title: 'русский', value: 4 },
  { title: 'العربية', value: 5 },
```
- **refreshThresold:** messaging version check thresold
- **localMessages:** for offline working (please refer to test-messages folder)



```js
export const DEFAULT_LANGUAGE_ID = 1;
export const DEFAULT_TIMEOUT = 300000;
export const DEFAULT_URL = '';
export const DEFAULT_PATH = '/messaging/';
export const DEFAULT_VERSION_PATH = 'MessagingVersions.json';
export const DEFAULT_FILE_NAME_FORMAT = 'BOA.Messaging.{0}.json';
export const DEFAULT_THRESOLD = 1; // minutes
```
