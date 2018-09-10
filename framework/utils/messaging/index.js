import { changeMessagingContext } from '../../action';
import { getProxy } from 'b-proxy';

function getMessagesVersion() {
  var d = new Date();
  var date = d.getFullYear() + '.' + d.getMonth() + '.' + d.getDate() + '.' + d.getHours() + '.' + d.getMinutes();

  let responseVersion = getProxy().callManualSync({
    servicePath: 'MessagingVersions.json?v=' + date,
    baseUrl: '/messaging/',
    async: false,
    cache: true,
    method: 'GET'});
  return responseVersion;
}

function getVersionOfMessagingGroup(store, groupName) {
  return getVersionOfMessagingGroupBase(store.messagingContext['MessagingVersion'], groupName);
}

function getVersionOfMessagingGroupBase(messagingVersionList, groupName) {
  var messagingContract = messagingVersionList.find(x => x.ClassName == groupName);
  return messagingContract ? messagingContract.Version: undefined; 
}

function loadMessagesByGroupAgain(store, groupName) {
  store.messagingContext = loadMessagesByGroup(store, groupName);
  changeMessagingContext(store.messagingContext);
}

function loadMessagesByGroup(store, groupName) {
  var messagingGroupVersionClient = getVersionOfMessagingGroup(store, groupName); 
  var fileName = 'BOA.Messaging.' + groupName + '.json?v=' + messagingGroupVersionClient;

  var directoryPath = '/messaging/';
  switch (store.language) {
    case 1 : directoryPath += 'tr/'; break;
    case 2 : directoryPath += 'en/'; break;
    case 3 : directoryPath += 'de/'; break;
    case 4 : directoryPath += 'ru/'; break;
    case 5 : directoryPath += 'ar/'; break;
    default: directoryPath += 'en/';
  }

  let responseLanguage = getProxy().callManualSync({
    servicePath: fileName,
    baseUrl: directoryPath,
    async: false,
    cache: true,
    method: 'GET'
  });
  if (!responseLanguage.isSuccess) {
    return store.messagingContext;
  }
  var newMessagingContext = store.messagingContext;
  newMessagingContext[groupName] = responseLanguage.data;
  return newMessagingContext;
}

export function getMessageBase(store, groupName, propertyName) {
  let isLoadMessagesByGroupAgain = false;
  let lastMinute;
  if (!store.messagingContext) {
    store.messagingContext = {};
  }
  if (store.messagingContext['MessagingVersion']) {
    lastMinute = store.messagingContext['lastReadDate'];
    lastMinute = lastMinute.setMinutes(lastMinute.getMinutes() + 1);
    if (lastMinute < new Date()) {
      let responseVersion = getMessagesVersion();
      if (!responseVersion.isSuccess) {
        return groupName + '.' + propertyName;
      }
      store.messagingContext['lastReadDate'] = new Date();

      var messagingGroupVersionClient = getVersionOfMessagingGroup(store, groupName); 
      var messagingGroupVersionServer = responseVersion.data.find(x => x.ClassName == groupName).Version;
      // var messagingGroupVersionServer = getVersionOfMessagingGroupBase(responseVersion.data['MessagingVersion'], groupName); 

      if (messagingGroupVersionClient != messagingGroupVersionServer) {
        isLoadMessagesByGroupAgain = true;
        store.messagingContext['MessagingVersion'] = responseVersion.data; // artık tek bir versiyon dosyası değil, tüm mesaj grupları için ayrı ayrı versiyon dosyaları tutulmaya başladı.
      }
    }
  }
  else {
    let responseVersion = getMessagesVersion();
    if (!responseVersion.isSuccess) {
      return groupName + '.' + propertyName;
    }
    store.messagingContext['MessagingVersion'] = responseVersion.data; // artık tek bir versiyon dosyası değil, tüm mesaj grupları için ayrı ayrı versiyon dosyaları tutulmaya başladı.
    store.messagingContext['lastReadDate'] = new Date();
  }

  if (isLoadMessagesByGroupAgain) {
    loadMessagesByGroupAgain(store, groupName);
  }
  if (!store.messagingContext[groupName]) {
    store.messagingContext = loadMessagesByGroup(store, groupName);
    if (store.messagingContext[groupName]) {
      changeMessagingContext(store.messagingContext);
    }
  }
  if (store.messagingContext[groupName] && store.messagingContext[groupName].find(x => x.PropertyName == propertyName)) {
    return store.messagingContext[groupName].find(x => x.PropertyName == propertyName);
  }
  else
    return {Description: groupName + '.' + propertyName};
}
