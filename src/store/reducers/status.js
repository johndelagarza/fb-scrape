// import * as actionTypes from "../actions/actionTypes";
// import { getKeywords, getSettings, scrape, startScrape, stopScrape } from '../../functions';
// import { loadSavedData, saveDataInStorage } from "../../renderer";

// const { ipcRenderer } = window.require('electron');

// const INITIAL_STATE = {
//     user: null,
//     keywords: [],
//     settings: getSettings(),
//     logs: []
// };

// export default (state = INITIAL_STATE, action) => {

//     switch (action.type) {
//         case 'LOGIN': {
//             return {...INITIAL_STATE, user: action.data}
//         }
//         case 'LOGOUT': {
//             localStorage.removeItem('user');
//             return {...INITIAL_STATE, user: null}
//         }
//         case actionTypes.ADD_LOG: {
//             return { ...state, logs: []}
//             return { ...state, logs: [...state.logs, action.log ]};
//         }
//         case actionTypes.CLEAR_LOGS: {
//             return { ...state, logs: [] };
//         }
//         case actionTypes.UPDATE_SETTINGS: {
//             return { ...state, settings: action.settings };
//         }
//         case actionTypes.UPDATE_KEYWORDS: {
//             return { ...state, keywords: action.keywords};
//         }
        // case actionTypes.START_KEYWORD: {
        //     console.log('spawning scrape');
            
        //     let intervalPid = startScrape(action);
        //     console.log(action.keyword)
        //     let updatedKeywords = state.keywords.map(keyword => keyword.keyword === action.keyword.keyword ? 
        //         { ...keyword, online: true, pid: intervalPid, currentListings: (Date.now() - action.keyword.lastActive) > 1.44e+7 ? [] : action.keyword.currentListings } : keyword);
            
        //     localStorage.setItem('keywords', JSON.stringify(updatedKeywords));
        //     scrape(action.keyword, action.path, action.settings, action.saveKeywords);
        //     return { ...state, keywords: updatedKeywords };
        // }
//         case actionTypes.STOP_KEYWORD: {
//             let updatedKeywords = stopScrape(action, state.keywords);
//             console.log(updatedKeywords);
//             localStorage.setItem('keywords', JSON.stringify(updatedKeywords));
//             return { ...state, keywords: updatedKeywords };
//         }
//         case actionTypes.DELETE_KEYWORD: {
//             if (action.keyword.hasOwnProperty('pid')) clearInterval(action.keyword.pid);
//             const newKeywords = state.keywords.filter(keyword => keyword.id !== action.keyword.id);
//             localStorage.setItem('keywords', JSON.stringify(newKeywords));
//             console.log(newKeywords)
//             return { ...state, keywords: newKeywords};
//         }
//         default:
//             return state;
//     };
// };

