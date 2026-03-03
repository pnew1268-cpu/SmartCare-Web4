(async () => {
  try {
    const docLogin = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: '01099999999', password: 'password123' })
    });
    const docData = await docLogin.json();
    const docToken = docData.token;

    const patientLogin = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId: '12345678901234', password: 'test123' })
    });
    const patientData = await patientLogin.json();
    const patientToken = patientData.token;

    console.log('docToken', docToken, 'patientId', patientData.user.id);

    const apt = await fetch('http://localhost:3000/api/clinical/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + patientToken
      },
      body: JSON.stringify({ doctorId: docData.user.id, date: '2026-12-01', time: '10:00' })
    });
    console.log('apt status', apt.status);

    const docNotifsResp = await fetch('http://localhost:3000/api/notifications', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + docToken }
    });
    const docNotifs = await docNotifsResp.json();
    console.log('docNotifs', JSON.stringify(docNotifs, null, 2));
  } catch (e) {
    console.error(e);
  }
})();
