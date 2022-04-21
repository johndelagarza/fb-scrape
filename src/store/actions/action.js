import * as actionTypes from './actionTypes';

export const login = (data) => {
  return {
    type: actionTypes.LOGIN,
    data: data
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT
  };
};

export const addLog = (log) => {
  return {
    type: actionTypes.ADD_LOG,
    log: log
  };
};

export const clearLogs = () => {
  return {
    type: actionTypes.CLEAR_LOGS
  };
};

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

export const stopKeyword = (keyword) => {
  return {
    type: actionTypes.STOP_KEYWORD,
    keyword: keyword
  };
};

export const deleteKeyword = (keyword) => {
  return {
    type: actionTypes.DELETE_KEYWORD,
    keyword: keyword
  };
};