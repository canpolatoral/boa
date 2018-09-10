import React from 'react';

var BStepper = require('b-stepper').BStepper;

const DIRECTION: any[] = {
  backward: 1,
  forward: 2
};

var _steps = [];
var _resourceInfo = {};
var _finisherPage = {};

_steps.push( {
  action: 'FirstStep',
  title: 'Talepçi Bilgileri',
  content: '1. Adım Talepçi Bilgileri içeriği - Test Viewer',
  buttonLabel: 'İleri'
}, {
  action: 'SecondStep',
  title: 'Finansman Detayı',
  content: '2. Adım Finansman Detayı İçeriği - Test Viewer',
  buttonLabel : 'ileri'
}, {
  action: 'ThirdStep',
  title: 'Geri Ödeme Planı',
  content: 'Son Adım Geri Ödeme Planı İçeriği - Test Viewer',
  buttonLabel:'İleri'
}, {
  action: 'FourthStep',
  title: 'Onaylama Ekranı',
  content: 'Onaylama Ekranı İçeriği - Test Viewer',
  buttonLabel:'Onayla'
});

_resourceInfo = {
  id: 184,
  name: 'Nakit İşlem Listeleme',
  channelId: 45,
  resourceActionList: [
    {
      actionId: 1,
      actionType: 1,
      name:'Gonder',
      commandName: 'FirstStep',
      description: '1. Adım',
      sortId: 1
    },
    {
      actionId: 2,
      actionType: 1,
      name: 'Gonder',
      commandName: 'SecondStep',
      description: '2. Adım',
      sortId: 1
    },
    {
      actionId: 3,
      actionType: 1,
      name: 'Gonder',
      commandName: 'ThirdStep',
      description: '3. Adım',
      sortId: 1
    },
    {
      actionId: 4,
      actionType: 1,
      name: 'Onayla',
      commandName: 'FourthStep',
      description: 'Son Adım',
      sortId: 1
    } 
  ] 
};

_finisherPage =
{
  title: 'İşlem Onayı',
  content: 'Sureç Sona Erdi, Popup açıldı',
  width: '400px',
  height: '200px'
};

export class BStepperTestGenerator {

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }

  _onActionClick(event, steps, direction, value)
  {
    if (direction == DIRECTION.forward)
    {
      var maindiv = document.getElementById('container');
      var div = document.createElement('div');
      div.setAttribute('style', 'border-bottom: 1px solid black');
      div.innerHTML = 'Adım No:' + steps + ' -  ActionCommand : ' + value.commandName;
      maindiv.appendChild(div);
    }
  }

  _onOkClick(event, data)
  {
    var maindiv = document.getElementById('container');
    var div = document.createElement('div');
    div.setAttribute('style', 'border-bottom: 1px solid black');
    div.innerHTML = 'PopUp Kapandı İşlem Sona Erdi';
    maindiv.appendChild(div);
  }

  generate(context, self) {
    return [
      {
        'text': 'BStepper Test',
        'component': <div>
          <div>
            <BStepper
              ref={r => self.testStepper = r}
              context={context}
              stepList={_steps}
              resourceInfo={_resourceInfo}
              finisherPage={_finisherPage}
              onActionClick = {this._onActionClick.bind(this)}
              onFinishClick = {this._onOkClick.bind(this)}  />
          </div>

          <div id="container" style={{padding:20}}></div>
        </div>
      }
    ];
  }
}
export default BStepperTestGenerator;
