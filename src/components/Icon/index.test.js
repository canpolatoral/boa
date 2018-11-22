import MuiSvgIcon from '@material-ui/core/SvgIcon';
import * as SvgIcons from '@material-ui/icons';
import { assert } from 'chai';
import { mount } from 'enzyme';
import { Icon } from './index';

describe('Icon tests', () => {
  it('should get dynamicIcon', () => {
    const Home = Icon.getIcon({ dynamicIcon: 'Home' });
    const wrapper = mount(Home);
    assert.strictEqual(wrapper.type(), SvgIcons.Home);
  });

  it('should get svgIcon', () => {
    const SvgIcon = Icon.getIcon({ svgIcon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' });
    const wrapper = mount(SvgIcon);
    assert.strictEqual(wrapper.type(), MuiSvgIcon);
  });

  it('should get bIcon', () => {
    const SvgIcon = Icon.getIcon({ bIcon: 'BOALogo', iconProperties: { folder: 'Logos' } });
    const wrapper = mount(SvgIcon);
    assert.strictEqual(wrapper.childAt(0).type(), MuiSvgIcon);
  });
});
