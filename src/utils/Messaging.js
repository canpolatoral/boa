const DEFAULT_LANGUAGE_ID = 1;
const DEFAULT_TIMEOUT = 300000;
const DEFAULT_URL = '';
const DEFAULT_PATH = '/messaging/';
const DEFAULT_VERSION_PATH = 'MessagingVersions.json';
const DEFAULT_FILE_NAME_FORMAT = 'BOA.Messaging.{0}.json';

const store = { versions: [], messages: {} };
let messagingOptions = {};

function isCrossDomain() {
  return messagingOptions.url !== DEFAULT_URL;
}

function getUrl(path) {
  return isCrossDomain() ? messagingOptions.url + path : path;
}

function serviceCallSync(request) {
  const result = { data: null, isSuccess: false, error: null };
  const path = request.baseUrl + request.servicePath;
  const requestString = JSON.stringify(request.data);
  const requestObj = {
    url: getUrl(path),
    data: requestString,
    type: request.method || 'GET',
    timeout: messagingOptions.timeout,
    async: false,
    crossDomain: isCrossDomain(),
    cache: request.cache || false,
    processData: false,
    dataType: request.dataType || 'json',
    contentType: 'application/json; charset=utf-8',
    headers: request.headers,
    success(response) {
      result.isSuccess = true;
      result.data = response;
    },
    error(jqXhr, textStatus, errorThrown) {
      result.isSuccess = false;
      result.error = errorThrown;
    },
  };

  $.ajax(requestObj); // eslint-disable-line no-undef
  return result;
}

function getMessagesVersion() {
  const now = new Date();
  // eslint-disable-next-line max-len
  const dateString = `${now.getFullYear()}.${now.getMonth()}.${now.getDate()}.${now.getHours()}.${now.getMinutes()}`;

  const request = {
    servicePath: `${messagingOptions.versionPath}?v=${dateString}`,
    baseUrl: messagingOptions.path,
    async: false,
    cache: true,
    method: 'GET',
  };

  const response = serviceCallSync(request);
  if (response.isSuccess) {
    store.lastReadDate = now;
  }
  return response;
}

function getVersionOfMessagingGroup(groupName) {
  if (store.versions && store.versions.length > 0) {
    const group = store.versions.find(x => x.ClassName === groupName);
    return group ? group.Version : undefined;
  }
  return null;
}

function loadMessagesByGroup(groupName, languageId) {
  const version = getVersionOfMessagingGroup(groupName);
  const fileName = `${messagingOptions.fileNameFormat.replace('{0}', groupName)}?v=${version}`;
  let baseUrl = messagingOptions.path;

  switch (languageId) {
    case 1: baseUrl += 'tr/'; break;
    case 2: baseUrl += 'en/'; break;
    case 3: baseUrl += 'de/'; break;
    case 4: baseUrl += 'ru/'; break;
    case 5: baseUrl += 'ar/'; break;
    default: baseUrl += 'en/';
  }

  const request = {
    servicePath: fileName,
    baseUrl,
    async: false,
    cache: true,
    method: 'GET',
  };

  const responseLanguage = serviceCallSync(request);

  if (responseLanguage.isSuccess) {
    store.messages[groupName] = responseLanguage.data;
    store.messages[groupName].languageId = languageId;
  }
}

function isVersionCheckRequired() {
  if (!store.versions || store.versions.length === 0) return true;

  let lastReadDate = store.lastReadDate;
  lastReadDate = lastReadDate.setMinutes(lastReadDate.getMinutes() + 1);
  return lastReadDate < new Date();
}

export function setMessagingOptions(options) {
  if (options) {
    messagingOptions.url = options.url || DEFAULT_URL;
    messagingOptions.path = options.path || DEFAULT_PATH;
    messagingOptions.versionPath = options.versionPath || DEFAULT_VERSION_PATH;
    messagingOptions.fileNameFormat = options.fileNameFormat || DEFAULT_FILE_NAME_FORMAT;
    messagingOptions.timeout = options.timeout || DEFAULT_TIMEOUT;
    messagingOptions.languageId = options.languageId || DEFAULT_LANGUAGE_ID;
  } else {
    messagingOptions = {
      url: DEFAULT_URL,
      path: DEFAULT_PATH,
      versionPath: DEFAULT_VERSION_PATH,
      fileNameFormat: DEFAULT_FILE_NAME_FORMAT,
      timeout: DEFAULT_TIMEOUT,
      languageId: DEFAULT_LANGUAGE_ID,
    };
  }
}


export function getMessage(groupName, propertyName, languageId) {
  const versionCheckRequired = isVersionCheckRequired();
  let messagesRefreshRequired = false;
  let clientVersion; let
    serverVersion;

  if (versionCheckRequired) {
    const responseVersion = getMessagesVersion();
    if (!responseVersion.isSuccess) {
      return { Description: `${groupName}.${propertyName}`, Code: propertyName };
    }

    clientVersion = getVersionOfMessagingGroup(messagingOptions.store, groupName);
    serverVersion = responseVersion.data.find(x => x.ClassName === groupName).Version;

    messagesRefreshRequired = clientVersion !== serverVersion;
    if (messagesRefreshRequired) {
      store.versions = responseVersion.data;
    }
  }

  const messages = store.messages;
  const messageGroup = messages[groupName];
  const messagesNotExists = !messages || !messageGroup;
  const languageNotExists = (messages && messageGroup && messageGroup.languageId !== languageId);

  if (messagesNotExists || languageNotExists || messagesRefreshRequired) {
    loadMessagesByGroup(groupName, languageId || messagingOptions.languageId);
  }

  if (messages && messageGroup && messageGroup.find(x => x.PropertyName === propertyName)) {
    return messageGroup.find(x => x.PropertyName === propertyName);
  }

  return { Description: `${groupName}.${propertyName}` };
}
