import * as actionTypes from './actionTypes';

export const updateSettings = (settings) => {
    return {
      type: actionTypes.UPDATE_SETTINGS,
      settings: settings
    };
};
  
export const updateKeywords = (keywords) => {
  return {
    type: actionTypes.UPDATE_KEYWORDS,
    keywords: keywords
  };
};

// export const log = (keyword, message) => {
//   return {
//     type: actionTypes.LOG,
//     keyword: keyword,
//     message: message
//   };
// };