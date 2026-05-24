import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Adding...');

    const newProduct = {
      name: name,
      description: description,
      price: parseFloat(price),
      stock: parseInt(stock, 10)
    };

    try {
      const response = await fetch('https://quick-commerce-saas-1.onrender.com/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        alert('Product added successfully! 🎉');
        navigate('/'); // Item add hone ke baad Home page par bhej do
        window.location.reload(); // Naye items dikhane ke liye refresh
      } else {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setStatus('Failed to connect to server.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg">
        <h2 className="text-3xl font-black text-blue-700 mb-6 text-center">Add New Item 📦</h2>
        
        {status && <p className="text-center mb-4 font-bold text-blue-600">{status}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Item Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="e.g. Amul Milk 1L" />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Fresh cow milk" />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">Price (₹)</label>
              <input type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 outline-none"
                placeholder="65" />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-bold mb-2">Stock Quantity</label>
              <input type="number" required min="1" value={stock} onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 outline-none"
                placeholder="50" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition active:scale-95 shadow-md mt-4">
            Add to Store
          </button>
        </form>
      </div>
    </div>
  );
}