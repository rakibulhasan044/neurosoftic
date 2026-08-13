async function test() {
  const loginRes = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rakib@gmail.com', password: 'password123' }) 
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;

  const ordersRes = await fetch('http://localhost:8000/api/v1/orders/me/orders', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const ordersData = await ordersRes.json();
  console.log("My Orders:", JSON.stringify(ordersData, null, 2));
}
test();
