// Node script to login as admin and hit /api/admin/approve-all-doctors
// run with: node approve_all.js

(async () => {
    try {
        const loginRes = await fetch('http://localhost:3000/api/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: '0000000000', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        if (!loginData.token) {
            console.error('Login failed', loginData);
            return;
        }
        const token = loginData.token;
        const res = await fetch('http://localhost:3000/api/admin/approve-all-doctors', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        console.log('approve-all response', res.status, data);
    } catch (err) {
        console.error('error', err);
    }
})();