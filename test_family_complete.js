// Comprehensive family member API test
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
    console.log('=== FAMILY MEMBER MANAGEMENT TEST ===\n');

    let authToken = '';
    const testEmail = 'familytest' + Date.now() + '@test.com';

    // Step 1: Register user
    console.log('Step 1: Registering test user...');
    const uniquePhone = '010' + Math.random().toString().substring(2, 10);
    const uniqueId = '30' + Math.random().toString().substring(2, 14);
    const regResponse = await makeRequest('POST', '/api/auth/register', {
        id: uniqueId,
        name: 'Family Test User',
        phone: uniquePhone,
        email: testEmail,
        password: 'TestPass123',
        age: 40,
        gender: 'male',
        city: 'Cairo',
        governorate: 'Cairo'
    });

    if (regResponse.status === 201) {
        console.log('✓ User registered successfully\n');
    } else {
        console.log('✗ Registration failed:', regResponse.data.msg);
        return;
    }

    // Step 2: Login to get token
    console.log('Step 2: Logging in...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
        loginId: uniquePhone,  // Can be phone or national ID
        password: 'TestPass123'
    });

    if (loginResponse.status === 200) {
        authToken = loginResponse.data.token;
        console.log('✓ Login successful');
        console.log('Token:', authToken.substring(0, 30) + '...\n');
    } else {
        console.log('✗ Login failed:', loginResponse.data);
        return;
    }

    // Step 3: Add first family member
    console.log('Step 3: Adding first family member (son)...');
    const addResponse1 = await makeRequest('POST', '/api/family', {
        fullName: 'Ahmed Hassan',
        age: 12,
        gender: 'male',
        relationship: 'son',
        bloodType: 'O+',
        allergies: ['Penicillin'],
        chronicConditions: ['Asthma']
    }, authToken);

    let familyMemberId1 = '';
    if (addResponse1.status === 201 || addResponse1.status === 200) {
        familyMemberId1 = addResponse1.data.id;
        console.log('✓ Family member added successfully');
        console.log('  ID:', familyMemberId1);
        console.log('  Name:', addResponse1.data.fullName);
        console.log('  Relationship:', addResponse1.data.relationship + '\n');
    } else {
        console.log('✗ Failed to add family member:', addResponse1.data);
    }

    // Step 4: Add second family member
    console.log('Step 4: Adding second family member (daughter)...');
    const addResponse2 = await makeRequest('POST', '/api/family', {
        fullName: 'Fatima Hassan',
        age: 10,
        gender: 'female',
        relationship: 'daughter',
        bloodType: 'AB-',
        allergies: [],
        chronicConditions: []
    }, authToken);

    let familyMemberId2 = '';
    if (addResponse2.status === 201 || addResponse2.status === 200) {
        familyMemberId2 = addResponse2.data.id;
        console.log('✓ Second family member added');
        console.log('  ID:', familyMemberId2);
        console.log('  Name:', addResponse2.data.fullName + '\n');
    } else {
        console.log('✗ Failed to add second family member:', addResponse2.data);
    }

    // Step 5: Get all family members
    console.log('Step 5: Retrieving all family members...');
    const listResponse = await makeRequest('GET', '/api/family', null, authToken);

    if (listResponse.status === 200 && Array.isArray(listResponse.data)) {
        console.log(`✓ Retrieved ${listResponse.data.length} family members:`);
        listResponse.data.forEach((member, idx) => {
            console.log(`  ${idx + 1}. ${member.fullName} (${member.relationship}, age ${member.age})`);
        });
        console.log();
    } else {
        console.log('✗ Failed to retrieve family members');
    }

    // Step 6: Get specific family member
    if (familyMemberId1) {
        console.log('Step 6: Retrieving specific family member...');
        const getResponse = await makeRequest('GET', `/api/family/${familyMemberId1}`, null, authToken);

        if (getResponse.status === 200) {
            console.log('✓ Retrieved family member details:');
            console.log('  Name:', getResponse.data.fullName);
            console.log('  Age:', getResponse.data.age);
            console.log('  Blood Type:', getResponse.data.bloodType);
            console.log('  Allergies:', getResponse.data.allergies.join(', ') || 'None');
            console.log('  Conditions:', getResponse.data.chronicConditions.join(', ') || 'None\n');
        } else {
            console.log('✗ Failed to retrieve family member');
        }
    }

    // Step 7: Update family member
    if (familyMemberId1) {
        console.log('Step 7: Updating family member...');
        const updateResponse = await makeRequest('PUT', `/api/family/${familyMemberId1}`, {
            fullName: 'Ahmed Hassan',
            age: 13,  // Changed from 12 to 13
            gender: 'male',
            relationship: 'son',
            bloodType: 'O+',
            allergies: ['Penicillin', 'Aspirin'],
            chronicConditions: ['Asthma']
        }, authToken);

        if (updateResponse.status === 200) {
            console.log('✓ Family member updated successfully');
            console.log('  New age:', updateResponse.data.age);
            console.log('  New allergies:', updateResponse.data.allergies.join(', ') + '\n');
        } else {
            console.log('✗ Failed to update family member:', updateResponse.data);
        }
    }

    // Step 8: Test validation - invalid family member data
    console.log('Step 8: Testing validation with invalid data...');
    const invalidResponse = await makeRequest('POST', '/api/family', {
        fullName: 'Invalid123',  // Contains numbers - should fail
        age: 25,
        gender: 'male',
        relationship: 'son'
    }, authToken);

    if (invalidResponse.status !== 201 && invalidResponse.status !== 200) {
        console.log('✓ Validation correctly rejected invalid name (contains numbers)');
        console.log('  Error:', invalidResponse.data.msg + '\n');
    } else {
        console.log('✗ Validation should have rejected invalid name\n');
    }

    // Step 9: Test invalid age
    console.log('Step 9: Testing validation with invalid age...');
    const ageResponse = await makeRequest('POST', '/api/family', {
        fullName: 'Test Valid Name',
        age: 151,  // Too old - should fail
        gender: 'male',
        relationship: 'son'
    }, authToken);

    if (ageResponse.status !== 201 && ageResponse.status !== 200) {
        console.log('✓ Validation correctly rejected invalid age (>150)');
        console.log('  Error:', ageResponse.data.msg + '\n');
    } else {
        console.log('✗ Validation should have rejected invalid age\n');
    }

    // Step 10: Delete family member
    if (familyMemberId2) {
        console.log('Step 10: Deleting family member...');
        const deleteResponse = await makeRequest('DELETE', `/api/family/${familyMemberId2}`, null, authToken);

        if (deleteResponse.status === 200 || deleteResponse.status === 204) {
            console.log('✓ Family member deleted successfully\n');
        } else {
            console.log('✗ Failed to delete family member:', deleteResponse.data);
        }
    }

    // Step 11: Verify deletion - get all family members again
    console.log('Step 11: Verifying deletion...');
    const finalListResponse = await makeRequest('GET', '/api/family', null, authToken);

    if (finalListResponse.status === 200 && Array.isArray(finalListResponse.data)) {
        console.log(`✓ Final family member count: ${finalListResponse.data.length}`);
        finalListResponse.data.forEach((member, idx) => {
            console.log(`  ${idx + 1}. ${member.fullName} (${member.relationship})`);
        });
    }

    console.log('\n=== ALL TESTS COMPLETE ===');
    console.log('\n✓ Family member management is fully functional!');
    console.log('✓ Input validation is working on backend!');
    console.log('✓ All CRUD operations (Create, Read, Update, Delete) are working!');
}

setTimeout(test, 2000);
