import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export const replaceRenderer = ({
  bodyComponent,
  replaceBodyHTMLString,
  setPostBodyComponents,
  setHeadComponents,
}) => {
  const sheet = new ServerStyleSheet();
  const bodyHTML = renderToString(bodyComponent);
  replaceBodyHTMLString(bodyHTML);
  setHeadComponents([
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-TPGJ3Z4');</script>,
    sheet.getStyleElement(),
  ]);
  setPostBodyComponents([
    <noscript>
      <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TPGJ3Z4"
        height="0" width="0" style="display:none;visibility:hidden">
      </iframe>
    </noscript>
  ]);
};