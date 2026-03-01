const Notification = require('./models/Notification');

(async() => {
    try {
        const all = await Notification.findAll();
        console.log('total notifications', all.length);
        all.forEach(n => console.log(n.toJSON()));
    } catch (err) {
        console.error('error', err);
    } finally {
        process.exit();
    }
})();