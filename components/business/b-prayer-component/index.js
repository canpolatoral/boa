import React from 'react';
import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BCard } from 'b-card';

@BComponentComposer
export class BPrayerComponent extends BBusinessComponent {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    ...BBusinessComponent.propTypes
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps
  };
  
  state = {
    selectedPrayer: 0
  };

  getPaint() {
    var momentDate = new Date();
    var selectedPrayer = 0;

    if (momentDate < this.convertPrayerTime(this.state.afterNight)) selectedPrayer = 5;
    if (momentDate < this.convertPrayerTime(this.state.night)) selectedPrayer = 4;
    if (momentDate < this.convertPrayerTime(this.state.midAfternoon)) selectedPrayer = 3;
    if (momentDate < this.convertPrayerTime(this.state.noon)) selectedPrayer = 2;
    if (momentDate < this.convertPrayerTime(this.state.sun)) selectedPrayer = 1;
    if (momentDate < this.convertPrayerTime(this.state.sobriety)) selectedPrayer = 0;

    this.setState({ selectedPrayer: selectedPrayer });

    setTimeout(
      function() {
        this.getPaint();
      }.bind(this),
      1000
    );
  }

  convertPrayerTime(prayerTime) {
    var tempdate = new Date();
    var year = tempdate.getFullYear();
    var month = tempdate.getMonth();
    var day = tempdate.getDate();

    var hour = prayerTime.substr(0, 2);
    var minute = prayerTime.substr(3, 2);
    var date = new Date(year, month, day, hour, minute);

    return date;
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'GetPrayer':
        if (response.success == true) {
          this.setState({
            cityId: response.value.cityName,
            sobriety: response.value.sobriety,
            sun: response.value.sun,
            noon: response.value.noon,
            midAfternoon: response.value.midAfternoon,
            night: response.value.night,
            afterNight: response.value.afterNight
          });

          if (this.state.sobriety != undefined) this.getPaint();
        } else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;
      default:
        break;
    }
  }

  componentDidMount() {
    super.componentDidMount();

    let proxyRequest = {
      requestClass: 'BOA.Types.Container.BOAPortalRequest',
      requestBody: {
        cityId: this.props.context.applicationContext.user.branch.city,
        MethodName: 'GetPrayerInfo'
      },
      key: 'GetPrayer'
    };
    this.proxyExecute(proxyRequest);
  }

  render() {
    var styleContainer = { margin: 'auto', width: '100%', color: this.props.context.theme.boaPalette.base350 };
    var styleCard = { width: '350px' };
    var styleItem = {
      'text-align': 'center',
      float: 'left',
      maxWidth: '40px',
      display: 'block',
      fontSize: '12px',
      marginBottom: '6px',
      marginLeft: '8px'
    };
    var prayerTime = this.getMessage('BOAOne', 'PrayerTime');
    var sobriety = this.getMessage('BusinessComponents', 'Fajr');
    var sun = this.getMessage('BusinessComponents', 'Dawn');
    var noon = this.getMessage('BusinessComponents', 'Noon');
    var midAfternoon = this.getMessage('BusinessComponents', 'Afternoon');
    var night = this.getMessage('BusinessComponents', 'Night');
    var afterNight = this.getMessage('BusinessComponents', 'Midnight');

    let labelStyle = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      wordWrap: 'normal'
    };

    var cityName = this.state.cityId;
    var selectColor = {
      'text-align': 'center',
      float: 'left',
      maxWidth: '40px',
      display: 'block',
      fontSize: '12px',
      marginBottom: '6px',
      marginLeft: '8px',
      color: '#404040',
      backgroundColor: this.props.context.theme.boaPalette.levelYellow500
    };

    var selectedText = { 'font-weight': 'bold', marginTop: '5px', ...labelStyle };
    var unselectedText = { marginTop: '5px', ...labelStyle };

    return (
      <div>
        <BCard context={this.props.context} expandable={false} initiallyExpanded={false} style={styleCard}>
          <div style={styleContainer}>
            <label
              style={{
                fontWeight: '500',
                fontSize: '15px',
                marginTop: '10px',
                marginLeft: '8px',
                marginBottom: '5px',
                display: 'block',
                color: this.props.context.theme.boaPalette.base350
              }}
            >
              {prayerTime}
            </label>
            <label
              style={{
                fontSize: '13px',
                marginLeft: '8px',
                marginBottom: '8px',
                display: 'block',
                color: this.props.context.theme.boaPalette.base350
              }}
            >
              {cityName}
            </label>

            <div style={{ marginLeft: '0px' }}>
              <div style={this.state.selectedPrayer == 0 ? selectColor : styleItem}>
                <label style={this.state.selectedPrayer == 0 ? selectedText : unselectedText}>{sobriety}</label>
                <label style={this.state.selectedPrayer == 0 ? selectedText : unselectedText}>{this.state.sobriety} </label>
              </div>
              <div style={this.state.selectedPrayer == 1 ? selectColor : styleItem}>
                <label style={this.state.selectedPrayer == 1 ? selectedText : unselectedText}>{sun}</label>
                <label style={this.state.selectedPrayer == 1 ? selectedText : unselectedText}>{this.state.sun} </label>
              </div>
              <div style={this.state.selectedPrayer == 2 ? selectColor : styleItem}>
                <label style={this.state.selectedPrayer == 2 ? selectedText : unselectedText}>{noon}</label>
                <label style={this.state.selectedPrayer == 2 ? selectedText : unselectedText}>{this.state.noon} </label>
              </div>
              <div style={this.state.selectedPrayer == 3 ? selectColor : styleItem}>
                <label style={this.state.selectedPrayer == 3 ? selectedText : unselectedText}>{midAfternoon} </label>
                <label style={this.state.selectedPrayer == 3 ? selectedText : unselectedText}>{this.state.midAfternoon} </label>
              </div>
              <div style={this.state.selectedPrayer == 4 ? selectColor : styleItem}>
                <label style={this.state.selectedPrayer == 4 ? selectedText : unselectedText}>{night}</label>
                <label style={this.state.selectedPrayer == 4 ? selectedText : unselectedText}>{this.state.night} </label>
              </div>
              <div style={this.state.selectedPrayer == 5 ? selectColor : styleItem}>
                <label style={this.state.selectedPrayer == 5 ? selectedText : unselectedText}>{afterNight}</label>
                <label style={this.state.selectedPrayer == 5 ? selectedText : unselectedText}>{this.state.afterNight} </label>
              </div>
            </div>
          </div>
        </BCard>
      </div>
    );
  }
}

export default BPrayerComponent;
