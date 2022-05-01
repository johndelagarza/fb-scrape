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

export const setUser = (data) => {
  return {
    type: 'SET_USER',
    data: data
  };
};

export const setLogs = (data) => {
  
  return {
    type: 'SET_LOGS',
    data: data
  };
};

export const addLog = (data) => {
  return {
    type: 'ADD_LOG',
    data: data
  };
};

export const clearLogs = () => {
  return {
    type: 'CLEAR_LOGS'
  };
};

export const setSettings = (data) => {
  
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

export const startKeyword = (keyword, path, settings, editKeyword) => {

  return {
    type: 'START_KEYWORD',
    keyword: keyword,
    path: path,
    settings: settings,
    editKeyword: editKeyword
  };
};

export const stopKeyword = (keyword) => {
  return {
    type: 'STOP_KEYWORD',
    data: keyword
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