import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // FastAPI ka OAuth2 form data expect karta hai (JSON nahi)
    const formData = new URLSearchParams();
    formData.append('username', email); // backend expect karta hai 'username' field
    formData.append('password', password);

    try {
      // URL ke end mein /login/ add kar diya gaya hai
      const response = await fetch('https://quick-commerce-saas-1.onrender.com/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Token ko browser storage mein save karna
        localStorage.setItem('access_token', data.access_token);
        alert('Login Successful! 🚀');
        navigate('/'); // Login ke baad Home page par bhej dena
        window.location.reload(); // Navbar update karne ke liye refresh
      } else {
        setError(data.detail || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Server connection error!');
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <h2 className="text-3xl font-black text-green-700 mb-6 text-center">Welcome Back!</h2>
        
        {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              placeholder="admin@test.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition active:scale-95 shadow-md"
          >
            Login Securely
          </button>
        </form>
        
        <p className="text-center text-gray-500 mt-6">
          Don't have an account? <span className="text-green-600 font-bold cursor-pointer">Sign up</span> (Coming soon)
        </p>
      </div>
    </div>
  );
}