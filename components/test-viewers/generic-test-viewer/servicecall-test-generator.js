import React from 'react';
var BBusinessComponent = require('b-business-component').BBusinessComponent;

export class BInputMaskTestGenerator extends BBusinessComponent {
  constructor() {
    super();
  }

  formatDigit(num, padding) {
    var str = (num || 0).toString();
    var zeroCount = padding - str.length;
    zeroCount = zeroCount >= 0 ? zeroCount : 0;
    var zeros = '';
    for (var i = 0; i < zeroCount; i++) { zeros += '0'; }
    return zeros + str;
  }

  getTime() {
    var date = new Date();
    var hours = this.formatDigit(date.getHours(), 2);
    var minutes = this.formatDigit(date.getMinutes(), 2);
    var seconds = this.formatDigit(date.getSeconds(), 2);
    var milliSeconds = this.formatDigit(date.getMilliseconds(), 3);
    return hours + ':' + minutes + ':' + seconds + ',' + milliSeconds;
  }

  testClick(servicePath) {
    for (let i = 0; i < 20; i++) {
      console.log(`calling service with data: {id: ${i}}, time:${this.getTime()}`);
      this.proxyCallManual({ servicePath: servicePath, data: { id: i }, method: 'POST' })
        .then((result) => {
          console.log('test service result: ' + JSON.stringify(result));
        }, (error) => {
          this.debugLog('error: servicecall-test-generator: ' + JSON.stringify(error), 3);
        });
    }
  }

  test1Click() {
    this.testClick('values/test1');
  }

  test2Click() {
    this.testClick('values/test2');
  }

  test3Click() {
    this.testClick('values/test3');
  }

  test4Click() {
    this.testClick('values/test4');
  }

  generate(context) {
    return [
      {
        'text': '',
        'component':
  <div>
    <button id="testButton" onClick={this.test1Click.bind(this)}>Test1 (async,frombody) Call 20 times</button>
  </div>
      },
      {
        'text': '',
        'component':
  <div>
    <button id="testButton" onClick={this.test2Click.bind(this)}>Test2 (async) Call 20 times</button>
  </div>
      },
      {
        'text': '',
        'component':
  <div>
    <button id="testButton" onClick={this.test3Click.bind(this)}>Test3 (sync,frombody) Call 20 times</button>
  </div>
      },
      {
        'text': '',
        'component':
  <div>
    <button id="testButton" onClick={this.test4Click.bind(this)}>Test4 (sync) Call 20 times</button>
  </div>
      },
    ];
  }
}
export default BInputMaskTestGenerator;