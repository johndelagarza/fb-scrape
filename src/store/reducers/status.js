import * as actionTypes from "../actions/actionTypes";
import { getKeywords, getSettings, scrape, startScrape, stopScrape } from '../../functions';


const INITIAL_STATE = {
    keywords: getKeywords(),
    settings: getSettings(),
    logs: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.ADD_LOG: {
            return { ...state, logs: [...state.logs, action.log] };
        }
        case actionTypes.CLEAR_LOGS: {
            return { ...state, logs: [] };
        }
        case actionTypes.UPDATE_SETTINGS: {
            return { ...state, settings: action.settings };
        }
        case actionTypes.UPDATE_KEYWORDS: {
            console.log('New keywords saved.')
            return { ...state, keywords: action.keywords};
        }
        case actionTypes.START_KEYWORD: {
            console.log('spawning scrape')
            let intervalPid = startScrape(action);
            //scrape(action.keyword, action.path, action.settings, action.saveKeywords);
            
            let updatedKeywords = state.keywords.map(keyword => keyword.keyword === action.keyword.keyword ? { ...keyword, online: true, pid: intervalPid } : keyword);
            localStorage.setItem('keywords', JSON.stringify(updatedKeywords));
            return { ...state, keywords: updatedKeywords };
        }
        case actionTypes.STOP_KEYWORD: {
            let updatedKeywords = stopScrape(action, state.keywords);
            console.log(updatedKeywords);
            localStorage.setItem('keywords', JSON.stringify(updatedKeywords));
            return { ...state, keywords: updatedKeywords };
        }
        case actionTypes.DELETE_KEYWORD: {
            if (action.keyword.hasOwnProperty('pid')) clearInterval(action.keyword.pid);
            const newKeywords = state.keywords.filter(keyword => keyword.keyword !== action.keyword.keyword);
            localStorage.setItem('keywords', JSON.stringify(newKeywords));

            return { ...state, keywords: newKeywords};
        }
        default:
            return state;
    }
};

