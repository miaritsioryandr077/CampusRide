import { Link } from 'react-router-dom';
import { Car, MapPin, Shield, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-primary-400/20 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <Car className="text-primary-500 w-8 h-8" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">CampusRide</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2.5 text-sm font-medium text-gray-200 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2.5 text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-full transition-all shadow-[0_0_20px_rgba(213,76,188,0.3)] hover:shadow-[0_0_25px_rgba(213,76,188,0.5)]">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in-up">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            The Next-Gen <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-500 to-purple-500">Ride-Sharing</span> <br />
            for Students.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto lg:mx-0">
            Connect with fellow students, share your daily commute, save money, and reduce your carbon footprint with an experience designed exclusively for your university campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <Link to="/register" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(213,76,188,0.4)]">
              Find a Ride <MapPin className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full relative h-[400px] lg:h-[600px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
           <div className="absolute inset-0 glass rounded-3xl p-6 flex flex-col gap-4 shadow-2xl overflow-hidden transform lg:rotate-3 transition-transform duration-500 hover:rotate-0">
              <div className="w-full h-48 bg-surfaceHover rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
                <div className="absolute bottom-4 left-4 right-4 glass p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">Campus to Downtown</h3>
                    <p className="text-xs text-gray-400">Departs in 15 mins</p>
                  </div>
                  <div className="text-primary-400 font-bold">$3.00</div>
                </div>
              </div>
              <div className="flex-1 gap-4 flex flex-col justify-end pb-4">
                 <div className="glass p-4 rounded-xl flex items-center gap-4 border-l-4 border-primary-500">
                    <Shield className="text-primary-500 w-6 h-6" />
                    <div>
                      <h4 className="font-semibold text-white">Verified Students Only</h4>
                      <p className="text-xs text-gray-400">Safe and secure community</p>
                    </div>
                 </div>
                 <div className="glass p-4 rounded-xl flex items-center gap-4 border-l-4 border-purple-500">
                    <Zap className="text-purple-500 w-6 h-6" />
                    <div>
                      <h4 className="font-semibold text-white">Instant Booking</h4>
                      <p className="text-xs text-gray-400">Real-time ride requests and chat</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
