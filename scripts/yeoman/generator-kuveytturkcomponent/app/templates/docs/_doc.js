import 'babel-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ComponentDoc from '../../../base/doc/code-example/component-doc';
import * as Themes from 'kuveytturkthemes'
var defaults = require('../assets/data/defaults.json');
var documentContent = require('./content.json');

class <%=componentPage%> extends React.Component {

    constructor() {
        super();
        this.state = {};
    }



    render() {
        let componentInfo = documentContent;
        let defaultProps = defaults[0].props;
        defaultProps['context'] = {deviceSize: 3, platform: 1, theme: Themes.classictheme};
         return (
            <ComponentDoc
                name="<%=componentPage%>"
                componentInfo={componentInfo}>
               
                </ComponentDoc>
        );
    }
}

ReactDOM.render(React.createElement(<%=componentPage%>), document.getElementById('app'));