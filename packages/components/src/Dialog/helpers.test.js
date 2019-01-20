import React from 'react';
import { assert } from 'chai';
import { Sizes } from '@boa/base';
import * as Helper from './helpers';
import { context } from '@boa/test/utils';

describe('prepareLineStyle', () => {
  it('should has borderBottomColor from context', () => {
    const style = Helper.prepareLineStyle(context);
    assert.strictEqual(style.borderBottomColor, context.theme.boaPalette.base200);
  });

  it('should change margin with localization', () => {
    const style = Helper.prepareLineStyle(context);
    assert.strictEqual(style.marginRight, 24);
    assert.strictEqual(style.marginLeft, 96);
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    const styleRTL = Helper.prepareLineStyle(newContext);
    assert.strictEqual(styleRTL.marginLeft, 24);
    assert.strictEqual(styleRTL.marginRight, 96);
  });

  it('should handle device size', () => {
    const newContext = Object.assign({}, context);
    [Sizes.XSMALL, Sizes.SMALL, Sizes.MEDIUM, Sizes.LARGE].forEach(size => {
      newContext.deviceSize = size;
      const style = Helper.prepareLineStyle(newContext);
      if (size <= Sizes.SMALL) {
        assert.strictEqual(style.marginRight, 24);
        assert.strictEqual(style.marginLeft, 24);
      }
    });
  });
});

describe('prepareCloseButtonStyle', () => {
  it('should has top:0 and right:0', () => {
    const style = Helper.prepareCloseButtonStyle(context);
    assert.strictEqual(style.top, 0);
    assert.strictEqual(style.right, 0);
  });

  it('should change padding with localization', () => {
    const style = Helper.prepareCloseButtonStyle(context);
    assert.strictEqual(style.paddingRight, 12);
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    const styleRTL = Helper.prepareCloseButtonStyle(newContext);
    assert.strictEqual(styleRTL.paddingLeft, 12);
  });

  it('should handle device size', () => {
    const newContext = Object.assign({}, context);
    [Sizes.XSMALL, Sizes.SMALL, Sizes.MEDIUM, Sizes.LARGE].forEach(size => {
      newContext.deviceSize = size;
      const style = Helper.prepareCloseButtonStyle(newContext);
      if (size <= Sizes.SMALL) {
        assert.strictEqual(style.paddingRight, 4);
      }
    });
  });

  it('should handle device size with localization', () => {
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    [Sizes.XSMALL, Sizes.SMALL, Sizes.MEDIUM, Sizes.LARGE].forEach(size => {
      newContext.deviceSize = size;
      const style = Helper.prepareCloseButtonStyle(newContext);
      if (size <= Sizes.SMALL) {
        assert.strictEqual(style.paddingLeft, 4);
      }
    });
  });
});

describe('prepareTitleStyle', () => {
  it('should has flex:1, paddingTop:9', () => {
    const style = Helper.prepareTitleStyle(context);
    assert.strictEqual(style.flex, 1);
    assert.strictEqual(style.paddingTop, 9);
  });

  it('should change padding with localization', () => {
    const style = Helper.prepareTitleStyle(context);
    assert.strictEqual(style.paddingLeft, 60);
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    const styleRTL = Helper.prepareTitleStyle(newContext);
    assert.strictEqual(styleRTL.paddingRight, 60);
  });

  it('should handle device size', () => {
    const newContext = Object.assign({}, context);
    [Sizes.XSMALL, Sizes.SMALL, Sizes.MEDIUM, Sizes.LARGE].forEach(size => {
      newContext.deviceSize = size;
      const style = Helper.prepareTitleStyle(newContext);
      if (size <= Sizes.SMALL) {
        assert.strictEqual(style.paddingLeft, 44);
      }
    });
  });

  it('should handle device size with localization', () => {
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    [Sizes.XSMALL, Sizes.SMALL, Sizes.MEDIUM, Sizes.LARGE].forEach(size => {
      newContext.deviceSize = size;
      const style = Helper.prepareTitleStyle(newContext);
      if (size <= Sizes.SMALL) {
        assert.strictEqual(style.paddingRight, 44);
      }
    });
  });
});

describe('prepareDialogFormStyle', () => {
  it('should have right properties', () => {
    const style = Helper.prepareDialogFormStyle(context, '#ffffff');
    assert.strictEqual(style.boxSizing, 'border-box');
    assert.strictEqual(style.width, '100%');
    assert.strictEqual(style.fontSize, 16);
    assert.strictEqual(style.textAlign, 'center');
    assert.strictEqual(style.color, context.theme.boaPalette.comp500);
    assert.strictEqual(style.background, '#ffffff');
    assert.strictEqual(style.padding, 0);
    assert.strictEqual(style.display, 'flex');
    assert.strictEqual(style.direction, 'ltr');
  });

  it('should change padding with localization', () => {
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    const style = Helper.prepareDialogFormStyle(newContext, '#ffffff');
    assert.strictEqual(style.boxSizing, 'border-box');
    assert.strictEqual(style.width, '100%');
    assert.strictEqual(style.fontSize, 16);
    assert.strictEqual(style.textAlign, 'center');
    assert.strictEqual(style.color, context.theme.boaPalette.comp500);
    assert.strictEqual(style.background, '#ffffff');
    assert.strictEqual(style.padding, 0);
    assert.strictEqual(style.display, 'flex');
    assert.strictEqual(style.direction, 'rtl');
  });

  it('should handle device size', () => {
    const newContext = Object.assign({}, context);
    [Sizes.XSMALL, Sizes.SMALL, Sizes.MEDIUM, Sizes.LARGE].forEach(size => {
      newContext.deviceSize = size;
      const style = Helper.prepareTitleStyle(newContext);
      if (size <= Sizes.SMALL) {
        assert.strictEqual(style.paddingLeft, 44);
      }
    });
  });
});

