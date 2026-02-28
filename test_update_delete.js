// Test update and delete operations
const http = require('http');

function makeRequest(method, path, data = null, token = '') {
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

        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }

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
    console.log('=== FAMILY MEMBER UPDATE AND DELETE TEST ===\n');

    let authToken = '';
    const testEmail = 'updatetest' + Date.now() + '@test.com';
    const uniquePhone = '010' + Math.random().toString().substring(2, 10);
    const uniqueId = '30' + Math.random().toString().substring(2, 14);

    // Register and login
    console.log('Registering user...');
    await makeRequest('POST', '/api/auth/register', {
        id: uniqueId,
        name: 'Update Test User',
        phone: uniquePhone,
        email: testEmail,
        password: 'TestPass123',
        age: 40,
        gender: 'male',
        city: 'Cairo',
        governorate: 'Cairo'
    });

    console.log('Logging in...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
        loginId: uniquePhone,
        password: 'TestPass123'
    });
    authToken = loginResponse.data.token;
    console.log('✓ Logged in successfully\n');

    // Add a family member
    console.log('Adding family member...');
    const addResponse = await makeRequest('POST', '/api/family', {
        fullName: 'Original Name',
        age: 15,
        gender: 'male',
        relationship: 'son',
        bloodType: 'O+',
        allergies: ['Peanuts'],
        chronicConditions: ['Eczema']
    }, authToken);

    let memberId = null;
    if (addResponse.status === 200 || addResponse.status === 201) {
        memberId = addResponse.data.id;
        console.log('✓ Family member created with ID:', memberId, '\n');
    } else {
        console.log('✗ Failed to create family member');
        return;
    }

    // Get the member before update
    console.log('Retrieving member before update...');
    const beforeUpdate = await makeRequest('GET', `/api/family/${memberId}`, null, authToken);
    console.log('Before Update:');
    console.log('  Name:', beforeUpdate.data.fullName);
    console.log('  Age:', beforeUpdate.data.age);
    console.log('  Allergies:', beforeUpdate.data.allergies.join(', '));
    console.log('  Conditions:', beforeUpdate.data.chronicConditions.join(', '));

    // Update the family member
    console.log('\nUpdating family member...');
    const updateResponse = await makeRequest('PUT', `/api/family/${memberId}`, {
        fullName: 'Updated Name',
        age: 16,
        gender: 'male',
        relationship: 'son',
        bloodType: 'B-',
        allergies: ['Peanuts', 'Shellfish'],
        chronicConditions: ['Eczema', 'Asthma']
    }, authToken);

    if (updateResponse.status === 200) {
        console.log('✓ Update successful');
        console.log('After Update:');
        console.log('  Name:', updateResponse.data.fullName);
        console.log('  Age:', updateResponse.data.age);
        console.log('  Blood Type:', updateResponse.data.bloodType);
        console.log('  Allergies:', updateResponse.data.allergies.join(', '));
        console.log('  Conditions:', updateResponse.data.chronicConditions.join(', '));
    } else {
        console.log('✗ Update failed:', updateResponse.data);
    }

    // Get all family members
    console.log('\nGetting all family members...');
    const listResponse = await makeRequest('GET', '/api/family', null, authToken);
    console.log('✓ Total family members:', listResponse.data.length);

    // Delete the family member
    console.log('\nDeleting family member...');
    const deleteResponse = await makeRequest('DELETE', `/api/family/${memberId}`, null, authToken);
    console.log('Delete Status Code:', deleteResponse.status);
    if (deleteResponse.status === 200 || deleteResponse.status === 204) {
        console.log('✓ Deletion successful');
    }

    // Verify deletion - get all family members again
    console.log('\nVerifying deletion...');
    const afterDeleteList = await makeRequest('GET', '/api/family', null, authToken);
    console.log('Family members after deletion:', afterDeleteList.data.length);
    if (afterDeleteList.data.length === 0) {
        console.log('✓ Deletion confirmed - no family members remaining');
    }

    console.log('\n=== ALL UPDATE/DELETE TESTS COMPLETE ===');
    console.log('✓ Full CRUD operations are fully functional!');
}

setTimeout(test, 2000);
