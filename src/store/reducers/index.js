import { combineReducers } from 'redux';
import auth from './auth';
import keywords from './keywords';
import logs from './logs';

export default combineReducers({
    auth,
    keywords,
    logs
});