

export default function MyRides() {
    return (
      <div className="p-4 font-sans font-medium">
        <h1 className="text-2xl font-bold mb-1">My Rides</h1>
        <hr />
  
        <h2 className="text-xl mt-3 mb-1">Pending Trips:</h2>
        <div className="max-h-52 overflow-auto scrollbar">
          <button
            className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
            <p>Driver: Jeremy • Trips taken: 2</p>
            <p>Date</p>
            <p><strong>Seats Available:</strong> 2</p>
          </button>
          <button
            className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
            <p>Driver: Jeremy • Trips taken: 2</p>
            <p>Date</p>
            <p><strong>Seats Available:</strong> 2</p>
          </button>
          <button
            className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
            <p>Driver: Jeremy • Trips taken: 2</p>
            <p>Date</p>
            <p><strong>Seats Available:</strong> 2</p>
          </button>
        </div>
  
        <h2 className="text-xl mt-3 mb-1">Completed Trips:</h2>
        <div className="max-h-52 overflow-auto scrollbar">
          <button
            className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
            <p>Driver: Jeremy • Trips taken: 2</p>
            <p>Date</p>
            <p><strong>Seats Available:</strong> 2</p>
          </button>
          <button
            className="w-full text-left px-1 bg-white border border-gray-300 mb-2 rounded-lg relative hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h3 className="relative text-m font-semibold py-1">Boulder <strong>to</strong> Denver</h3>
            <p>Driver: Jeremy • Trips taken: 2</p>
            <p>Date</p>
            <p><strong>Seats Available:</strong> 2</p>
          </button>
        </div>
      </div>
    )
  }