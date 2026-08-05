import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Search, MapPin, Navigation } from 'lucide-react';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet marker icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [rides, setRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search local state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // Offer Ride modal state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newOrigin, setNewOrigin] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newSeats, setNewSeats] = useState(3);
  const [newPrice, setNewPrice] = useState(5);
  const [newDeparture, setNewDeparture] = useState('');

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async (o = '', d = '') => {
    setIsLoading(true);
    try {
      const res = await api.get(`/rides?origin=${o}&destination=${d}`);
      setRides(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRides(origin, destination);
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting new ride...", { newOrigin, newDestination, newSeats, newPrice, newDeparture });
    
    if (!newOrigin || !newDestination) {
      alert("Please fill in both Origin and Destination.");
      return;
    }

    try {
      let formattedDate = newDeparture;
      if (formattedDate && formattedDate.length === 16) {
        formattedDate += ':00';
      }
      if (!formattedDate) {
        const d = new Date(Date.now() + 3600000 * 2);
        formattedDate = d.toISOString().substring(0, 19);
      }

      const res = await api.post('/rides', {
        origin: newOrigin,
        destination: newDestination,
        availableSeats: newSeats,
        price: newPrice,
        departureTime: formattedDate,
      });
      
      console.log("Ride created successfully:", res.data);
      setShowOfferModal(false);
      setNewOrigin('');
      setNewDestination('');
      setNewDeparture('');
      
      // Clear top search inputs so newly added ride is visible
      setOrigin('');
      setDestination('');
      await fetchRides('', '');
      alert("Ride published successfully!");
    } catch (err: any) {
      console.error('Create ride error:', err.response?.data || err);
      alert("Error: " + (err.response?.data?.message || err.message || "Failed to create ride"));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              CampusRide
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 hidden sm:block">Welcome, {user?.firstName}</span>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Action Bar */}
        <div className="glass rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-end justify-between">
            <form onSubmit={handleSearch} className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1">Origin</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-white/10 rounded-lg focus:ring-primary-500 text-white" placeholder="Campus Library..." />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-1">Destination</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
                  <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-white/10 rounded-lg focus:ring-primary-500 text-white" placeholder="Downtown..." />
                </div>
              </div>
              <button type="submit" className="bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 mb-[1px]">
                 <Search className="w-5 h-5" /> Search
              </button>
            </form>

            <button onClick={() => setShowOfferModal(true)} className="bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 flex-shrink-0 w-full md:w-auto transition-colors">
               <Plus className="w-5 h-5" /> Offer a Ride
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List View */}
          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-xl font-bold text-white mb-4">Available Rides ({rides.length})</h2>
            {isLoading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : rides.length === 0 ? (
               <div className="text-center py-8 text-gray-400 bg-surface/30 rounded-xl border border-white/5 mx-2">No rides found. Create one!</div>
            ) : (
                rides.map(ride => (
                  <Link to={`/rides/${ride.id}`} key={ride.id} className="block glass p-5 rounded-xl hover:border-primary-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-semibold text-white flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" /> {ride.origin}</h3>
                       <span className="text-primary-400 font-bold">${ride.price?.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-400 text-sm mb-4 pl-6">
                       to {ride.destination}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                       <span>{new Date(ride.departureTime).toLocaleDateString()}</span>
                       <span className="bg-primary-500/20 text-primary-300 px-2 py-1 rounded">
                         {ride.availableSeats} seats left
                       </span>
                    </div>
                  </Link>
                ))
            )}
          </div>

          {/* Map View */}
          <div className="lg:col-span-2 h-[600px] rounded-2xl overflow-hidden glass border border-white/10 relative">
             <MapContainer center={[48.8566, 2.3522]} zoom={12} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[48.8566, 2.3522]}>
                <Popup>Campus Central</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

      </main>

      {/* Offer Ride Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass max-w-md w-full p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white">Offer a New Ride</h3>
            <form onSubmit={handleCreateRide} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Origin</label>
                <input required type="text" value={newOrigin} onChange={(e) => setNewOrigin(e.target.value)} placeholder="e.g. Bibliothèque Universitaire" className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Destination</label>
                <input required type="text" value={newDestination} onChange={(e) => setNewDestination(e.target.value)} placeholder="e.g. Gare Centrale" className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Available Seats</label>
                  <input type="number" min="1" max="8" value={newSeats} onChange={(e) => setNewSeats(Number(e.target.value))} className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Price ($)</label>
                  <input type="number" step="0.5" min="0" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Departure Date & Time</label>
                <input type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={newDeparture} onChange={(e) => setNewDeparture(e.target.value)} className="w-full px-4 py-2 bg-surface border border-white/10 rounded-lg text-white text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 text-sm">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 font-semibold text-sm">Publish Ride</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
