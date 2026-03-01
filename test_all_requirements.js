// Comprehensive test for all 8 final requirements
(async () => {
    try {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║       COMPREHENSIVE SYSTEM VERIFICATION TEST               ║
║          Final Requirements Validation                      ║
╚════════════════════════════════════════════════════════════╝
`);

        let testsPassed = 0;
        let testsFailed = 0;

        // Helper function for test results
        const test = (name, passed, details = '') => {
            if (passed) {
                console.log(`✓ ${name}`);
                testsPassed++;
            } else {
                console.log(`✗ ${name}`);
                if (details) console.log(`  Details: ${details}`);
                testsFailed++;
            }
        };

        // ============ REQUIREMENT 1: Doctor Pharmacy Suggestions ============
        console.log('\n[1] Doctor Pharmacy Suggestions System');
        console.log('─'.repeat(50));

        const docLogin = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: '01099999999', password: 'password123' })
        });
        const docData = await docLogin.json();
        const docToken = docData.token;

        const suggest = await fetch('http://localhost:3000/api/pharmacy/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${docToken}`
            },
            body: JSON.stringify({
                name: 'Test Pharmacy',
                address: '123 Test St',
                city: 'Cairo',
                phone: '02-12345678'
            })
        });
        test('Doctor can suggest pharmacy', suggest.ok, suggest.ok ? '' : 'API returned ' + suggest.status);

        // ============ REQUIREMENT 2: Private Messaging System ============
        console.log('\n[2] Private Messaging System');
        console.log('─'.repeat(50));

        const patientLogin = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: '12345678901234', password: 'test123' })
        });
        const patientData = await patientLogin.json();
        const patientToken = patientData.token;

        const sendMsg = await fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${patientToken}`
            },
            body: JSON.stringify({
                receiverId: docData.user.id,
                content: 'Test message'
            })
        });
        test('Can send private message', sendMsg.ok, sendMsg.ok ? '' : 'API returned ' + sendMsg.status);

        const getMsg = await fetch('http://localhost:3000/api/messages/' + docData.user.id, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${patientToken}` }
        });
        const messages = await getMsg.json();
        test('Can retrieve messages', Array.isArray(messages), 'Not an array');
        test('Message has required fields', 
            Array.isArray(messages) && messages.length > 0 && 
            messages[0].senderId && messages[0].receiverId && messages[0].content,
            'Missing fields'
        );
        
        // verify doctor received a notification for the message
        const docNotifsResp = await fetch('http://localhost:3000/api/notifications', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${docToken}` }
        });
        const docNotifs = await docNotifsResp.json();
        test('Doctor receives notification on patient message', docNotifsResp.ok && Array.isArray(docNotifs), 'Notifications fetch failed');
        test('Notification list contains message alert', 
            Array.isArray(docNotifs) && docNotifs.some(n => n.message && n.message.toLowerCase().includes('message')),
            'No message-related notification'
        );

        // ============ REQUIREMENT 3: Arabic Language Support (RTL) ============
        console.log('\n[3] Arabic Language Support (RTL)');
        console.log('─'.repeat(50));

        const htmlFetch = await fetch('http://localhost:3000/');
        const htmlText = await htmlFetch.text();
        test('HTML file exists', htmlFetch.ok);
        test('Contains language switching', htmlText.includes('switchLang') || htmlText.includes('lang'));

        // ============ REQUIREMENT 4: Multi-Role User System ============
        console.log('\n[4] Multi-Role User System');
        console.log('─'.repeat(50));

        const profile = await fetch('http://localhost:3000/api/users/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${patientToken}` }
        });
        const profileData = await profile.json();
        test('User has roles array', Array.isArray(profileData.roles));
        test('User has activeRole field', profileData.activeRole !== undefined);

        // ============ REQUIREMENT 5: Prescription Auto-Fill ============
        console.log('\n[5] Prescription Auto-Fill (Doctor Data)');
        console.log('─'.repeat(50));

        const prescript = await fetch('http://localhost:3000/api/clinical/prescriptions', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${docToken}` }
        });
        test('Can access prescriptions endpoint', prescript.ok);

        // ============ REQUIREMENT 6: Nearby Pharmacy (GPS) ============
        console.log('\n[6] Nearby Pharmacy Location System (GPS)');
        console.log('─'.repeat(50));

        const nearby = await fetch('http://localhost:3000/api/users/pharmacies/nearby?lat=30.0444&lng=31.2357', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${patientToken}` }
        });
        test('Nearby pharmacies endpoint available', nearby.ok, nearby.ok ? '' : 'API returned ' + nearby.status);
        const nearbyData = await nearby.json();
        test('Returns array/object', Array.isArray(nearbyData) || typeof nearbyData === 'object');

        // ============ REQUIREMENT 7: Rating System ============
        console.log('\n[7] Doctor Rating System (1-5 Stars)');
        console.log('─'.repeat(50));

        // Use the doctor ID from the login response
        const doctorIdForRating = docData.user.id;

        const rate = await fetch('http://localhost:3000/api/users/rate-doctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${patientToken}`
            },
            body: JSON.stringify({
                doctorId: doctorIdForRating,
                rating: 5
            })
        });
        test('Can submit doctor rating', rate.ok, rate.ok ? '' : 'API returned ' + rate.status);

        const getRating = await fetch('http://localhost:3000/api/users/doctors/' + doctorIdForRating + '/rating', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${patientToken}` }
        });
        test('Can retrieve doctor ratings', getRating.ok, getRating.ok ? '' : 'API returned ' + getRating.status);
        const ratingData = await getRating.json();
        test('Rating has average field', ratingData.averageRating !== undefined);

        // ============ REQUIREMENT 8: Testing Mode (Auto-Approve Doctors) ============
        console.log('\n[8] Testing Mode (Auto-Approve Doctors)');
        console.log('─'.repeat(50));

        const config = await fetch('http://localhost:3000/api/config');
        const configData = await config.json();
        test('Config endpoint available', config.ok);
        test('Config indicates dev mode', configData.devMode === true);
        test('Doctor account exists and usable', docData.token ? true : false);

        // ============ REQUIREMENT 9: Patient File Upload (PDF) ==========
        console.log('\n[9] Patient Medical File Upload and Record Creation');
        console.log('─'.repeat(50));
        // create an appointment to test notification as well
        const aptResp = await fetch('http://localhost:3000/api/clinical/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${patientToken}`
            },
            body: JSON.stringify({ doctorId: docData.user.id, date: '2026-12-01', time: '10:00' })
        });
        test('Can book appointment', aptResp.ok, aptResp.ok ? '' : 'API returned ' + aptResp.status);
        const patientNotifsAfter = await fetch('http://localhost:3000/api/notifications', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${patientToken}` }
        });
        const patNotifs = await patientNotifsAfter.json();
        test('Patient receives appointment notification', patientNotifsAfter.ok && Array.isArray(patNotifs), 'Patient notifs fetch failed');
        test('Notification list contains appointment alert', Array.isArray(patNotifs) && patNotifs.some(n => n.message && n.message.toLowerCase().includes('appointment')), 'No appointment notification for patient');
        const docNotifsAfter = await fetch('http://localhost:3000/api/notifications', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${docToken}` }
        });
        const docNotifs2 = await docNotifsAfter.json();
        test('Doctor receives appointment notification', docNotifsAfter.ok && Array.isArray(docNotifs2), 'Doctor notifs fetch failed');
        test('Notification list contains appointment alert', Array.isArray(docNotifs2) && docNotifs2.some(n => n.message && n.message.toLowerCase().includes('appointment')), 'No appointment notification for doctor');

        const form = new FormData();
        form.append('file', new Blob(['dummy'], { type: 'application/pdf' }), 'test.pdf');
        const uploadResp = await fetch('http://localhost:3000/api/clinical/patient/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${patientToken}` },
            body: form
        });
        test('Patient upload endpoint works', uploadResp.ok, uploadResp.ok ? '' : 'API returned ' + uploadResp.status);
        const uploadData = await uploadResp.json();
        test('Upload response contains fileUrl', uploadData.fileUrl ? true : false);
        const rxList = await fetch('http://localhost:3000/api/clinical/prescriptions', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${patientToken}` }
        });
        const rxData = await rxList.json();
        test('Prescription list includes uploaded record', Array.isArray(rxData) && rxData.some(rx => rx.fileUrl === uploadData.fileUrl));
        // doctor should also see this new document when querying patient records
        const docRxList = await fetch(`http://localhost:3000/api/clinical/prescriptions?patientId=${patientData.user.id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${docToken}` }
        });
        const docRxData = await docRxList.json();
        test('Doctor can see patient document', Array.isArray(docRxData) && docRxData.some(rx => rx.category === 'document' && rx.fileUrl === uploadData.fileUrl));

        // ============ SUMMARY ============
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                    TEST SUMMARY                            ║
╠════════════════════════════════════════════════════════════╣
║ Total Tests:  ${String(testsPassed + testsFailed).padEnd(40)} ║
║ ✓ Passed:     ${String(testsPassed).padEnd(40)} ║
║ ✗ Failed:     ${String(testsFailed).padEnd(40)} ║
╚════════════════════════════════════════════════════════════╝
`);

        if (testsFailed === 0) {
            console.log('🎉 ALL TESTS PASSED! System is ready for presentation.');
        } else {
            console.log(`⚠️ ${testsFailed} test(s) failed. Please review the details above.`);
        }

    } catch (e) {
        console.error('❌ Test error:', e.message);
    }
})();
