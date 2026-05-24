import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CartPage from './pages/CartPage'
import Login from './pages/Login'

function App() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  // Backend se items fetch karna
  useEffect(() => {
    fetch('https://quick-commerce-saas-1.onrender.com')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  // Cart mein add karne ka logic
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Razorpay Checkout & Save Order Logic
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const token = localStorage.getItem('access_token');
    
    // Security Check: Agar token nahi hai, toh pay nahi karne dena
    if (!token) {
      alert("Please login first to place an order!");
      return;
    }

    try {
      // Step 1: Razorpay Order ID generate karna
      const response = await fetch('http://localhost:8000/create-order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal })
      });
      const orderData = await response.json();

      // Step 2: Razorpay Popup settings
      const options = {
        key: "rzp_test_Ssjh03MmJgBm5u", // <-- YAHAN APNI RAZORPAY TEST KEY ZAROOR DAALEIN
        amount: orderData.amount,
        currency: "INR",
        name: "Quick-Commerce Grocery",
        description: "Test SaaS Transaction",
        order_id: orderData.order_id,
        
        // Step 3: Payment Success hone ke baad ka jadoo
        handler: async function (response) {
          
          // Data ko backend ke schema ke format mein prepare karna
          const orderPayload = {
            total_amount: cartTotal,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            items: cart.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          };

          try {
            // Database mein order save karne ki API call (With Token)
            const saveOrderRes = await fetch('http://localhost:8000/save-order/', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <-- Yahan token ja raha hai
              },
              body: JSON.stringify(orderPayload)
            });

            if (saveOrderRes.ok) {
              alert(`Payment Successful & Order Saved in Database! 🎉\nPayment ID: ${response.razorpay_payment_id}`);
              setCart([]); // Cart khali kar do
            } else {
              const errData = await saveOrderRes.json();
              alert(`Payment successful, but failed to save order: ${errData.detail}`);
            }
          } catch (err) {
            console.error("Error saving order:", err);
            alert("Order save nahi ho paya server error ki wajah se.");
          }
        },
        prefill: { name: "Test User", email: "test@example.com", contact: "9999999999" },
        theme: { color: "#16a34a" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment gateway load nahi ho paya!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar cartItemCount={cart.length} />
      
      <div className="pt-6">
        <Routes>
          <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} cartTotal={cartTotal} handleCheckout={handleCheckout} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}

export default App