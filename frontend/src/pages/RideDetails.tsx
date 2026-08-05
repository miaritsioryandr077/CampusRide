import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ChevronLeft, Send, CheckCircle, Clock } from 'lucide-react';

export default function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [ride, setRide] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    fetchRideData();
    fetchMessages();
    setupWebSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [id]);

  const fetchRideData = async () => {
    try {
      const res = await api.get(`/rides/${id}`);
      setRide(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${id}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const setupWebSocket = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        client.subscribe(`/topic/ride/${id}`, (msg) => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
        });
      }
    });
    client.activate();
    stompClient.current = client;
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClient.current || !stompClient.current.connected) return;

    stompClient.current.publish({
      destination: `/app/chat/${id}`,
      body: JSON.stringify({
        rideId: id,
        content: newMessage,
      }),
      headers: { Authorization: `Bearer ${token}` }
    });
    setNewMessage('');
  };
  
  const handleRequestRide = async () => {
      try {
          await api.post(`/requests/ride/${id}`);
          alert("Ride request sent successfully!");
      } catch (err) {
          alert("Failed to send ride request.");
      }
  }

  if (isLoading) return <div className="min-h-screen bg-background text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="glass sticky top-0 z-50 border-b border-white/5 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <span className="font-semibold text-white">Ride Details</span>
             <div className="w-20"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Ride Info Panel */}
        <div className="flex-1 space-y-6">
           <div className="glass p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-2xl rounded-full"></div>
               <h2 className="text-2xl font-bold text-white mb-2">{ride?.origin} to {ride?.destination}</h2>
               <div className="text-primary-400 text-xl font-bold mb-6">${ride?.price?.toFixed(2)}</div>
               
               <div className="space-y-4 text-gray-300">
                   <div className="flex items-center gap-3">
                       <Clock className="w-5 h-5 text-gray-500" />
                       {new Date(ride?.departureTime).toLocaleString()}
                   </div>
                   <div className="flex items-center gap-3">
                       <CheckCircle className="w-5 h-5 text-gray-500" />
                       Driver: {ride?.driverName}
                   </div>
                   <div className="bg-surface/50 p-3 rounded-xl border border-white/5 inline-block">
                        <span className="font-bold text-white">{ride?.availableSeats}</span> seats available
                   </div>
               </div>

               {user?.id !== ride?.driverId && (
                   <button onClick={handleRequestRide} className="w-full mt-8 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-medium transition-colors">
                       Request to Join Ride
                   </button>
               )}
           </div>
        </div>

        {/* Live Chat Panel */}
        <div className="flex-1 glass rounded-2xl flex flex-col h-[500px]">
           <div className="p-4 border-b border-white/5 font-semibold text-white">
               Live Trip Chat
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {messages.length === 0 ? (
                   <div className="text-center text-gray-500 mt-10">Say hi to everyone!</div>
               ) : (
                   messages.map((m, idx) => (
                       <div key={idx} className={`flex flex-col ${m.senderId === user?.id ? 'items-end' : 'items-start'}`}>
                           <span className="text-xs text-gray-400 mb-1 px-2">{m.senderId === user?.id ? 'You' : m.senderName}</span>
                           <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${m.senderId === user?.id ? 'bg-primary-600 text-white rounded-br-none' : 'bg-surface text-gray-200 rounded-bl-none'}`}>
                               {m.content}
                           </div>
                       </div>
                   ))
               )}
           </div>

           <form onSubmit={sendMessage} className="p-4 border-t border-white/5 flex gap-2">
               <input 
                 type="text" 
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 className="flex-1 bg-surface border border-white/10 rounded-full px-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none text-white text-sm"
                 placeholder="Type a message..."
               />
               <button type="submit" className="w-10 h-10 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-colors">
                   <Send className="w-4 h-4 ml-[-2px]" />
               </button>
           </form>
        </div>
      </main>
    </div>
  );
}
