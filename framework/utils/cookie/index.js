var pako = require('pako');
import Cookies from 'universal-cookie';
import { BDevice } from 'b-device';

export function getCompressedCookie( cookieManager, cookieName) {
  let cookieValueCompressed = cookieManager.get(cookieName);
  if (!cookieValueCompressed) return null;
  let cookieCompressedArray = base64ToArrayBuffer(cookieValueCompressed);
  var data = pako.inflate(cookieCompressedArray, { to: 'string' });
  return JSON.parse(data);
}

function base64ToArrayBuffer(base64) {
  var binary_string =  window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array( len );
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

export function manageTokenCookies(context, routeManager) {
  const cookies = new Cookies();
  let containerToken = cookies.get('containerToken');
  let containerResourceParams =null;
  if (containerToken) {
    (window).isBOALogin = true;
    let containerUser = getCompressedCookie(cookies, 'containerUser');
    let containerWorkGroupBranchList = getCompressedCookie(cookies, 'containerWorkGroupBranch');
    let containerWorkGroupHRBranchList = getCompressedCookie(cookies, 'containerWorkGroupHRBranch');
    let workGroupBranch = [];
    for (let i=0; i< containerWorkGroupBranchList.length; i++) {
      workGroupBranch.push({BranchId:containerWorkGroupBranchList[i], HRBranchId:containerWorkGroupHRBranchList[i]});
    }
    containerUser.WorkGroupBranchList = workGroupBranch;
    let containerChannel = getCompressedCookie(cookies, 'containerChannel');
    let containerHasTellerInfo = cookies.get('containerHasTellerInfo');
    let containerUserManager = getCompressedCookie(cookies, 'containerUserManager');
    let containerWindowUniqueId = cookies.get('containerWindowUniqueId');
    let containerAvaliableDevices = getCompressedCookie(cookies, 'containerAvaliableDevices');
    let containerResourceData = getCompressedCookie(cookies, 'containerResourceData');

    context.applicationContext = {isBOALogin: true, login: {directBoaLogin:true}};
    context.applicationContext.boaContainerInfo = {windowUniqueId: containerWindowUniqueId};
    context.applicationContext.user = containerUser;
    context.applicationContext.channel = containerChannel;
    context.applicationContext.hasTellerProcessInfo = containerHasTellerInfo;
    context.applicationContext.userManager = containerUserManager;
    context.applicationContext.availableDevices = containerAvaliableDevices;

    containerResourceParams = {resourceInfo: containerResourceData};

    BDevice.setMachineName(cookies.get('containerMachineName'));

    let containerPageData = getCompressedCookie(cookies, 'containerPageData');
    containerResourceParams.data = containerPageData;
    routeManager.setPageParams(containerResourceParams);
    routeManager.setCurrentPageId(-1);
    cookies.remove('containerChannel');
    cookies.remove('containerHasTellerInfo');
    cookies.remove('containerUserManager');
    cookies.remove('containerWindowUniqueId');
    cookies.remove('containerAvaliableDevices');
    cookies.remove('containerPageParams');
    cookies.remove('containerChannel');
    cookies.remove('containerResourceData');
    cookies.remove('containerWorkGroupBranch');
    cookies.remove('containerWorkGroupHRBranch');
  }
}
