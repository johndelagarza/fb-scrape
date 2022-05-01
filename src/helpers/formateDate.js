import moment from 'moment';

export const formatDate = (date) => {
    return moment(date).format("h:mm:ss a");
};