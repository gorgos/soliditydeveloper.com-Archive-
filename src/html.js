import React from 'react';

import favicon from './favicon.ico';

export default class HTML extends React.Component {
  render() {
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          {this.props.headComponents}
          <link rel="shortcut icon" href={favicon} />
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }

  componentDidMount() {
    const configScript = document.createElement("script");
    configScript.type = "text/javascript"
    configScript.src = "//downloads.mailchimp.com/js/signup-forms/popup/unique-methods/embed.js";
    configScript.dataDojoConfig = "usePlainJson: true, isDebug: false"
    configScript.async = true;

    const script = document.createElement("script");
    script.type = "text/javascript"
    script.async = true;
    script.innerHTML = 'window.dojoRequire(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us19.list-manage.com","uuid":"a407f3acc50091c0f47426c21","lid":"faec4da08d","uniqueMethods":true}) })'

    document.body.appendChild(configScript);
    document.body.appendChild(script);
  }
}