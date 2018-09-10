import React from 'react';
import PropTypes from 'prop-types';
import { BAutoComplete } from 'b-auto-complete';
import { BComboBox } from 'b-combo-box';
import {MenuItem} from 'b-menu-item';
import Constants from './constants';
import { BLocalization } from 'b-localization';

import { BBusinessComponent } from 'b-business-component';
import isEqual from 'lodash/isEqual';
import { BComponentComposer } from 'b-component';

@BComponentComposer
export class BRegistryIntellisenseEditor extends BBusinessComponent {
  static propTypes = {
    ...BBusinessComponent.propTypes,
    /**
    * Aranmak istenilen Property ile ilgili Filitre verilme istenildiğinde kullanılır.
    */
    filter: PropTypes.func,

    propertySearchTextChanged: PropTypes.func,

    /**
    * Seçilen property lere type filtresi atmak için kullanılır.
    */
    propertyType: PropTypes.string,
    /**
    * Registry ComboBox'ın Görüntülenmesi için kullanılır
    */
    isRegistrySourceVisible: PropTypes.bool,
    /**
    * Process ComboBox'ın Görüntülenmesi için kullanılır
    */
    isProcessSourceVisible: PropTypes.bool,
    /**
    * Eğer kullanıcı dışarıdan property listesinin gösterilmesini istiyor ise dataSource'e atar
    */
    dataSource: PropTypes.any,
    /**
    * Eğer kullanıcı dışarıdan seçili Registry vermek istiyor ise selectedRegistryTypeName'e atar
    */
    selectedRegistryTypeName: PropTypes.string,
    /**
    * Eğer kullanıcı dışarıdan seçili Process vermek istiyor ise selectedProcessName'e atar
    */
    selectedProcessName: PropTypes.string,
    /**
    * Eğer kullanıcı dışarıdan seçili Searchtext vermek istiyor ise propertySearchText'e atar
    */
    propertySearchText: PropTypes.string,

    hintText: PropTypes.string,

    labelText: PropTypes.string,
  };
  static defaultProps = {
    ...BBusinessComponent.defaultProps,
    isRegistrySourceVisible: true,
    isProcessSourceVisible: true,
    propertyType: '',

    dataSource: [],

    defaultSelectedRegistryTypeName: '',
    defaultSelectedProcessName: '',
    defaultPropertySearchText: '',
    selectedRegistryTypeName: '',
    propertySearchText: '',
    selectedProcessName: '',
  }
  static menuItemStyle = {
    float: 'left',
    width: 256,
    height: '40px'
  };

  static innerDivStyle = {
    float: 'left',
    width: 256,
    margin: '0px'
  };

  static rootStyle = {
    minHeight: '40px',
    opacity: 1,
    width: '256px'
  };

  static menuItemPrimaryTextStyle = {
    float: 'left',
    fontWeight: 500,
    fontSize: '14px',
    color: '#212121',
    paddingTop: '4px',
    lineHeight: '20px',
    height: '24px',
    width: 256,
  };

  static menuProps = {
    maxHeight: 400
  };

  static popoverProps = {
    style: {
      width: '256px',
      marginLeft: '20px',
    },
  };

  constructor(props, context) {
    super(props, context);

    /**
    * Property Data Source
    */
    this.propertyDataSource = [];

    /**
    * Filitreleme için kulanılan anahtar
    */
    this.filterKeyText = null;

    this.filter = this.filter.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.propertySearchTextChanged = this.propertySearchTextChanged.bind(this);
    this.onRegistrySelected = this.onRegistrySelected.bind(this);
    this.onProcessSelected = this.onProcessSelected.bind(this);

    this.state = {
      // RegistryProp
      registryDataSource: [],
      selectedRegistry: {},
      selectedRegistryTypeName: this.props.selectedRegistryTypeName,

      // ProcessProp
      processDataSource: [],
      selectedProcessName: this.props.selectedProcessName,

      // PropertyProp
      propertyDataSource: [],
      propertySearchText: this.props.propertySearchText,
      propertyList: [],
      applicationContextPropertyList: [],
      iIdToNamePropertyList: [],

    };
  }

  propertyDataSourceConfig = {
    text: 'text',
    value: 'value'
  };

