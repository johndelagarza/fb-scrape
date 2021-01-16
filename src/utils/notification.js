import { store } from 'react-notifications-component';

export const notify = (title, message, type) => {
    return store.addNotification({
        title: title,
        message: message,
        type: type,
        container: "bottom-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
};

