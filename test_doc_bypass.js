// Simple test to ensure the temporary test doctor bypass works
// (note: in development you can instead set AUTO_APPROVE_DOCTORS=true, which
// will automatically approve all doctors and makes this script unnecessary.)
// Run with: node test_doc_bypass.js

async function testDoctorBypass() {
    // Node 18+ has global fetch and FormData. If older Node, install 'node-fetch' and 'form-data'.
    try {
        const { Blob } = require('buffer');
        const form = new FormData();
        const ts = Date.now();
        // use a 14-digit ID starting with 2 or 3 to satisfy validators
        form.append('id', `3${String(ts).slice(0,13)}`);
        form.append('name', 'Temporary Doctor');
        // random phone to avoid collisions
        const randomPhone = '010' + Math.floor(10000000 + Math.random() * 90000000);
        form.append('phone', randomPhone);
        form.append('email', 'testdoctor@example.com');
        form.append('password', 'password123');
        form.append('specialization', 'General');
        form.append('city', 'Cairo');
        form.append('governorate', 'Cairo');
        form.append('age', '40');
        form.append('dateOfBirth', '1986-01-01');
        form.append('role', 'doctor');
        // Attach dummy files as blobs
        const licenseBlob = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        const certBlob = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        form.append('licenseId', licenseBlob, 'license.pdf');
        form.append('certificates', certBlob, 'cert1.pdf');

        // hit unified register endpoint including role
        const res = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        console.log('Bypass registration response:', data);
        if (data.verificationStatus === 'approved') {
            console.log('✅ Bypass worked: account auto-approved');
            console.log('   You can login as test doctor using phone 01099999999 / password123');
        } else {
            console.error('❌ Bypass failed, status:', data.verificationStatus);
            console.log('   If you already have a test doctor account with the special email it may simply be pending.');
        }
    } catch (err) {
        console.error('Test doctor bypass error:', err);
    }
}

testDoctorBypass();