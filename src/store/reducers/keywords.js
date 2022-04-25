import { loadSavedData, saveDataInStorage, removeDataFromStorage } from "../../renderer";
var _ = require('lodash');

let updatedKeywords;

const INITIAL_STATE = {
    keywords: []
};

const keywords = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        
        case 'SET_KEYWORDS':
            console.log(action.data)
            return { ...state, keywords: action.data }

        case 'ADD_KEYWORD':
            updatedKeywords = [...state.keywords, action.data];
            
            saveDataInStorage("keywords", updatedKeywords);
            console.log(updatedKeywords)

            return {...state, keywords: updatedKeywords }

        case 'EDIT_KEYWORD':
            updatedKeywords = _.map(state.keywords, (keyword) => keyword.id === action.data.id ? action.data : keyword)
            console.log(updatedKeywords)
            saveDataInStorage("keywords", updatedKeywords);

            return {...state, keywords: updatedKeywords }

        case 'DELETE_KEYWORD':

            updatedKeywords = _.remove(state.keywords, (keyword) => keyword.id !== action.data.id);
            removeDataFromStorage("keywords", updatedKeywords);

            return {...state, keywords: updatedKeywords}

      default:
        return state;
    };
};

export default keywords;