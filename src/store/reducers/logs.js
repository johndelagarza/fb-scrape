import { loadSavedData, saveDataInStorage, removeDataFromStorage } from "../../renderer";
var _ = require('lodash');

const INITIAL_STATE = {
    logs: []
};

const logs = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        
        case 'SET_LOGS':
            console.log(action.data)
            return { ...state, logs: action.data }

        case 'ADD_LOG':

            saveDataInStorage("logs", [...state.logs, action.data]);

            return {...state, logs: [...state.logs, action.data] }

      default:
        return state;
    };
};

export default logs;