  componentWillMount() {

    super.componentWillMount();

    if (this.props.context.localization.isRightToLeft) {
      Object.assign({}, BRegistryIntellisenseEditor.popoverProps, { style: { marginRight: '20px' } });
      Object.assign({}, BRegistryIntellisenseEditor.innerDivStyle, { float: 'right' });
      Object.assign({}, BRegistryIntellisenseEditor.menuItemPrimaryTextStyle, { float: 'right', textAlign: 'right', color: this.props.context.theme.boaPalette.base450 });

    }
    else {
      Object.assign({}, BRegistryIntellisenseEditor.popoverProps, { style: { marginLeft: '20px' } });
      Object.assign({}, BRegistryIntellisenseEditor.innerDivStyle, { float: 'left' });
      Object.assign({}, BRegistryIntellisenseEditor.menuItemPrimaryTextStyle, { float: 'left', textAlign: 'left', color: this.props.context.theme.boaPalette.base450 });
    }
  }

  /**
  * Invoked immediately after a component is mounted
  */
  componentDidMount() {
    super.componentDidMount();
    this.loadData();
  }

  /**
 * Invoked before a mounted component receives new props
 * @param nextProps
 */
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      if ((nextProps.selectedRegistryTypeName != this.props.selectedRegistryTypeName) ||
        (nextProps.selectedProcessName != this.props.selectedProcessName) ||
        (nextProps.propertySearchText != this.props.propertySearchText) ||
        (nextProps.dataSource != this.props.dataSource)) {
        this.loadData(nextProps);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  /**
   * Load data
   * @param props
   */
  loadData(props) {
    props = props || this.props;
    this.setValue(props);
  }

  getValue() {
    // let registryItem = this.bRegistryComboBox.getValue();
    // let processItem = this.bProcessComboBox.getValue();

    let registry;
    let process;
    let property;

    property = this.state.propertySearchText;
    if (this.isRegistryVisible())
      registry = this.state.selectedRegistryTypeName;
    if (this.isProcessVisible())
      process = this.state.selectedProcessName;

    return {
      selectedRegistryTypeName: registry,
      propertySearchText: property,
      selectedProcessName: process
    };
  }

  /**
  * Get the data list
  * @returns {{registryList: Array, processList: Array, propertyList : Array}}
  */
  getValues() {
    return {
      registryList: this.state.registryDataSource || [],
      processList: this.state.processDataSource || [],
      propertyList: this.state.propertyDataSource || []
    };
  }

  /**
  * Set Property
  * @param props
  */
  setValue(props) {

    let selectedRegistryTypeName = props.selectedRegistryTypeName;
    let propertySearchText = props.propertySearchText;
    let propertyList = props.dataSource;

    // Registry Görünebilir ise RegistryList Set Edilir
    if (this.isRegistryVisible()) {
      let registryList = Object.assign([], BRegistryIntellisenseEditor.StaticRegistryDataSource);
      if (registryList && registryList.length > 0) {
        this.setRegistryDataSource(registryList, selectedRegistryTypeName);
      }
      else {
        this.getRegistryList();
      }
    }
    // Dışarıdan PropertyList Verimiş ise Property List Set Edilir
    else if (propertyList) {
      this.setState({
        propertyList: propertyList,
        propertySearchText: propertySearchText
      });
    }
    else {
      this.setState({
        propertyList: [],
        propertySearchText: this.props.defaultPropertySearchText
      });
    }

    // Default Aplication Context Static Listede Var ise Set Edilir
    var hasApplicationContentex = false;
    if (BRegistryIntellisenseEditor.StaticPropertyDataSource && BRegistryIntellisenseEditor.StaticPropertyDataSource.length > 0) {
      for (let index = 0; index < BRegistryIntellisenseEditor.StaticPropertyDataSource.length; index++) {
        let element = BRegistryIntellisenseEditor.StaticPropertyDataSource[index];
        if (element && element.key) {
          hasApplicationContentex = element.key.assemblyName == Constants.assemblyName.commonAssemblyName &&
            element.key.typeName == Constants.typeName.applicationContextTypeName &&
            element.key.propertyType == this.props.propertyType;
          if (hasApplicationContentex) {
            this.setState({
              applicationContextPropertyList: element.value
            });
            break;
          }
        }
      }
    }
    // Default Aplication Context Static Listede yok ise Server Tarafından Alınır
    if (hasApplicationContentex == false) {
      this.getPropertyListByDefault();
    }

    // Default IIdToNameTypeName Static Listede Var ise Set Edilir
    var hasIIdToNameTypeName = false;
    if (BRegistryIntellisenseEditor.StaticPropertyDataSource && BRegistryIntellisenseEditor.StaticPropertyDataSource.length > 0) {
      for (let index = 0; index < BRegistryIntellisenseEditor.StaticPropertyDataSource.length; index++) {
        let element = BRegistryIntellisenseEditor.StaticPropertyDataSource[index];
        if (element && element.key) {
          hasIIdToNameTypeName = element.key.assemblyName == Constants.assemblyName.commonAssemblyName &&
            element.key.typeName == Constants.typeName.iIdToNameTypeName;
          if (hasIIdToNameTypeName) {
            this.setIIdToNamePropertyList(element.value);
            break;
          }
        }
      }
    }
    // Default IIdToNameTypeName Static Listede yok ise Server Tarafından Alınır
    if (hasIIdToNameTypeName == false) {
      this.getMethodListByDefault();
    }

  }

  resetValue() {
    this.setState({
      registryDataSource: [],
      selectedRegistryTypeName: this.props.defaultSelectedRegistryTypeName,
      processDataSource: [],
      selectedProcessName: this.props.defaultSelectedProcessName,
      propertyList: [],
      propertyDataSource: [],
      propertySearchText: this.props.defaultPropertySearchText
    });
  }

  getSnapshot() {
    return { state: this.state };
  }

  setSnapshot(snapshot) {
    let { state } = snapshot;
    this.setState({ ...state });
  }


  /**
  * Set RegistryList from children
  * @param {any} registryList (registry list)
  * @param {any} selectedItem (selected registry item)
  */
  setRegistryDataSource(registryList, selectedItem) {
    let newRegistryList = [];
    registryList.forEach(function (registry) {
      if (registry.children && Array.isArray(registry.children)) {
        registry.children.forEach(function (registryChild) {
          if (registryChild) {
            newRegistryList.push(registryChild);
          }
        }, this);
      }
    }, this);

    // ekran selectedRegistryTypename dolu olarak yüklendiğinde
    // b-combo-box onselect fırlatılmadığından geçici olarak eklendi.
    let index = -1;
    if (selectedItem && selectedItem != null && selectedItem.length > 0) {
      index = newRegistryList.findIndex(x => x.typeName == selectedItem);
      if (index > -1) {
        this.getPropertyAndProcessList(newRegistryList[index]);
      }
    }

    if (index > -1) {
      this.setState({
        registryDataSource: newRegistryList,
        selectedRegistryTypeName: selectedItem,
        selectedRegistry: newRegistryList[index]
      });
    }
    else {
      this.setState({
        registryDataSource: newRegistryList
      });
    }
  }

  /**
  * Set iIdToNamePropertyList from propertyList
  * @param {any} propertyList (property list)
  */
  setIIdToNamePropertyList(propertyList) {
    let newPropertyList = [];
    let index = -1;
    propertyList.forEach(function (property) {
      index = property.indexOf('(');
      if (index > -1) {
        let preString = property.substring(0, index);
        let postString = property.substring(index, property.length);
        postString = postString.replace('.', '_');
        newPropertyList.push(preString + postString);
      }
    }, this);

    this.setState({
      iIdToNamePropertyList: newPropertyList
    });
  }

  /**
  * Load Property and Process data from server side or static list by selected registry item
  * @param {any} selectedItem (selected registry item)
  */
  getPropertyAndProcessList(selectedItem) {

    // Seçili Registry için Property Static Listede Var ise Set Edilir
    let hasProperty = false;
    if (BRegistryIntellisenseEditor.StaticPropertyDataSource && BRegistryIntellisenseEditor.StaticPropertyDataSource.length > 0) {
      for (let index = 0; index < BRegistryIntellisenseEditor.StaticPropertyDataSource.length; index++) {
        let element = BRegistryIntellisenseEditor.StaticPropertyDataSource[index];
        if (element && element.key) {
          hasProperty = element.key.assemblyName == selectedItem.assemblyName &&
            element.key.typeName == selectedItem.typeName &&
            element.key.propertyType == this.props.propertyType;
          if (hasProperty) {
            this.setState({
              propertyList: element.value
            });
            break;
          }
        }
      }
    }
    // Seçili Registry için Property Static Listede yok ise Server Tarafında Set Edilir
    if (hasProperty == false) {

      this.getPropertyListByRegistry(selectedItem);
    }

    if (this.isProcessVisible()) {

      // Seçili Registry için Process Static Listede Var ise Set Edilir
      let hasProcess = false;
      if (BRegistryIntellisenseEditor.StaticProcessDataSource && BRegistryIntellisenseEditor.StaticProcessDataSource.length > 0) {
        for (let index = 0; index < BRegistryIntellisenseEditor.StaticProcessDataSource.length; index++) {
          let element = BRegistryIntellisenseEditor.StaticProcessDataSource[index];
          if (element && element.key) {
            hasProcess = element.key.assemblyName == selectedItem.assemblyName &&
              element.key.typeName == selectedItem.typeName;
            if (hasProcess) {
              this.setState({
                processDataSource: element.value
              });
              break;
            }
          }
        }
      }
      // Seçili Registry için Process Static Listede yok ise Server Tarafında Set Edilir
      if (hasProcess == false) {

        this.getProcessListByRegistry(selectedItem);
      }
    }
  }

 /**
  * Load Registry data from data base
  * @param {any} callback (isSuccess: bool, value: any)
  */
  getRegistryList(response) {
    if (!response) {
      let proxyRequest = {
        requestClass: 'BOA.Types.BusinessComponents.RegistryRequest',
        requestBody: {
          MethodName: 'GetRegistryList',
          CanGetActions: false,
          DoNotUseCache: true,
        },
        key: 'getRegistryList'
      };
      this.proxyExecute(proxyRequest);
      return;
    }

    if (response.success) {
      BRegistryIntellisenseEditor.StaticRegistryDataSource = response.value;
      this.setRegistryDataSource(response.value, this.props.selectedRegistryTypeName);

    } else {
      this.setState({
        registryDataSource: [],
        selectedRegistryTypeName: this.props.defaultSelectedRegistryTypeName
      });
    }

  }
  /**
  * Load Property data from server side By ApplicationContextTypeName
  * @param {any} callback (isSuccess: bool, value: any)
  */
  getPropertyListByDefault(response) {
    if (!response) {
      let registryDefinition = {
        AssemblyName: Constants.assemblyName.commonAssemblyName,
        TypeName: Constants.typeName.applicationContextTypeName,
        PropertyType: this.props.propertyType
      };

      let proxyRequest = {
        requestClass: 'BOA.Types.BusinessComponents.RegistryRequest',
        requestBody: {
          MethodName: 'GetPropertyListByRegistry',
          RegistryDefinition: registryDefinition
        },
        key: 'getPropertyListByDefault'
      };
      this.proxyExecute(proxyRequest);
      return;
    }

    if (response.success) {
      if (!BRegistryIntellisenseEditor.StaticPropertyDataSource)
        BRegistryIntellisenseEditor.StaticPropertyDataSource=[];

      BRegistryIntellisenseEditor.StaticPropertyDataSource.push({
        key: {
          assemblyName: Constants.assemblyName.commonAssemblyName,
          typeName: Constants.typeName.applicationContextTypeName,
          propertyType: this.props.propertyType
        },
        value: response.value
      });

      this.setState({
        applicationContextPropertyList: response.value
      });
    }
  }

  /**
  * Load Property data from server side By Registry
  * @param {any} callback (isSuccess: bool, value: any)
  * @param {any} selectedRegistry
  */
  getPropertyListByRegistry(selectedRegistry, response) {
    if (!response) {
      if (selectedRegistry) {
        let registryDefinition = {
          AssemblyName: selectedRegistry.assemblyName,
          TypeName: selectedRegistry.typeName,
          PropertyType: this.props.propertyType
        };

        let proxyRequest = {
          requestClass: 'BOA.Types.BusinessComponents.RegistryRequest',
          requestBody: {
            MethodName: 'GetPropertyListByRegistry',
            RegistryDefinition: registryDefinition
          },
          key: 'getPropertyListByRegistry',
          params:{selectedRegistry:selectedRegistry}
        };
        this.proxyExecute(proxyRequest);
        return;
      }
    }

    if (response.success) {

      if (!BRegistryIntellisenseEditor.StaticPropertyDataSource)
        BRegistryIntellisenseEditor.StaticPropertyDataSource=[];

      BRegistryIntellisenseEditor.StaticPropertyDataSource.push({
        key: {
          assemblyName: selectedRegistry.assemblyName,
          typeName: selectedRegistry.typeName,
          propertyType: this.props.propertyType
        },
        value: response.value
      });
      this.setState({
        propertyList: response.value
      });
    }
    else {
      this.setState({
        propertyList: []
      });
    }
  }
  /**
  * Load Process data from data base By Registry
  * @param {any} selectedRegistry
  */
  getProcessListByRegistry(selectedRegistry, response) {
    if (!response) {
      if (selectedRegistry) {
        let registryDefinition = {
          AssemblyName: selectedRegistry.assemblyName.replace('.dll', ''),
          TypeName: selectedRegistry.typeName.replace('.dll', '')
        };

        let proxyRequest = {
          requestClass: 'BOA.Types.BusinessComponents.RegistryRequest',
          requestBody: {
            MethodName: 'GetProcessList',
            RegistryDefinition: registryDefinition
          },
          key: 'getProcessListByRegistry',
          params:{selectedRegistry:selectedRegistry}
        };
        this.proxyExecute(proxyRequest);
        return;
      }
    }

    if (response.success) {

      var newProcessList = [];
      newProcessList.push({
        processName: this.getMessage('BusinessComponents', 'Select')
      });
      response.value.forEach((process) => {
        newProcessList.push({
          processName: process
        });
      }, this);
      if (!BRegistryIntellisenseEditor.StaticProcessDataSource)
        BRegistryIntellisenseEditor.StaticProcessDataSource=[];
      BRegistryIntellisenseEditor.StaticProcessDataSource.push({
        key: {
          assemblyName: selectedRegistry.assemblyName,
          typeName: selectedRegistry.typeName
        },
        value: newProcessList
      });

      this.setState({
        processDataSource: newProcessList
      });
    }
    else {
      this.setState({
        processDataSource: []
      });
    }
  }

  /**
  * Load Methods data from data base By Default
  * @param {any} callback (isSuccess: bool, value: any)
  */
  getMethodListByDefault(response) {
    if (!response) {
      let registryDefinition = {
        AssemblyName: Constants.assemblyName.commonAssemblyName,
        TypeName: Constants.typeName.iIdToNameTypeName,
      };

      let proxyRequest = {
        requestClass: 'BOA.Types.BusinessComponents.RegistryRequest',
        requestBody: {
          MethodName: 'GetMethodListByRegistry',
          RegistryDefinition: registryDefinition
        },
        key: 'getMethodListByDefault'
      };
      this.proxyExecute(proxyRequest);
      return;
    }

    if (response.success) {
      if (!BRegistryIntellisenseEditor.StaticPropertyDataSource)
        BRegistryIntellisenseEditor.StaticPropertyDataSource=[];
      BRegistryIntellisenseEditor.StaticPropertyDataSource.push({
        key: {
          assemblyName: Constants.assemblyName.commonAssemblyName,
          typeName: Constants.typeName.iIdToNameTypeName
        },
        value: response.value
      });
      this.setIIdToNamePropertyList(response.value);
    }
  }

  proxyDidRespond(proxyResponse) {
    let { response, key, params } = proxyResponse;
    switch (key) {
      case 'getRegistryList':
        this.getRegistryList(response);
        break;
      case 'getPropertyListByDefault':
        this.getPropertyListByDefault(response);
        break;
      case 'getPropertyListByRegistry':
        this.getPropertyListByDefault(params.selectedRegistry, response);
        break;
      case 'getProcessListByRegistry':
        this.getProcessListByRegistry(params.selectedRegistry, response);
        break;
      case 'getMethodListByDefault':
        this.getMethodListByDefault(response);
        break;
      default:
        break;
    }
  }
  updatePropertyDataSource() {

    var lastText = this.getLastText();
    if (lastText && lastText != null && lastText != '') {

      this.state.propertyList.forEach((property) => {
        if (property.substring(0, lastText.length) == lastText) {
          var subText1 = property.substring(lastText.length);
          var subText2 = subText1.substring(0, subText1.indexOf('.') == -1 ? subText1.length : subText1.indexOf('.'));
          if (this.propertyDataSource.findIndex(x => x.text == subText2) == -1)
            this.setPropertyDataSource(subText2);
        }
      }, this);

      this.state.applicationContextPropertyList.forEach((property) => {
        if (property.substring(0, lastText.length) == lastText) {
          var subText1 = property.substring(lastText.length);
          var subText2 = subText1.substring(0, subText1.indexOf('.') == -1 ? subText1.length : subText1.indexOf('.'));
          if (this.propertyDataSource.findIndex(x => x.text == subText2) == -1)
            this.setPropertyDataSource(subText2);
        }
      }, this);

      this.state.iIdToNamePropertyList.forEach((property) => {
        if (property.substring(0, lastText.length) == lastText) {
          var subText1 = property.substring(lastText.length);
          var subText2 = subText1.substring(0, subText1.indexOf('.') == -1 ? subText1.length : subText1.indexOf('.'));
          if (this.propertyDataSource.findIndex(x => x.text == subText2) == -1)
            this.setPropertyDataSource(subText2);
        }
      }, this);

      this.setState({
        propertyDataSource: this.propertyDataSource
      });
    }
  }

  getLastText() {

    var lastText = this.state.propertySearchText;
    if (lastText == null || lastText == '' || lastText.indexOf('..') > -1 || lastText[0] == '.') {
      lastText = '';
    }

    if (lastText.length >= 2 && lastText.endsWith('.')) {

      if (lastText.substring(0, 2) == Constants.controlKey.defaultControlKey) {
        if ((lastText.split('.').length - 1) == 1) {
          this.filterKeyText = Constants.controlKey.defaultControlKey;
        }
        else if ((lastText.split('.').length - 1) >= 2) {
          this.filterKeyText = lastText.substring(0, lastText.lastIndexOf('.') + 1);
        }
        this.propertyDataSource = [];

        if (this.isRegistryVisible() && this.state.selectedRegistry != null && this.state.selectedRegistry != undefined) {
          lastText = this.state.selectedRegistry.typeName + lastText.substring(1, lastText.length);
        }
        else {
          lastText = lastText.substring(0, lastText.length);
        }
      }

      if (lastText.substring(0, 2) == Constants.controlKey.applicationContextControlKey) {
        if ((lastText.split('.').length - 1) == 1) {
          this.filterKeyText = Constants.controlKey.applicationContextControlKey;
        }
        else if ((lastText.split('.').length - 1) >= 2) {
          this.filterKeyText = lastText.substring(0, lastText.lastIndexOf('.') + 1);
        }
        this.propertyDataSource = [];
        lastText = Constants.typeName.applicationContextTypeName + lastText.substring(1, lastText.length);
      }

      if (lastText.substring(0, 2) == Constants.controlKey.iIdToNameControlKey) {
        if ((lastText.split('.').length - 1) == 1) {
          this.filterKeyText = Constants.controlKey.iIdToNameControlKey;
        }
        else if ((lastText.split('.').length - 1) >= 2) {
          this.filterKeyText = lastText.substring(0, lastText.lastIndexOf('.') + 1);
        }
        this.propertyDataSource = [];
        lastText = Constants.typeName.iIdToNameTypeName + lastText.substring(1, lastText.length);
      }

      if (lastText.substring(0, 2) == Constants.controlKey.dataContractControlKey) {
        if ((lastText.split('.').length - 1) == 1) {
          this.filterKeyText = Constants.controlKey.dataContractControlKey;
        }
        else if ((lastText.split('.').length - 1) >= 2) {
          this.filterKeyText = lastText.substring(0, lastText.lastIndexOf('.') + 1);
        }
        this.propertyDataSource = [];

        if (this.isRegistryVisible() && this.state.selectedRegistry != null && this.state.selectedRegistry != undefined) {
          lastText = this.state.selectedRegistry.typeName + '.DataContract' + lastText.substring(1, lastText.length);
        }
        else {
          lastText = lastText.substring(0, lastText.length);
        }
      }

      if (lastText.substring(0, 3) == Constants.controlKey.boaMessageControlKey) {
        if ((lastText.split('.').length - 1) == 1) {
          this.filterKeyText = Constants.controlKey.boaMessageControlKey;
        }
        else if ((lastText.split('.').length - 1) >= 2) {
          this.filterKeyText = lastText.substring(0, lastText.lastIndexOf('.') + 1);
        }
        this.propertyDataSource = [];
        lastText = lastText.substring(0, lastText.length);
      }
    }
    else {
      lastText = '';
    }

    return lastText;
  }

  setPropertyDataSource(key) {

    let _popoverProps = {};
    if (this.props.context.localization.isRightToLeft) {
      _popoverProps = Object.assign({}, this.state.popoverProps, { style: { marginRight: (this.filterKeyText.length * 8), width: '256px' } }); // - (this.filterKeyText.length * 8)
    }
    else {
      _popoverProps = Object.assign({}, this.state.popoverProps, { style: { marginLeft: (this.filterKeyText.length * 8), width: '256px' } }); // - (this.filterKeyText.length * 8)
    }

    BRegistryIntellisenseEditor.popoverProps = _popoverProps;

    this.propertyDataSource.push({
      text: key,
      value: <MenuItem
        hoverColor='rgba(255,255,255,0.15)'
        style={BRegistryIntellisenseEditor.rootStyle}
        innerDivStyle={BRegistryIntellisenseEditor.innerDivStyle}
        secondaryText={<div style={BRegistryIntellisenseEditor.menuItemStyle}>
          <span style={BRegistryIntellisenseEditor.menuItemPrimaryTextStyle}>{key}</span>
        </div>} />
    });
  }

  /**
  * Property Text'in filtrelenmesi için kullanılır
  */
  filter(searchText, key) {
    if (this.props.filter) {
      this.props.filter(searchText, key);
    }
    else {
      if (searchText.length > 1) {
        key = this.filterKeyText + key;

        if (searchText == BLocalization.stringUpperCase(Constants.controlKey.defaultControlKey) ||
          searchText == BLocalization.stringUpperCase(Constants.controlKey.applicationContextControlKey) ||
          searchText == BLocalization.stringUpperCase(Constants.controlKey.boaMessageControlKey) ||
          searchText == BLocalization.stringUpperCase(Constants.controlKey.boaMessageControlKey).substring(0, 2) ||
          searchText == BLocalization.stringUpperCase(Constants.controlKey.dataContractControlKey) ||
          searchText == BLocalization.stringUpperCase(Constants.controlKey.iIdToNameControlKey)) {
          return key.indexOf(searchText) !== -1;
        }

        return BLocalization.stringLowerCase(key).indexOf(BLocalization.stringLowerCase(searchText)) !== -1;
      }
    }
  }

  /**
  * Property Text seçildikden sonra yapılacaklar
  */
  onNewRequest() {
    this.bPropertyAutoComplate.getInstance().focus();
  }

  /**
  * Property Text girilirken yapılacaklar
  */
  onUpdateInput(searchText) {
    if (this.state.propertyDataSource.findIndex(x => x.text == searchText) > -1)
      searchText = this.filterKeyText + searchText;

    this.setState({
      propertySearchText: searchText
    }, () => this.propertySearchTextChanged());
  }

  onKeyUp(e) {
    if (e.keyCode != Constants.keyCodes.homeKey &&
      e.keyCode != Constants.keyCodes.endKey &&
      e.keyCode != Constants.keyCodes.leftShiftKey &&
      e.keyCode != Constants.keyCodes.rightShiftKey &&
      e.keyCode != Constants.keyCodes.deleteKey &&
      e.keyCode != Constants.keyCodes.backKey &&
      e.keyCode != Constants.keyCodes.escapeKey &&
      e.keyCode != Constants.keyCodes.rightCtrlKey &&
      e.keyCode != Constants.keyCodes.leftCtrlKey &&
      e.keyCode != Constants.keyCodes.upKey &&
      e.keyCode != Constants.keyCodes.downKey &&
      e.keyCode != Constants.keyCodes.lefKey &&
      e.keyCode != Constants.keyCodes.rightKey) {
      this.updatePropertyDataSource();
    }
  }

  propertySearchTextChanged() {
    if (this.props.propertySearchTextChanged)
      this.props.propertySearchTextChanged();
  }

  onRegistrySelected(index, selectedItems, selectedValues) {
    if (selectedItems && selectedItems.length > 0) {

      let selectedItem = selectedItems[0];
      let selectedValue = selectedValues[0];

      this.setState({
        selectedRegistry: selectedItem,
        selectedRegistryTypeName: selectedValue,
        selectedProcessName: '',
        processDataSource: [],
        propertySearchText: '',
        propertyList: []
      });

      this.getPropertyAndProcessList(selectedItem);
    }
  }

  onProcessSelected(index, selectedItems, selectedValues) {

    if (selectedItems && selectedItems.length > 0) {
      let selectedValue = selectedValues[0];

      this.setState({
        selectedProcessName: selectedValue
      });
    }
  }

  /**
  * Registry Combox'ın görünürülüğü için kullanılır
  */
  isRegistryVisible() {
    return this.props.isRegistrySourceVisible == true;
  }
  /**
  * Process Combox'ın görünürülüğü için kullanılır
  */
  isProcessVisible() {
    return this.props.isRegistrySourceVisible == true &&
      this.props.isProcessSourceVisible == true;
  }

  render() {
    let registryColumns = [
      { key: 'registryID', name: this.getMessage('CoreBanking', 'RegistryId'), width: 50, type: 'string', resizable: true },
      { key: 'typeName', name: this.getMessage('BusinessComponents', 'TypeName'), width: 300, type: 'string', resizable: true },
      { key: 'registryDescription', name: this.getMessage('Parameters', 'RegistryDescription'), width: 300, type: 'string', resizable: true }
    ];

    let processColumns = [
      { key: 'processName', name: this.getMessage('CoreBanking', 'ProcessLabel'), width: 200, type: 'string', resizable: true },
    ];

    let m = this.props.isProcessSourceVisible == false && this.props.isRegistrySourceVisible == false;
    let dataSource = this.state.propertyDataSource;
    if (m) {
      if (dataSource && Array.isArray(dataSource) && dataSource.length == 0) {
        dataSource = this.state.propertyList;
      }
    }

    return (

      <div>
        {this.isRegistryVisible() ?
          <BComboBox
              id="bRegistryComboBoxId"
              ref={r => this.bRegistryComboBox = r}
              context={this.props.context}
              columns={registryColumns}
              valueMemberPath={'typeName'}
              displayMemberPath={'typeName'}
              value={[this.state.selectedRegistryTypeName]}
              dataSource={this.state.registryDataSource}
              multiColumn={true}
              multiSelect={false}
              isAllOptionIncluded={false}
              onSelect={this.onRegistrySelected}
              hintText={this.getMessage('CoreBanking', 'RegistryId')}
              labelText={this.getMessage('CoreBanking', 'RegistryId')}
              disabled={false}
              fullWidth={true}
              disableSearch={false}>
          </BComboBox> : <div />
          }
        <BAutoComplete
            id="bPropertyAutoComplateId"
            ref={r => this.bPropertyAutoComplate = r}
            context={this.props.context}
            searchText={this.state.propertySearchText}
            hintText={this.props.hintText}
            floatingLabelText={this.props.labelText}
            dataSource={dataSource}
            dataSourceConfig={this.propertyDataSourceConfig}
            fullWidth={true}
            underlineShow={true}
            filter={this.filter}
            onNewRequest={this.onNewRequest}
            onUpdateInput={this.onUpdateInput}
            onKeyUp={this.onKeyUp}
            popoverProps={BRegistryIntellisenseEditor.popoverProps}
            menuProps={BRegistryIntellisenseEditor.menuProps}>
        </BAutoComplete>
        {this.isProcessVisible() ?
          <BComboBox
              id="bProcessComboBoxId"
              ref={r => this.bProcessComboBox = r}
              context={this.props.context}
              columns={processColumns}
              valueMemberPath={'processName'}
              displayMemberPath={'processName'}
              value={[this.state.selectedProcessName]}
              dataSource={this.state.processDataSource}
              multiColumn={true}
              multiSelect={false}
              isAllOptionIncluded={false}
              onSelect={this.onProcessSelected}
              hintText={this.getMessage('CoreBanking', 'ProcessLabel')}
              labelText={this.getMessage('CoreBanking', 'ProcessLabel')}
              disabled={false}
              fullWidth={true}
              disableSearch={false}>
          </BComboBox> : <div />
          }
      </div>

    );
  }

}

BRegistryIntellisenseEditor.StaticRegistryDataSource = [];
BRegistryIntellisenseEditor.StaticProcessDataSource = [];
BRegistryIntellisenseEditor.StaticPropertyDataSource = [];


export default BRegistryIntellisenseEditor;
