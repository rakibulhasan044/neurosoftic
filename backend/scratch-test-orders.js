async function test() {
  // Login with existing user
  const loginRes = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rhrakib044@gmail.com', password: 'password123' }) 
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  const userId = loginData.data?.user?.id;
  console.log("Logged in user:", userId);

  if (!token) {
    console.log("No token, login failed:", loginData);
    return;
  }

  // Fetch orders using Bearer
  const ordersRes = await fetch('http://localhost:8000/api/v1/orders/me/orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const ordersData = await ordersRes.json();
  console.log("Orders:", ordersData.orders?.length);
  console.log("First Order:", ordersData.orders?.[0]?.id);
}
test();
