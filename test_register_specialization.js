// test registration with specialization_code
const { Blob } = require('buffer');
(async () => {
    try {
        const form = new FormData();
        form.append('role','doctor');
        form.append('id','30000000000003');
        form.append('name','Spec Doc');
        form.append('phone','01033334444');
        form.append('password','pass1234');
        form.append('city','Cairo');
        form.append('governorate','Cairo');
        // provide either age or dateOfBirth as required by validation
        form.append('dateOfBirth','1975-05-20');
        form.append('specialization_code','cardiology');
        // dummy files
        const license = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        const cert = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        form.append('licenseId', license, 'lic.pdf');
        form.append('certificates', cert, 'cert.pdf');
        const res = await fetch('http://localhost:3000/api/register', { method:'POST', body: form });
        const data = await res.json();
        console.log('register spec doctor', res.status, data);

        // login and check profile
        const login = await fetch('http://localhost:3000/api/login', {method:'POST',headers:{'Content-Type':'application/json'}, body: JSON.stringify({loginId:'01033334444', password:'pass1234'})});
        const loginData=await login.json();
        console.log('login', login.status, loginData);
        const token=loginData.token;
        const prof = await fetch('http://localhost:3000/api/users/profile',{headers:{Authorization:'Bearer '+token}});
        console.log('profile', prof.status, await prof.json());
    } catch(e){console.error(e);}    
})();