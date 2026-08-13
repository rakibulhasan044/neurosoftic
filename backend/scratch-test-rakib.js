async function test() {
  const email = `rakib@gmail.com`;
  
  // Login
  const loginRes = await fetch('http://localhost:8000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }) 
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  const userId = loginData.data?.user?.id;
  console.log("Logged in user:", userId);

  if (!token) {
    console.log("No token, login failed:", loginData);
    return;
  }

  // Get a product variant ID to place an order
  const productsRes = await fetch('http://localhost:8000/api/v1/products');
  const productsData = await productsRes.json();
  const variant = productsData.data[0]?.variants[0];
  
  if (!variant) {
    console.log("No variant found");
    return;
  }

  // Place order
  const orderRes = await fetch('http://localhost:8000/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items: [{ productVariantId: variant.id, quantity: 1, price: 100 }],
      successUrl: 'http://localhost:3000/success',
      cancelUrl: 'http://localhost:3000/checkout',
      shippingMethod: 'inside_dhaka',
      paymentMethod: 'manual',
      customerInfo: {
        email: email,
        firstName: 'Rakib',
        lastName: 'Test',
        phone: '1234567890',
        address: 'Test Address',
        city: 'Dhaka',
        country: 'Bangladesh',
        zipCode: '1234'
      }
    })
  });
  const orderData = await orderRes.json();
  console.log("Order Data:", JSON.stringify(orderData, null, 2));
}
test();
