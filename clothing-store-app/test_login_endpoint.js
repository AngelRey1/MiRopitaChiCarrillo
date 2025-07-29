const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🧪 Probando endpoint de login...');
    
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123'
      })
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    const data = await response.json();
    console.log('📄 Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login exitoso!');
      console.log('🔑 Token:', data.token ? 'Presente' : 'Ausente');
      console.log('👤 Usuario:', data.user ? data.user.username : 'Ausente');
    } else {
      console.log('❌ Login falló');
    }
    
  } catch (error) {
    console.error('💥 Error de conexión:', error.message);
  }
}

testLogin(); 