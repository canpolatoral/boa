import React from 'react';
var BChartCard = require('b-chart-card').BChartCard;
var BChartForm = require('b-chart-form').BChartForm;


export class BChartsTestGenerator {

  initialize(self) {
    this.self = self;
    if (!self.state) {
      self.state = {};
    }
  }
  constructor() {
    this.title = 'Test Chart Card';
    this.dataSource = [
      {
        'TimeSpan': '0-1 Hour',
        'Total': -106,
        'Rate': 67.5
      },
      {
        'TimeSpan': '1-2 Hours',
        'Total': 98,
        'Rate': 68.3
      },
      {
        'TimeSpan': '2-4 Hours',
        'Total': 61,
        'Rate': 40.1
      },
      {
        'TimeSpan': '4-8 Hours',
        'Total': 47,
        'Rate': 30
      },
      {
        'TimeSpan': '8-16 Hours',
        'Total': 51,
        'Rate': -31.3
      },
      {
        'TimeSpan': '16-32 Hours',
        'Total': 14,
        'Rate': 91.5
      },
      {
        'TimeSpan': 'Longer than 32 Hours',
        'Total': 10,
        'Rate': -68.4
      }
    ];
    this.pieSeries = [
      {
        'field': {
          'name': 'projectCount',
          'label': '# of Requests'
        },
        'type': 'pie',
        'sortOrder': 1
      }
    ];
    this.lineSeries = [
      {
        'field': {
          'name': 'Total',
          'label': 'Total'
        },
        'type': 'column',
        'sortOrder': 1
      },
      {
        'field': {
          'name': 'Rate',
          'label': 'Rate'
        },
        'type': 'line',
        'sortOrder': 2
      },
    ];

    this.areaSeries = [ // birden fazla value axis çizilebilmesi için en az bir tane line tipinde seri olmalı.
      {
        'field': {
          'name': 'Total',
          'label': 'Total'
        },
        'type': 'area',
        'sortOrder': 1
      },
      {
        'field': {
          'name': 'Rate',
          'label': 'Rate'
        },
        'type': 'column',
        'sortOrder': 2
      },
    ];
    this.barSeries = [
      {
        'field': {
          'name': 'Total',
          'label': 'Total'
        },
        'type': 'column',
        'sortOrder': 1
      },
      {
        'field': {
          'name': 'Rate',
          'label': 'Rate'
        },
        'type': 'bar',
        'sortOrder': 2
      },
    ];

    this.horizontalWaterfallSeries = [
      {
        'field': {
          'name': 'Total',
          'label': 'Total'
        },
        'type': 'horizontalWaterfall',
        'sortOrder': 1
      },
      {
        'field': {
          'name': 'Rate',
          'label': 'Rate'
        },
        'type': 'horizontalWaterfall',
        'sortOrder': 2
      },
    ];
    this.radarLineSeries = [
      {
        'field': {
          'name': 'Total',
          'label': 'Total'
        },
        'type': 'radarLine', // iki seriye de radarLine verilmeli
        'sortOrder': 1
      },
      {
        'field': {
          'name': 'Rate',
          'label': 'Rate'
        },
        'type': 'radarLine',
        'sortOrder': 2
      },
    ];
    this.waterfallSeries = [
      {
        'field': {
          'name': 'Total',
          'label': 'Total'
        },
        'type': 'waterfall',
        'sortOrder': 1
      },
      {
        'field': {
          'name': 'Rate',
          'label': 'Rate'
        },
        'type': 'waterfall',
        'sortOrder': 2
      },
    ];

    this.resourceCode = 'RPTRSBBDRR';
    this.columnCount =3;
    this.width=1536;
    this.ITTurnOverSeries = [
      {
        'field': {
          'name': 'bTInCome',
          'label': 'Members Hired'
        },
        'type': 'li',
        'sortOrder': 1
      },
      {
        'field': {
          'name': 'bTOutCome',
          'label': 'Members Quit'
        },
        'type': 'column',
        'sortOrder': 2
      },
      {
        'field': {
          'name': 'inOUTRation',
          'label': 'TurnOver Rate'
        },
        'type': 'line',
        'sortOrder': 3
      }
    ];

    this.ITTurnOverDataSource = [
      {
        'year': 2013,
        'bTInCome': 98,
        'bTOutCome': 22,
        'inoutRation': 8.94
      },
      {
        'year': 2014,
        'bTInCome': 77,
        'bTOutCome': 14,
        'inoutRation': 4.78
      },
      {
        'year': 2015,
        'bTInCome': 61,
        'bTOutCome': 34,
        'inoutRation': 11.33
      },
      {
        'year': 2016,
        'bTInCome': 68,
        'bTOutCome': 25,
        'inoutRation': 8.36
      },
      {
        'year': 2017,
        'bTInCome': 39,
        'bTOutCome': 23,
        'inoutRation': 4.05
      }
    ];
    this.PieDataSource = [
      {
        'businessreasonname': 'DMC-Strategic',
        'projectCount': 175
      },
      {
        'businessreasonname': 'Infrastructure',
        'projectCount': 67
      },
      {
        'businessreasonname':'Small Developments',
        'projectCount': 263
      },
    ];
  }

  _onclick(e) {

  /*  this.chartForm.setColumnCountAndMaxWidth(this.columnCount == 2 ? 3 : 2, this.width == 1200 ? 1536 : 1200);
    this.columnCount = this.columnCount == 2 ? 3 : 2;
    this.width = this.width == 1200 ? 1536 : 1200;*/
    this.chartForm.getDataWithParameter();
  }

  generate(context) {
    return [
      {
        'text': 'Kolonları arttır/azalt',
        'component': <div>
          <div style={{ marginBottom: '10px', width: '200px' }}>
            <button id="disable" onClick={this._onclick.bind(this)} style={{ marginLeft: '10px' }}>Arttır/Azalt</button>
          </div>
        </div>
      },
      {
        'text': 'BChartForm ',
        'component': <div style={{ marginBottom: '10px' }}>
          <BChartForm context={context}
            resourceCode={this.resourceCode}
            ref={(r) => this.chartForm = r}
          />
        </div>
      }     
    ];
  }
}

export default BChartsTestGenerator;
