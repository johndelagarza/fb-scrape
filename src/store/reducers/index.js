import { combineReducers } from 'redux';
import auth from './auth';
import keywords from './keywords';
import logs from './logs';
import settings from './settings';

export default combineReducers({
    auth,
    keywords,
    logs,
    settings
});