export default class BMenuHelper {

  static convertResourceMenu(resourceArray, rtl) {
    return this.convertResourceMenuRecursive(resourceArray, rtl);
  }
  static convertResourceMenuRecursive(resourceArray, rtl, level = 0) {
    let result = [];
    if (resourceArray && resourceArray.length > 0) {
      for (let index in resourceArray) {
        if (index != 'findIndex') {
          let resourceItem = resourceArray[index];
          let children = resourceItem.children;
          resourceItem.children = null;
          result.push({
            text: resourceItem.name,
            value: resourceItem.id,
            leftIcon: level == 0 ? BMenuHelper.getIcon(resourceItem, rtl) : null,
            allProperties: resourceItem,
            items: this.convertResourceMenuRecursive(children, rtl, level + 1)
          });
        }
      }
    }
    return result;
  }
  static getIcon(resourceItem, rtl) {
    return (
    {
      bIcon: resourceItem.iconName || 'None',
      iconProperties: {
        folder: 'Menus',
        color: resourceItem.iconColor,
        style: { margin: !rtl ? 'auto 0px auto 24px' : 'auto 24px auto 0px', color: resourceItem.iconColor },
      }
    });
  }
}
