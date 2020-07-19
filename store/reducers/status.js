const { UPDATE_TASK_LOG } = require('../actions/actionTypes');

const INITIAL_STATE = {};

const status = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_TASK_LOG: {
            // const elementIdex = state.keywords.findIndex(keyword => {
            //     return keyword[action.keyword] === action.keyword;
            // });
            // let updatedKeyword = state.keywords[elementIdex] = {...state.keywords[elementIdex], currentListings: newListings};
            // let newKeywords = keywords.map(e => e.keyword === keyword.keyword ? updatedKeyword : e);
            console.log(action)
            return { ...state, [action.keyword]: action.msg };
        }
        default:
            return state;
    }
}; 

module.exports = { status: status };

// case actionTypes.ON_LOGIN_SUCCESS: {
        //     return { ...state, discordUsername: action.discordUsername, discordEmail: action.discordEmail, discordId: action.discordId, discordAvi: action.discordAvi };
        // }