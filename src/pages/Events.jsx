import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';

const EventCard = ({ event, isPast }) => {
  const handleRegister = () => {
    if (event.registration_link) {
      window.open(event.registration_link, '_blank', 'noreferrer');
    }
  };

  const isFull = event.registered >= event.capacity;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass-card p-6 rounded-2xl ${isPast ? 'opacity-80' : 'border border-blue-500/30'}`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white max-w-[70%]">{event.title}</h3>
        <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 flex items-center gap-1">
          <Calendar size={12} /> {event.date}
        </div>
      </div>

      <div className="text-gray-400 text-sm mb-6 min-h-[60px]">{event.description}</div>

      {!isPast && (
        <div className="mb-6 space-y-2">
          {event.time && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock size={14} className="text-purple-400" /> {event.time}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin size={14} className="text-red-400" /> {event.venue}
          </div>
          <div className="text-xs text-gray-500">
            {event.registered}/{event.capacity} registered
          </div>
        </div>
      )}

      <button
        onClick={handleRegister}
        disabled={isPast || isFull || !event.registration_link}
        className={`w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
          isPast
            ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
            : isFull
            ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
            : !event.registration_link
            ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]'
        }`}
      >
        {isPast ? 'Completed' : isFull ? 'Full' : (
          <><ExternalLink size={16} /> Register Now</>
        )}
      </button>
    </motion.div>
  );
};

const Events = () => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.getEvents();
      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const today    = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= today);
  const past     = events.filter((e) => new Date(e.date) < today);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-400" size={40} />
      <p className="text-slate-400 text-sm">Connecting to server...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <RefreshCw size={28} className="text-red-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Could not load events</h2>
        <p className="text-slate-400 text-sm max-w-sm">The server may be waking up. Please wait a moment and try again.</p>
      </div>
      <button
        onClick={load}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
      >
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Upcoming <span className="text-purple-500">Events</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Join our workshops, hackathons, and seminars.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span> Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-white/5">
            <Calendar size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">No upcoming events scheduled yet.</p>
            <p className="text-slate-600 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} isPast={false} />
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-400 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-gray-600 rounded-full"></span> Past Events
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {past.map((event) => (
              <EventCard key={event.id} event={event} isPast={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
