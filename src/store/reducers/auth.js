const INITIAL_STATE = {
    user: null
};

const auth = (state = INITIAL_STATE, action) => {
    
    switch(action.type) {
        case 'SET_USER':

            return {...state, user: action.data}

        case 'LOGIN':

            return {...state, user: action.data}

        case 'LOGOUT':

            localStorage.removeItem('user');

            return {...INITIAL_STATE, user: null}
            
      default:
        return state;
    };
};

export default auth;