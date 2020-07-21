import * as actionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    keywords: [],
    settings: null,
    logs: {}
};

export default (state = INITIAL_STATE, action) => {
    let settings = getSettings();
    let keywords = getKeywords();
    if (settings) state = {...state, settings: settings};
    if (keywords) state = {...state, keywords: keywords};

    switch (action.type) {
        case actionTypes.UPDATE_SETTINGS: {
            return { ...state, settings: action.settings };
        }
        case actionTypes.UPDATE_KEYWORDS: {
            return { ...state, keywords: action.keywords};
        }
        // case actionTypes.LOG: {
        //     console.log(action)
        //     return { ...state, logs: {...state.logs, [action.keyword]: action.message}};
        // }
        default:
            return state;
    }
}; 

// case actionTypes.ON_LOGIN_SUCCESS: {
        //     return { ...state, discordUsername: action.discordUsername, discordEmail: action.discordEmail, discordId: action.discordId, discordAvi: action.discordAvi };
        // }

const getSettings = () => {
    let settings = localStorage.getItem('settings');

    if (!settings) {
        return null;
    } else if (settings) {
        return JSON.parse(settings);
    };
};

const getKeywords = () => {
    let keywords = localStorage.getItem('keywords');

    if (!keywords) {
        return [];
    } else if (keywords.length > 0) {
        return JSON.parse(keywords);
    };
};