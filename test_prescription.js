// simple script to log in as test doctor and create a prescription
// Node 18+ has global fetch

(async () => {
    try {
        // login
        const loginResp = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ loginId: '01099999999', password: 'password123' })
        });
        const loginData = await loginResp.json();
        console.log('login', loginResp.status, loginData);
        const token = loginData.token;
        
        // create a prescription to patient 12345678901234
        const rxResp = await fetch('http://localhost:3000/api/clinical/prescribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                patientId: '12345678901234',
                medications: 'Aspirin 100mg',
                diagnosis: 'Headache',
                instructions: 'Take twice daily',
                notes: 'Be careful of allergies'
            })
        });
        const rxData = await rxResp.json();
        console.log('prescribe', rxResp.status, rxData);
    } catch(e){ console.error(e); }
})();