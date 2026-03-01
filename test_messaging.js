// Test messaging system functionality
(async () => {
    try {
        console.log('=== Testing Messaging System ===\n');

        // 1. Login as patient
        console.log('1. Logging in as patient...');
        const patientLogin = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: '12345678901234', password: 'test123' })
        });
        const patientData = await patientLogin.json();
        const patientToken = patientData.token;
        console.log(`✓ Patient logged in:`, patientData.user?.name);

        // 2. Login as doctor
        console.log('\n2. Logging in as doctor...');
        const docLogin = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: '01099999999', password: 'password123' })
        });
        const docData = await docLogin.json();
        const docToken = docData.token;
        console.log(`✓ Doctor logged in:`, docData.user?.name);

        // 3. Patient sends message to doctor
        console.log('\n3. Patient sending message to doctor...');
        const sendMsg = await fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${patientToken}`
            },
            body: JSON.stringify({
                receiverId: '30000000000001',
                content: 'Hello Doctor, I need a consultation.'
            })
        });
        const msgData = await sendMsg.json();
        if (sendMsg.ok) {
            console.log('✓ Message sent successfully');
            console.log('  Message ID:', msgData.id);
            console.log('  Content:', msgData.content);
            console.log('  Date:', msgData.date || msgData.createdAt);
        } else {
            console.log('✗ Failed to send message:', msgData.msg);
        }

        // 4. Doctor retrieves conversation
        console.log('\n4. Doctor retrieving messages from patient...');
        const getMsg = await fetch('http://localhost:3000/api/messages/12345678901234', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${docToken}`
            }
        });
        const messages = await getMsg.json();
        console.log(`✓ Retrieved ${messages.length} message(s)`);
        if (messages.length > 0) {
            console.log('  Latest message:', messages[messages.length - 1].content);
            console.log('  From:', messages[messages.length - 1].senderId);
        }

        // 5. Doctor replies
        console.log('\n5. Doctor sending reply...');
        const replyMsg = await fetch('http://localhost:3000/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${docToken}`
            },
            body: JSON.stringify({
                receiverId: '12345678901234',
                content: 'Of course, I can help. Please book an appointment.'
            })
        });
        const replyData = await replyMsg.json();
        if (replyMsg.ok) {
            console.log('✓ Reply sent successfully');
        } else {
            console.log('✗ Failed to send reply:', replyData.msg);
        }

        // 6. Patient retrieves full conversation
        console.log('\n6. Patient retrieving full conversation...');
        const getFullConv = await fetch('http://localhost:3000/api/messages/30000000000001', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${patientToken}`
            }
        });
        const fullConv = await getFullConv.json();
        console.log(`✓ Retrieved ${fullConv.length} total message(s) in conversation`);
        console.log('\nConversation:');
        fullConv.forEach((msg, idx) => {
            const sender = msg.senderId === '12345678901234' ? 'Patient' : 'Doctor';
            console.log(`  ${idx + 1}. [${sender}]: ${msg.content}`);
        });

        console.log('\n=== Messaging System Test Complete ===');
    } catch (e) {
        console.error('Test error:', e.message);
    }
})();
