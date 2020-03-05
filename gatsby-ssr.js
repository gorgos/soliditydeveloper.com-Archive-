import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}) => {
  const sheet = new ServerStyleSheet();
  const bodyHTML = renderToString(bodyComponent);
  replaceBodyHTMLString(bodyHTML);
  setHeadComponents([
    sheet.getStyleElement(),
    <script type="text/javascript" src="//downloads.mailchimp.com/js/signup-forms/popup/unique-methods/embed.js" data-dojo-config="usePlainJson: true, isDebug: false"></script>,
    <script type="text/javascript">window.dojoRequire(["mojo/signup-forms/Loader"], function(L) { L.start({"baseUrl":"mc.us19.list-manage.com","uuid":"a407f3acc50091c0f47426c21","lid":"faec4da08d","uniqueMethods":true}) })</script>
  ]);
};