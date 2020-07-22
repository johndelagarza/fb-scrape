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

export const startKeyword = (keyword, path, settings, saveKeywords) => {
  return {
    type: actionTypes.START_KEYWORD,
    keyword: keyword,
    path: path,
    settings: settings,
    saveKeywords: saveKeywords
  };
};

export const stopKeyword = (keyword, saveKeywords) => {
  return {
    type: actionTypes.STOP_KEYWORD,
    keyword: keyword
  };
};