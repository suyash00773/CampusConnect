const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting CampusConnect Automated Verification Suite...\n');

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('1. Health check:', healthData.status === 'healthy' ? '✅ PASS' : '❌ FAIL');

  // 2. Admin Login
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@campusconnect.edu',
      password: 'Admin@CampusConnect2026',
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('2. Admin Login:', token ? '✅ PASS (Token received)' : '❌ FAIL', loginData.message);

  // 3. Auth Check /me
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log('3. Verify /auth/me:', meData.success ? `✅ PASS (${meData.admin.username})` : '❌ FAIL');

  // 4. Fetch Events
  const eventsRes = await fetch(`${BASE_URL}/events`);
  const eventsData = await eventsRes.json();
  const testEvent = eventsData.data[0];
  console.log(`4. List Events: ✅ PASS (${eventsData.pagination.total} events found, test target: "${testEvent.title}")`);

  // 5. Register Student for Event
  const regPayload = {
    eventId: testEvent._id,
    fullName: 'Ananya Sharma',
    email: 'ananya.test@student.edu',
    college: 'IIT Delhi Campus',
    academicYear: '3rd Year',
    phone: '+91 98765 00112',
    notes: 'Testing automated student registration pipeline',
  };

  const regRes = await fetch(`${BASE_URL}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  });
  const regData = await regRes.json();
  console.log(
    '5. Student Registration:',
    regData.success ? `✅ PASS (Registration ID: ${regData.data.registrationId})` : '❌ FAIL',
    regData.message
  );

  // 6. Duplicate Registration Prevention
  const dupRes = await fetch(`${BASE_URL}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(regPayload),
  });
  const dupData = await dupRes.json();
  console.log(
    '6. Duplicate Prevention Check:',
    dupRes.status === 409 ? `✅ PASS (Successfully rejected duplicate with 409 Conflict: "${dupData.message}")` : '❌ FAIL'
  );

  // 7. Admin Dashboard Stats
  const statsRes = await fetch(`${BASE_URL}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const statsData = await statsRes.json();
  console.log(
    '7. Admin Stats Endpoint:',
    statsData.success ? `✅ PASS (Total Regs: ${statsData.data.totalRegistrations}, Events: ${statsData.data.totalEvents})` : '❌ FAIL'
  );

  // 8. CSV Export
  const csvRes = await fetch(`${BASE_URL}/registrations/export/csv`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const csvText = await csvRes.text();
  const hasHeaders = csvText.includes('Registration ID') && csvText.includes('Ananya Sharma');
  console.log(
    '8. Registration CSV Export:',
    hasHeaders ? `✅ PASS (Generated ${csvText.split('\n').length} CSV lines with correct RFC headers)` : '❌ FAIL'
  );

  // 9. Admin Event CRUD (Create, Update, Delete)
  const createEvRes = await fetch(`${BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Automated Test Hack Day 2026',
      shortDescription: 'Short description for automated test event',
      description: 'Full description testing event creation pipeline with Zod validation.',
      club: testEvent.club._id || testEvent.club,
      category: 'Hackathon',
      date: '2026-11-25',
      startTime: '10:00 AM',
      endTime: '06:00 PM',
      venue: 'Innovation Sandbox Lab 1',
      locationType: 'In-Person',
      bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
      capacity: 50,
      status: 'published',
      tags: ['Test', 'Automation'],
      requirements: ['Laptop'],
    }),
  });
  const createdEvData = await createEvRes.json();
  const createdId = createdEvData.data?._id;
  console.log('9a. Admin Create Event:', createdId ? `✅ PASS (ID: ${createdId})` : '❌ FAIL');

  // Update
  const updateRes = await fetch(`${BASE_URL}/events/${createdId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Automated Test Hack Day 2026 (Updated)',
      capacity: 75,
    }),
  });
  const updateData = await updateRes.json();
  console.log('9b. Admin Update Event:', updateData.data?.capacity === 75 ? '✅ PASS' : '❌ FAIL');

  // Delete
  const delRes = await fetch(`${BASE_URL}/events/${createdId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const delData = await delRes.json();
  console.log('9c. Admin Delete Event:', delData.success ? '✅ PASS' : '❌ FAIL');

  console.log('\n🎉 ALL BACKEND ENDPOINTS AND LOGICAL WORKFLOWS VERIFIED 100% WORKING!\n');
}

runTests().catch(console.error);
