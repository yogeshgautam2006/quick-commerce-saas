import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ cartItemCount }) {
  const navigate = useNavigate();
  // Check karte hain ki token localStorage mein hai ya nahi
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    alert("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-green-700">
          🛒 Quick-Commerce
        </Link>
        
        <div className="flex gap-4 items-center">
          <Link to="/cart" className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold hover:bg-green-200 transition">
            Cart ({cartItemCount})
          </Link>

          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-full transition">
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition shadow-md">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}