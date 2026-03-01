(async () => {
  try {
    const loginRes = await fetch('http://localhost:3000/api/login',{
      method:'POST', headers:{'Content-Type':'application/json'},
      // use the phone number from the seeded approved test doctor
      body: JSON.stringify({loginId:'01099999999',password:'password123'})
    });
    const loginData = await loginRes.json();
    console.log('login status', loginRes.status, loginData);
    if(!loginData.token) return;
    const token = loginData.token;
    const presRes = await fetch('http://localhost:3000/api/clinical/prescribe',{
      method:'POST', headers:{'Content-Type':'application/json', Authorization: 'Bearer '+token},
      body: JSON.stringify({patientId:'12345678901234', medications:'Test med', notes:'Test note'})
    });
    const presData = await presRes.json();
    console.log('pres status', presRes.status, presData);
  } catch(e){ console.error(e); }
})();