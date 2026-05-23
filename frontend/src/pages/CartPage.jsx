export default function CartPage({ cart, cartTotal, handleCheckout }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
          Your Cart Checkout
        </h2>

        <div className="space-y-4 mb-8">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center italic py-10 text-lg">Your cart is feeling light! Go add some items.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-bold text-xl text-gray-800">{item.name}</p>
                  <p className="text-gray-500">₹{item.price} x {item.quantity}</p>
                </div>
                <p className="font-bold text-2xl text-green-700">₹{item.price * item.quantity}</p>
              </div>
            ))
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-600">Total Amount to Pay</span>
            <span className="text-4xl font-black text-gray-900">₹{cartTotal}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-xl shadow-lg transition-all ${
              cart.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 active:scale-95"
            }`}
          >
            Pay Securely via Razorpay ➔
          </button>
        </div>
      </div>
    </div>
  )
}