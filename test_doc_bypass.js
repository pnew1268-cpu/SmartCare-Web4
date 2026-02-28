// Simple test to ensure the temporary test doctor bypass works
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
        // use the same phone that the login button will use for convenience
        form.append('phone', '01010739431');
        form.append('email', 'testdoctor@example.com');
        form.append('password', 'password123');
        form.append('specialization', 'General');
        form.append('city', 'Cairo');
        form.append('governorate', 'Cairo');
        // Attach dummy files as blobs
        const licenseBlob = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        const certBlob = new Blob([Buffer.from('dummy')], { type: 'application/pdf' });
        form.append('licenseId', licenseBlob, 'license.pdf');
        form.append('certificates', certBlob, 'cert1.pdf');

        const res = await fetch('http://localhost:3000/api/auth/register-doctor', {
            method: 'POST',
            body: form
        });
        const data = await res.json();
        console.log('Bypass registration response:', data);
        if (data.verificationStatus === 'approved') {
            console.log('✅ Bypass worked: account auto-approved');
        } else {
            console.error('❌ Bypass failed, status:', data.verificationStatus);
        }
    } catch (err) {
        console.error('Test doctor bypass error:', err);
    }
}

testDoctorBypass();