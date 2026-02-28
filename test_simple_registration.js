// Simple registration test
const http = require('http');

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, 'http://localhost:3000');
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(responseData)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: responseData
                    });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    console.log('Testing registration endpoint...\n');

    // Test with valid data
    console.log('Test 1: Registration with valid data');
    const testData = {
        id: '23456789012345',           // National ID (14 digits, starts with 2-3)
        name: 'Ahmed Hassan',           // Full name
        phone: '01001234567',          // Phone number (01X + 8 digits)
        email: 'ahmed@test.com',       // Email
        password: 'TestPassword123',   // Password (8+ chars, letter + number)
        age: 30,                       // Age (1-150)
        gender: 'male',                // Gender (male/female/other)
        city: 'Cairo',                 // City
        governorate: 'Cairo'           // Governorate
    };

    const response = await makeRequest('POST', '/api/auth/register', testData);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 201 || response.status === 200) {
        console.log('\n✓ Registration successful!');
        console.log('Token:', response.data.token?.substring(0, 20) + '...');
    } else {
        console.log('\n✗ Registration failed');
    }

    // Test 2: Test invalid national ID
    console.log('\n\nTest 2: Invalid national ID (less than 14 digits)');
    const invalidData = {
        id: '12345',  // Too short
        name: 'Test User',
        phone: '01001234567',
        email: 'test2@test.com',
        password: 'TestPassword123',
        age: 25,
        gender: 'male',
        city: 'Cairo',
        governorate: 'Cairo'
    };

    const response2 = await makeRequest('POST', '/api/auth/register', invalidData);
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(response2.data, null, 2));

    if (response2.status !== 201 && response2.status !== 200) {
        console.log('✓ Validation correctly rejected invalid ID');
    }

    // Test 3: Missing required field
    console.log('\n\nTest 3: Missing required field (no password)');
    const incompleteData = {
        id: '23456789012345',
        name: 'Test User',
        phone: '01001234567',
        email: 'test3@test.com',
        age: 25,
        gender: 'male',
        city: 'Cairo',
        governorate: 'Cairo'
    };

    const response3 = await makeRequest('POST', '/api/auth/register', incompleteData);
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(response3.data, null, 2));

    console.log('\n=== TEST COMPLETE ===');
}

setTimeout(test, 1500);
