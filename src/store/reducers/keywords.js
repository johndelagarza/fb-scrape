import { loadSavedData, saveDataInStorage, removeDataFromStorage } from "../../renderer";
import { startScrape, stopScrape, scrape } from "../../helpers/scrape";
var _ = require('lodash');

let updatedKeywords;

const INITIAL_STATE = {
    keywords: []
};

const keywords = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        
        case 'SET_KEYWORDS':
            console.log(action.data)

            updatedKeywords = action.data.map(keyword => {
                if (keyword.hasOwnProperty('pid')) {
                    clearInterval(keyword.pid);
                    delete keyword.pid
                    return { ...keyword, online: false };
                } else return keyword;
            });

            return { ...state, keywords: updatedKeywords }

        case 'ADD_KEYWORD':
            updatedKeywords = [...state.keywords, action.data];
            
            saveDataInStorage("keywords", updatedKeywords);


            return {...state, keywords: updatedKeywords }

        case 'EDIT_KEYWORD':
            updatedKeywords = _.map(state.keywords, (keyword) => keyword.id === action.data.id ? action.data : keyword)
            
            saveDataInStorage("keywords", updatedKeywords);

            return {...state, keywords: updatedKeywords }

        case 'DELETE_KEYWORD':

            updatedKeywords = _.remove(state.keywords, (keyword) => keyword.id !== action.data.id);
            removeDataFromStorage("keywords", updatedKeywords);

            return {...state, keywords: updatedKeywords}

        case 'START_KEYWORD': {
            console.log('spawning scrape');
            
            let intervalPid = startScrape(action);
            console.log(action)
            updatedKeywords = _.map(state.keywords, (keyword) => keyword.id === action.keyword.id ? 
                action.keyword = { ...keyword, online: true, pid: intervalPid, lastActive: Date.now(), currentListings: (Date.now() - action.keyword.lastActive) > 1.44e+7 ? [] : action.keyword.currentListings } : keyword);
            saveDataInStorage("keywords", updatedKeywords);
            
            scrape(action.keyword, action.path, action.settings, action.editKeyword);
            return { ...state, keywords: updatedKeywords };
        }

        case 'STOP_KEYWORD': {
            console.log(action.data)
            clearInterval(action.data.pid);

            updatedKeywords = _.map(state.keywords, (keyword) => {
                if (keyword.id === action.data.id) {
                    delete keyword.pid
                    return {...keyword, online: false, lastActive: Date.now()};
                }
                return keyword;
            });

            saveDataInStorage("keywords", updatedKeywords);

            return {...state, keywords: updatedKeywords }
        }

      default:
        return state;
    };
};

export default keywords;