// rate the test doctor and fetch average
(async () => {
    const fetch = global.fetch;
    try {
        // login as patient
        const loginResp = await fetch('http://localhost:3000/api/login', {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ loginId:'12345678901234', password:'test123' })
        });
        const loginData = await loginResp.json();
        const token = loginData.token;
        console.log('patient login', loginResp.status);

        // post rating
        const rateResp = await fetch('http://localhost:3000/api/users/rate-doctor', {
            method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
            body: JSON.stringify({ doctorId:'31772318528301', rating:5, review:'Great!' })
        });
        const rateData = await rateResp.json();
        console.log('rate response', rateResp.status, rateData);

        // get average
        const avgResp = await fetch('http://localhost:3000/api/users/doctors/31772318528301/rating');
        const avgData = await avgResp.json();
        console.log('average', avgResp.status, avgData);
    } catch(e){console.error(e);}    
})();