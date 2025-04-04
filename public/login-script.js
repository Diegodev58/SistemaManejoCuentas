const formularioLogin = document.getElementById('login-form'); // Asegúrate de que coincida con tu HTML

formularioLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const enviarComprobar = { email, password };
  console.log(email);
  console.log(password);
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enviarComprobar),
    });

    if (!response.ok) {
      
      const errorData = await response.json(); // Lee el mensaje de error del backend
      throw new Error(errorData.error || "Error en la respuesta del servidor");
      
    }

    const data = await response.json();
    console.log(data);
    window.location.href = '/private';
    
  } catch (error) {
    console.error("Error:", error);
  }
});