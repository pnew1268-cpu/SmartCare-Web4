// simple script to verify pharmacy endpoint returns entries
(async () => {
    try {
        const res = await fetch('http://localhost:3000/api/users/pharmacies');
        const data = await res.json();
        console.log('pharmacies status', res.status, data);
    } catch (err) {
        console.error('error fetching pharmacies', err);
    }
})();