export const notify = (title, body) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/logos/foca_logo_uncolor.svg', // opcional
        });
    }
};
