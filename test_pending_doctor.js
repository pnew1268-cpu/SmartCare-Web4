// script to register a doctor who should remain pending and try messaging
// Node 18+ has global fetch
const { Blob } = require('buffer');

async function main(){
    try{
        console.log('registering unapproved doctor...');
        const form = new FormData();
        form.append('id','30000000000002');
        form.append('name','Pending Doc');
        form.append('phone','01011112222');
        form.append('email','pendingdoc@example.com');
        form.append('password','pass1234');
        form.append('specialization','Test');
        form.append('city','Cairo');
        form.append('governorate','Cairo');
        form.append('age','45');
        form.append('dateOfBirth','1978-01-01');
        form.append('role','doctor');
        const licenseBlob = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        const certBlob = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        form.append('licenseId', licenseBlob, 'license.pdf');
        form.append('certificates', certBlob, 'cert.pdf');
        const res1 = await fetch('http://localhost:3000/api/register', { method:'POST', body: form });
        const data1 = await res1.json();
        console.log('register result', res1.status, data1);

        console.log('logging in as pending doctor...');
        const res2 = await fetch('http://localhost:3000/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({loginId:'01011112222', password:'pass1234'})});
        const data2 = await res2.json();
        console.log('login result', res2.status, data2);
        const token = data2.token;

        console.log('attempt to send message as pending doc...');
        const res3 = await fetch('http://localhost:3000/api/messages', {method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token}, body: JSON.stringify({receiverId:'12345678901234', content:'hello'})});
        const data3 = await res3.json();
        console.log('message post result', res3.status, data3);
    }catch(e){console.error(e);}    
}

main();
