import { FiPlus } from 'react-icons/fi';
import { BsLightningChargeFill } from 'react-icons/bs';

export default function Home({ products, addToCart }) {
  
  // Naya working dummy image function
  const getImageUrl = (name) => {
    // Hum ek high-quality static grocery image use kar rahe hain demo ke liye
    return "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 mb-12">
      
      {/* 🌟 HERO BANNER */}
      <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
        <div className="z-10 max-w-lg">
          <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase mb-4 inline-block backdrop-blur-sm">
            Delivery in 10 Minutes
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Fresh Groceries, <br />
            <span className="text-green-200">Delivered Fast.</span>
          </h1>
          <p className="text-green-50 mb-8 text-lg">
            Get your daily essentials, fresh veggies, and snacks delivered right to your doorstep before you even finish brewing your coffee.
          </p>
          <button className="bg-white text-green-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center gap-2">
            Order Now <BsLightningChargeFill className="text-yellow-400" />
          </button>
        </div>
        {/* Abstract Background Element */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {/* 🛍️ PRODUCT GRID */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-black text-gray-800">Trending Items</h2>
        <span className="text-green-600 font-bold hover:underline cursor-pointer">See all</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
            
            {/* Product Image */}
            <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
              <img 
                src={getImageUrl(product.name)} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Badge */}
              {product.stock < 10 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Product Details */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
              <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[40px]">{product.description}</p>
              
              <div className="mt-5 flex justify-between items-center">
                <div>
                  <span className="text-xl font-black text-gray-900">₹{product.price}</span>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-green-50 hover:bg-green-600 text-green-700 hover:text-white h-10 w-10 flex items-center justify-center rounded-xl font-bold transition-colors"
                >
                  <FiPlus size={22} />
                </button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}