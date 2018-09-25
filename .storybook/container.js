import React, { Component } from 'react';

import { BAppProvider, BComponent, setLocalization } from 'b-component';
import { getTheme } from 'b-theme';
import { BLocalization, } from 'b-localization'

import { getContext } from '../stories/base/context';

export default class Container extends BComponent {

  state = {
    context: getContext()
  }

  constructor(props) {
    super(props);
    this.onThemeChange = this.onThemeChange.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);

    setLocalization({
      url: 'http://boaonedev',
      path: '/messaging/',
      versionPath: 'MessagingVersions.json',
      fileNameFormat: 'BOA.Messaging.{0}.json',
      timeout: 3000,
      languageId: 1
    });
  }

  onThemeChange(themeName) {
    const theme = getTheme({ themeName: themeName });
    if (theme) {
      this.setState({ context: Object.assign({}, this.state.context, { theme }) });
    }
  }

  onLanguageChange(value) {
    const localization = { isRightToLeft: value === 5 ? true : false }
    BLocalization.changeLocalizationLanguage(value);
    this.setState({ context: Object.assign({}, this.state.context, { language: value, localization: localization, messagingContext: {} }) });
  }

  render() {
    const { story, context } = this.props;
    context.props = { context: this.state.context };
    context.props.onThemeChange = this.onThemeChange;
    context.props.onLanguageChange = this.onLanguageChange;

    return (
      <BAppProvider theme={this.state.context.theme}>
        {story(context)}
      </BAppProvider>
    );
  }
}

