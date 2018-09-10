import React from 'react';
var BTabBar = require('b-tab-bar').BTabBar;
var BCard = require('b-card').BCard;
import styled from 'styled-components';

const PreviewContainer = styled.div`
  font-family: Consolas;
  font-size: 14px;
  font-weight: bold;
  color: #9197a3;
  backgroundColor: #fff;
  padding: 20px;
  min-height: 10px;
`;


export class BTabBarTestGenerator {

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }

  tabItems = [
    {
      text: 'Test',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>
    },
    {
      text: 'Nakit Yatırma',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Boa Uygulama Kalitesi ve Mimari Uyum Dashboard Raporu',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>
    }
  ];

  tabItems2 = [
    {
      text: 'Raporlar',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>
    },
    {
      text: 'Nakit Yatırma',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Nakit Listeleme',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>
    }
  ];

  tabItems3 = [
    {
      text: 'Raporlar 1',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>
    },
    {
      text: 'Nakit Yatırma  2',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Nakit Listeleme 3',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>
    },
    {
      text: 'Raporlar 4',
      value: 4,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>
    },
    {
      text: 'Nakit Yatırma 5',
      value: 5,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Nakit Listeleme 6',
      value: 6,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>
    },
    {
      text: 'Raporlar 7',
      value: 7,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>
    },
    {
      text: 'Nakit Yatırma 8',
      value: 8,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Nakit Listeleme 9',
      value: 9,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>
    },
    {
      text: 'Raporlar 10',
      value: 10,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>
    },
    {
      text: 'Nakit Yatırma 11',
      value: 11,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Nakit Listeleme 12',
      value: 12,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>
    }
  ];

  tabItems4 = [
    {
      text: 'Raporlar',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>
    },
    {
      text: 'Nakit Yatırma',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Nakit Listeleme',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>
    }
  ];

  tabItems5 = [
    {
      text: 'Raporlar',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Home'
    },
    {
      text: 'Nakit Yatırma',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>
    },
    {
      text: 'Nakit Listeleme',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Error'
    }
  ];

  tabItems6 = [
    {
      text: 'Raporlar',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Home'
    },
    {
      text: 'Nakit Yatırma Nakit Yatırma Nakit Yatırma Nakit Yatırma',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>,
      disabled: true
    },
    {
      text: 'Nakit Listeleme Nakit Listeleme Nakit Listeleme Nakit Listeleme',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Error'
    }
  ];

  tabItems7 = [
    {
      text: 'Card 1',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Home'
    },
    {
      text: 'Card 2',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>,
      leftIcon: 'Warning'
    },
    {
      text: 'Card 3',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Error'
    }
  ];

  tabItems8 = [
    {
      text: 'Page 1',
      value: 0,
      content: <PreviewContainer>Tab Content 1</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Home'
    },
    {
      text: 'Page 2',
      value: 1,
      content: <PreviewContainer>Tab Content 2</PreviewContainer>,
      leftIcon: 'Warning'
    },
    {
      text: 'Page 3',
      value: 2,
      content: <PreviewContainer>Tab Content 3</PreviewContainer>,
      leftIconVisibility: true,
      leftIcon: 'Error'
    }
  ];
  handleChange = (event, value) => {
    this.self.setState({ value });
  };

  generate(context, self) {
    return [
      {
        text: 'BTabBar',
        component: (
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12">
                <h4>Right Icon Button Visible Tabs</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  tabItems={this.tabItems}
                  rightIconButtonVisibility={true}
                  value={this.self.state.value}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <h4>Centered Tabs</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  tabItems={this.tabItems2}
                  centered={true}
                  scrollable={false}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <h4>Scrollable Tabs</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  tabItems={this.tabItems3}

                  scrollable={true}
                  centered={true}
                  rightIconButtonVisibility={true}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <h4>Secondary Tabs</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  mode={'secondary'}
                  tabItems={this.tabItems4}
                  rightIconButtonVisibility={true}

                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <h4>Left Icon Visible Tabs</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  mode={'secondary'}
                  tabItems={this.tabItems5}
                  rightIconButtonVisibility={true}
                  leftIconButtonVisibility={true}
                  leftIcon={'Error'}

                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <h4>Disabled Tabs</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  mode={'secondary'}
                  tabItems={this.tabItems6}
                  leftIconButtonVisibility={true}
                  leftIcon={'Error'}

                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3">
                <h4>Tabs In Card</h4>
                <BCard context={context} style={{ padding:'0px 0px 0px 0px' }} >
                  <BTabBar
                    context={context}
                    ref={r => (this.tabBar = r)}
                    mode={'secondary'}
                    tabItems={this.tabItems7}
                    leftIcon={'Error'}
                    containerType={'card'}
                  />
                </BCard>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3">
                <h4>Tabs In Page</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  mode={'secondary'}
                  tabItems={this.tabItems8}
                  leftIcon={'Error'}
                  containerType={'page'}
                  scrollButtons={'auto'}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <h4>Tabs with style</h4>
                <BTabBar
                  context={context}
                  ref={r => (this.tabBar = r)}
                  mode={'secondary'}
                  tabItems={this.tabItems4}
                  disableIcons={true}
                  style={{height: '32px', minHeight: '32px'}}
                  tabLabelStyle={{paddingLeft: '12px', paddingRight: '12px'}}
                />
              </div>
            </div>
          </div>
        )
      }
    ];
  }
}
export default BTabBarTestGenerator;