describe('prepareArrayContent', () => {
  it('should create rows with <br />', () => {
    const content = Helper.prepareArrayContent(['a', 'b', 'c']);
    const items = content.split('<br />');
    assert.strictEqual(items[0], 'a');
    assert.strictEqual(items[1], 'b');
    assert.strictEqual(items[2], 'c');
  });

  it('should create rows with <br />', () => {
    const content = Helper.prepareArrayContent(['a \n', 'b', 'c']);
    const items = content.split('<br />');
    assert.strictEqual(items[0], 'a ');
    assert.strictEqual(items[1], '');
  });
});

describe('prepareObjectContent', () => {
  it('should create main content', () => {
    const content = {
      mainContent: <div>test</div>,
    };
    const objectContent = Helper.prepareObjectContent(content, context);
    assert.strictEqual(objectContent.dialogContent[0].type, 'div');
    assert.strictEqual(objectContent.dialogContent[0].key, 'dialogContent');
    assert.strictEqual(objectContent.dialogContent[0].props.style.fontSize, 16);
    assert.strictEqual(objectContent.dialogContent[0].props.style.marginRight, 24);
  });

  it('should create main content with localization', () => {
    const content = {
      mainContent: <div>test</div>,
    };
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    const objectContent = Helper.prepareObjectContent(content, newContext);
    assert.strictEqual(objectContent.dialogContent[0].type, 'div');
    assert.strictEqual(objectContent.dialogContent[0].key, 'dialogContent');
    assert.strictEqual(objectContent.dialogContent[0].props.style.fontSize, 16);
    assert.strictEqual(objectContent.dialogContent[0].props.style.marginLeft, 24);
  });

  it('should create subcontents', () => {
    const content = {
      mainContent: <div>test</div>,
      subcontents: [<div>sub1</div>, <div>sub2</div>],
    };
    const objectContent = Helper.prepareObjectContent(content, context);
    assert.strictEqual(objectContent.dialogSubContent[0].type, 'div');
    assert.strictEqual(objectContent.dialogSubContent[0].key, 'scrollDiv');
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.overflow, 'auto');
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.height, '60vh');
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.paddingLeft, 98);
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.paddingBottom, 24);
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.direction, 'ltr');

    objectContent.dialogSubContent[0].props.children.forEach((sub, i) => {
      assert.strictEqual(sub.key, i.toString());
      assert.strictEqual(sub.props.style.color, context.theme.boaPalette.base400);
      assert.strictEqual(sub.props.style.fontSize, 11);
      assert.strictEqual(sub.props.style.marginTop, 24);
    });
  });
});

describe('preparetStringContent', () => {
  it('should create main content', () => {
    const content = {
      mainContent: <div>test</div>,
    };
    const objectContent = Helper.prepareObjectContent(content, context);
    assert.strictEqual(objectContent.dialogContent[0].type, 'div');
    assert.strictEqual(objectContent.dialogContent[0].key, 'dialogContent');
    assert.strictEqual(objectContent.dialogContent[0].props.style.fontSize, 16);
    assert.strictEqual(objectContent.dialogContent[0].props.style.marginRight, 24);
  });

  it('should create main content with localization', () => {
    const content = {
      mainContent: <div>test</div>,
    };
    const newContext = Object.assign({}, context, { localization: { isRightToLeft: true } });
    const objectContent = Helper.prepareObjectContent(content, newContext);
    assert.strictEqual(objectContent.dialogContent[0].type, 'div');
    assert.strictEqual(objectContent.dialogContent[0].key, 'dialogContent');
    assert.strictEqual(objectContent.dialogContent[0].props.style.fontSize, 16);
    assert.strictEqual(objectContent.dialogContent[0].props.style.marginLeft, 24);
  });

  it('should create subcontents', () => {
    const content = {
      mainContent: <div>test</div>,
      subcontents: [<div>sub1</div>, <div>sub2</div>],
    };
    const objectContent = Helper.prepareObjectContent(content, context);
    assert.strictEqual(objectContent.dialogSubContent[0].type, 'div');
    assert.strictEqual(objectContent.dialogSubContent[0].key, 'scrollDiv');
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.overflow, 'auto');
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.height, '60vh');
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.paddingLeft, 98);
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.paddingBottom, 24);
    assert.strictEqual(objectContent.dialogSubContent[0].props.style.direction, 'ltr');

    objectContent.dialogSubContent[0].props.children.forEach((sub, i) => {
      assert.strictEqual(sub.key, i.toString());
      assert.strictEqual(sub.props.style.color, context.theme.boaPalette.base400);
      assert.strictEqual(sub.props.style.fontSize, 11);
      assert.strictEqual(sub.props.style.marginTop, 24);
    });
  });
});
