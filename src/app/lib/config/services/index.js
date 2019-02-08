/* 
  This file includes data for the Service Context
  It will be used by the ServiceContext Component
*/

import news from './news';
import persian from './persian';

export default {
  default: {
    brandName: 'Default Brand Name',
    dir: 'ltr',
    imageCaptionOffscreenText: 'Default image caption prefix, ',
    imageCopyrightOffscreenText: 'Default image copyright text, ',
    langAttr: 'de',
    service: 'default',
  },
  news,
  persian,
};
