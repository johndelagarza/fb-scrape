//import * as actionTypes from './actionTypes';

export const login = (data) => {
  return {
    type: 'LOGIN',
    data: data
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT'
  };
};

export const addLog = (log) => {
  return {
    type: 'ADD_LOG',
    log: log
  };
};

export const clearLogs = () => {
  return {
    type: 'CLEAR_LOGS'
  };
};

export const setSettings = (data) => {
  console.log(data)
  return {
    type: 'SET_SETTINGS',
    data: data
  };
};

export const updateSettings = (data) => {
  
    return {
      type: 'UPDATE_SETTINGS',
      data: data
    };
};

export const setKeywords = (data) => {
  return {
    type: 'SET_KEYWORDS',
    data: data
  };
};
  
export const updateKeywords = (keywords) => {
  return {
    type: 'UPDATE_KEYWORDS',
    keywords: keywords
  };
};

export const startKeyword = (keyword, path, settings, saveKeywords) => {
  return {
    type: 'START_KEYWORD',
    keyword: keyword,
    path: path,
    settings: settings,
    saveKeywords: saveKeywords
  };
};

export const stopKeyword = (keyword) => {
  return {
    type: 'STOP_KEYWORD',
    keyword: keyword
  };
};

export const addKeyword = (keyword) => {
  return {
    type: 'ADD_KEYWORD',
    data: keyword
  };
};
export const editKeyword = (keyword) => {
  return {
    type: 'EDIT_KEYWORD',
    data: keyword
  };
};

export const deleteKeyword = (keyword) => {
  return {
    type: 'DELETE_KEYWORD',
    data: keyword
  };
};