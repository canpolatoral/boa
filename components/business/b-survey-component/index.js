import React from 'react';
// import PropTypes from 'prop-types';
import { BBusinessComponent } from 'b-business-component';
import { BComponentComposer } from 'b-component';
import { BCard } from 'b-card';
import { BLabel } from 'b-label';
import { BRadioButtonGroup } from 'b-radio-button-group';
import { BButton } from 'b-button';
import { BDivider } from 'b-divider';
import { BCheckBoxGroup } from 'b-check-box-group';
import { BProgress } from 'b-progress';

@BComponentComposer
export class BSurveyComponent extends BBusinessComponent {

  static propTypes = {
    ...BBusinessComponent.propTypes
  };

  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    stateVisible: true
  };

  constructor(props, context) {
    super(props, context);
    // this.onButtonClick = this.onButtonClick.bind(this);
    this.state = {
      activeSurveyList: [],
      newActiveSurveyList: [],
      choices: [],
      totalCount: 0,
      newSurveyId: false
    };
  }

  ButtonText = 'TAMAM';

  onButtonClick = (selectedSurvey) => {

    if (selectedSurvey.selectedChoicesIds != null && selectedSurvey.selectedChoicesIds.length > 0) {
      this.insertUserAnswerFunc (selectedSurvey.id, selectedSurvey.selectedChoicesIds);
    }
    else
    {
      // TAMAM a basmadan önce bir seçenek seçmelisiniz
    }

  }

  onChangeFunc (surveyId, newSelectedValueId) {
    this.setState({ newValue: newSelectedValueId });                         // Gereksiz satır, ama silince RadioButton un yeni tıklanan seçeneği görsel olarak görünmüyor
    
    let newSelectedChoicesIds = [parseInt(newSelectedValueId, 10)]; 
    let newActiveSurveyList = this.state.activeSurveyList;
    
    for (let i = 0; i < newActiveSurveyList.length; i++) {
      if (surveyId == newActiveSurveyList[i].id) {
        newActiveSurveyList[i].valueSelected = newSelectedValueId;
        newActiveSurveyList[i].selectedChoicesIds = newSelectedChoicesIds;
      }
    }

    this.setState({ activeSurveyList: newActiveSurveyList });
  }
  
  onCheckFunc (surveyInfo, newSelectedChoicesIds) {
    this.setState({ newValue: newSelectedChoicesIds });                         // Gereksiz satır, ama silince max seçim sınırı için disabele olmuyor

    let newActiveSurveyList = this.state.activeSurveyList;
    
    for (let i = 0; i < newActiveSurveyList.length; i++) {
      if (surveyInfo.id == newActiveSurveyList[i].id) {
        newActiveSurveyList[i].selectedChoicesIds = newSelectedChoicesIds;

        if (newSelectedChoicesIds.length == newActiveSurveyList[i].maxMultiAnswerCount) {
          for (let j = 0; j < newActiveSurveyList[i].choices.length; j++) {
            if (!newSelectedChoicesIds.includes(newActiveSurveyList[i].choices[j].value)) {
              newActiveSurveyList[i].choices[j].disabled = true;
            }
          }
        }
        else {
          newActiveSurveyList[i].choices.forEach((choice) => {
            choice.disabled = false;
          });                                                                   // ,this   silllllllllllllllllll
        }
      }
    }

    this.setState({ activeSurveyList: newActiveSurveyList });
  }

  refreshActiveSurveyList() {
    let getActiveSurveyList = {
      requestClass: 'BOA.Types.Container.BOAPortalRequest',
      requestBody: {
        MethodName: 'RefreshEducationAndSurvey'
      },
      key: 'getRefreshedActiveSurveyList'
    };
    this.proxyTransactionExecute(getActiveSurveyList);
  }

  insertUserAnswerFunc(surveyId, selectedChoicesIds) {
    let insertUserAnswerRequest = {
      requestClass: 'BOA.Types.Container.SurveyRequest',
      requestBody: {
        ChoiceId : selectedChoicesIds,
        SurveyId : surveyId,
        MethodName: 'InsertUserAnswer'
      },
      key: 'insertUserAnswer'
    };
    this.proxyTransactionExecute(insertUserAnswerRequest);
  }

  newSurveyFunc (surveyObject) {
    this.setState({ choices: [] });
    this.setState({ totalCount: 0 });

    surveyObject.choices.forEach((choice) => {

      this.setState({
        choices: [...this.state.choices, {
          value: choice.choiceId,
          label: choice.choice,
          count: choice.count,
          disabled: false
        }]
      });

      this.setState({ totalCount: this.state.totalCount + choice.count});
    }, this);

    this.setState({
      newActiveSurveyList: [...this.state.newActiveSurveyList, {
        id: surveyObject.surveyId,
        question: surveyObject.question,
        choices: this.state.choices,
        selectedChoicesIds: null,
        valueSelected: null,
        totalCount: this.state.totalCount,
        isAnswered: surveyObject.isAnswered,
        isMultiSelection: surveyObject.isMultiSelectionEnabled,
        maxMultiAnswerCount: surveyObject.maxMultiAnswerCount
      }]
    });
    this.activeSurveyList=this.state.newActiveSurveyList;     // sillllllllllllllllllllllllllllllllllllllllllllllllllllllll
  }

  refreshSurveyListFunc (surveyList) {

    if (this.state.activeSurveyList != null && this.state.activeSurveyList.length > 0) {
      this.setState({ newActiveSurveyList: [] });
      for (let i = 0; i < surveyList.length; i++) {
        if (!surveyList[i].isAnswered) {
          this.setState({ newSurveyId: true });
          for (let j = 0; j < this.state.activeSurveyList.length; j++) {
            if (surveyList[i].surveyId == this.state.activeSurveyList[j].id) {
              // TODO
              this.setState({ newSurveyId: false });
              this.setState({
                newActiveSurveyList: [...this.state.newActiveSurveyList, this.state.activeSurveyList[j]]
              });
            }
          }
          if (this.state.newSurveyId) {
            // TODO
            this.setState({ newSurveyId: false });
            this.newSurveyFunc (surveyList[i]);
          }
        }
        else {
          // TODO
          this.newSurveyFunc (surveyList[i]);
        }
        this.setState({ newSurveyId: false });
      }
      this.setState({ activeSurveyList: this.state.newActiveSurveyList });
    }
    else
    {
      // TODO
      this.setState({ activeSurveyList: [] });
      this.setState({ newActiveSurveyList: [] });
      
      surveyList.forEach((item) => {

        this.newSurveyFunc (item);
      }, this);
      this.setState({ activeSurveyList: this.state.newActiveSurveyList });
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key } = proxyResponse;
    switch (key) {
      case 'getRefreshedActiveSurveyList':
        if (response.success == true) {
          if (response.value.surveyList != null && response.value.surveyList.length > 0) {
            this.refreshSurveyListFunc(response.value.surveyList);
          }
          else {
            // TODO
            // getMessage: Aktif anket bulunamadı
          }
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;

      case 'insertUserAnswer':
        if (response.success == true) {
          this.refreshActiveSurveyList();
        }
        else {
          this.debugLog(this.resultErrorListToString(response.results), 3);
        }
        break;

      default:
        break;
    }
  }

  getResultBCard (surveyInfo) {
    let textAlign = { 'text-align': 'right' };
    let newResultBCard = [];
    for (let j = 0; j < surveyInfo.choices.length; j++) {
      newResultBCard.push(
        <div>
          <BLabel
            context={this.props.context}
            text={surveyInfo.choices[j].label}
            style={{ marginTop: '15px' }}
          />
          <table style={{width:'100%'}}>
            <tr>
              <td style={{width:'70%'}}>
                <BProgress context={this.props.context}
                  size={20}
                  progressType={'linear'}
                  mode={'determinate'}
                  value={ surveyInfo.choices[j].count / surveyInfo.totalCount * 100 }
                />
              </td>

              <td style={{width:'20%'}}>
                <BLabel
                  context={this.props.context}
                  text={surveyInfo.choices[j].count}
                  style={textAlign}
                />
              </td>

              <td style={{width:'10%'}}>
                <BLabel
                  context={this.props.context}
                  text={ '% '+ surveyInfo.choices[j].count / surveyInfo.totalCount * 100 }
                  style={textAlign}
                />
              </td>
            </tr>
          </table>
        </div>
      );
    }
    return newResultBCard;
  }


  getActiveSurveyBCards = () => {
    // Anketleri listele
    let qustionStyle = { paddingBottom: '0px', marginBottom: '-10px' };
    if (this.state.activeSurveyList != null && this.state.activeSurveyList.length > 0) {
      let newActiveSurveyBCards = [];
      for (let i = 0; i < this.state.activeSurveyList.length; i++) {
        if (!this.state.activeSurveyList[i].isAnswered) {
          if (!this.state.activeSurveyList[i].isMultiSelection) {
            newActiveSurveyBCards.push(
              <BCard
                context={this.props.context}
                style={{ marginBottom: '15px' }}
              >
                <div>
                  <BLabel
                    context={this.props.context}
                    text={this.state.activeSurveyList[i].question}
                    style={qustionStyle}
                  />
                  <BRadioButtonGroup
                    context={this.props.context}
                    items={this.state.activeSurveyList[i].choices}
                    style={{ marginTop: '-15px', paddingTop: '0px', marginBottom: '-10px' }}
                    valueSelected = {this.state.activeSurveyList[i].valueSelected}
                    onChange={(event) => {
                      this.onChangeFunc(this.state.activeSurveyList[i].id, event.target.value);
                    }}
                  />
                  <BDivider
                    style={{ marginBottom: '0px', marginRight: '-20px', marginLeft: '-20px' }}
                  />
                  <center>
                    <BButton
                      context={this.props.context}
                      type="flat"
                      text={this.ButtonText}
                      style={{ marginBottom: '-15px' }}
                      colorType="primary"
                      onClick={() => {
                        this.onButtonClick(this.state.activeSurveyList[i]);
                      }}
                    />
                  </center>
                </div>
              </BCard>
            );
          }
          else {
            newActiveSurveyBCards.push(
              <BCard
                context={this.props.context}
                style={{ marginBottom: '15px' }}
              >
                <div>
                  <BLabel
                    context={this.props.context}
                    text={this.state.activeSurveyList[i].question}
                    style={qustionStyle}
                  />
                  <BCheckBoxGroup
                    context={this.props.context}
                    items={this.state.activeSurveyList[i].choices}
                    style={{ marginTop: '-15px', paddingTop: '0px', marginBottom: '-10px' }}
                    // disabled = {false}
                    // checked={this.state._bsmvIncluded}
                    onChange={(v) => {
                      this.onCheckFunc(this.state.activeSurveyList[i], v);
                    }}
                  />
                  <BDivider
                    style={{ marginBottom: '0px', marginRight: '-20px', marginLeft: '-20px' }}
                  />
                  <center>
                    <BButton
                      context={this.props.context}
                      type="flat"
                      text={this.ButtonText}
                      style={{ marginBottom: '-15px' }}
                      colorType="primary"
                      onClick={() => {
                        this.onButtonClick(this.state.activeSurveyList[i]);
                      }}
                    />
                  </center>
                </div>
              </BCard>
            );
          }
        }
        else {
          // TODO
          newActiveSurveyBCards.push(
            <BCard
              context={this.props.context}
              style={{ marginBottom: '15px' }}
            >
              <div>
                <BLabel
                  context={this.props.context}
                  text={this.state.activeSurveyList[i].question}
                  style={qustionStyle, {marginBottom: '10px' }}
                />
                {this.getResultBCard(this.state.activeSurveyList[i])}
              </div>
            </BCard>
          );
        }
      }
      return newActiveSurveyBCards;
    }
  }


  componentDidMount() {
    super.componentDidMount();
    this.refreshActiveSurveyList();
  }

  render() {
    const { context } = this.props;
    /*
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
    */

    return (
      <div style={{ width: '500px' }} >
        <BLabel context={context} text={this.getMessage('BusinessComponents', 'Survey')} />
        {this.getActiveSurveyBCards()}
      </div>
    );
  }
}

export default BSurveyComponent;