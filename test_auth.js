const fetch = require('node-fetch');

async function testRegistration() {
  // Make sure this URL matches your server EXACTLY
  const url = 'http://localhost:5000/api/auth/register';
  
  const fakeUser = {
    name: "Test User",
    email: "test@yumigo.com",
    password: "secretpassword123"
  };

  console.log("📱 Sending data to server...");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fakeUser)
    });

    // CHECK: Is the response okay?
    if (!response.ok) {
        const text = await response.text();
        console.log("⚠️ Server Error:", response.status);
        console.log("📄 Response Text:", text); // This will show us the real error
        return;
    }

    const data = await response.json();
    console.log("✅ Server Replied:", data);
  
  } catch (error) {
    console.log("❌ Connection Error:", error.message);
  }
}

testRegistration();