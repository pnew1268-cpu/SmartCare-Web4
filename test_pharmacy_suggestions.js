// Test doctor pharmacy suggestion system
(async () => {
    try {
        console.log('=== Testing Doctor Pharmacy Suggestions ===\n');

        // 1. Login as doctor
        console.log('1. Logging in as doctor...');
        const docLogin = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loginId: '01099999999', password: 'password123' })
        });
        const docData = await docLogin.json();
        const docToken = docData.token;
        console.log(`✓ Doctor logged in:`, docData.user?.name);

        // 2. Submit pharmacy suggestion
        console.log('\n2. Doctor suggesting new pharmacy...');
        const suggest = await fetch('http://localhost:3000/api/pharmacy/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${docToken}`
            },
            body: JSON.stringify({
                name: 'Al-Nile Pharmacy',
                address: '123 Nile Street',
                city: 'Cairo',
                phone: '02-12345678',
                latitude: 30.0444,
                longitude: 31.2357,
                notes: 'Excellent customer service, good stock availability'
            })
        });
        const suggestData = await suggest.json();
        if (suggest.ok) {
            console.log('✓ Pharmacy suggestion submitted');
            console.log('  Status:', suggestData.suggestion.status);
            console.log('  Name:', suggestData.suggestion.name);
            console.log('  City:', suggestData.suggestion.city);
        } else {
            console.log('✗ Failed to suggest pharmacy:', suggestData.msg);
        }

        // 3. Submit another suggestion
        console.log('\n3. Doctor suggesting another pharmacy...');
        const suggest2 = await fetch('http://localhost:3000/api/pharmacy/suggest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${docToken}`
            },
            body: JSON.stringify({
                name: 'Green Pharmacy',
                address: '456 Green Road',
                city: 'Giza',
                phone: '02-87654321',
                notes: 'Specializes in elderly care medications'
            })
        });
        const suggestData2 = await suggest2.json();
        if (suggest2.ok) {
            console.log('✓ Second pharmacy suggestion submitted');
        }

        // 4. Retrieve doctor's suggestions
        console.log('\n4. Retrieving doctor\'s pharmacy suggestions...');
        const getSuggestions = await fetch('http://localhost:3000/api/pharmacy/my-suggestions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${docToken}`
            }
        });
        const suggestions = await getSuggestions.json();
        console.log(`✓ Retrieved ${suggestions.length} suggestion(s)`);
        suggestions.forEach((sugg, idx) => {
            console.log(`\n  Suggestion ${idx + 1}:`);
            console.log(`    Name: ${sugg.name}`);
            console.log(`    Address: ${sugg.address}`);
            console.log(`    City: ${sugg.city}`);
            console.log(`    Status: ${sugg.status}`);
            console.log(`    Submitted: ${new Date(sugg.createdAt).toLocaleString()}`);
        });

        console.log('\n=== Pharmacy Suggestion Test Complete ===');
    } catch (e) {
        console.error('Test error:', e.message);
    }
})();
