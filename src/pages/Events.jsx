import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Clock, Loader2, ExternalLink, AlertCircle } from 'lucide-react';
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const MOCK_EVENTS = useMemo(() => [
    {
      id: 1,
      title: "Web Dev Bootcamp",
      description: "Learn HTML, CSS, JS from scratch in one day with our hands-on experts.",
      date: "2026-08-10",
      time: "10:00 AM",
      venue: "CS Lab 301",
      category: "Web Development",
      capacity: 100,
      registered: 45,
      registration_link: "https://forms.gle/mock"
    },
    {
      id: 2,
      title: "AI & ML Workshop",
      description: "Hands-on session on neural networks, LLMs, and Python libraries.",
      date: "2026-08-20",
      time: "2:00 PM",
      venue: "Seminar Hall",
      category: "AI/ML",
      capacity: 80,
      registered: 60,
      registration_link: "https://forms.gle/mock"
    },
    {
      id: 3,
      title: "Hackathon 2026",
      description: "24-hour coding competition. Build innovative projects and win prizes!",
      date: "2026-09-05",
      time: "9:00 AM",
      venue: "Main Auditorium",
      category: "Hackathon",
      capacity: 200,
      registered: 120,
      registration_link: "https://forms.gle/mock"
    }
  ], []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getEvents();
        if (Array.isArray(data)) {
          setEvents(data);
          setIsOffline(false);
        } else {
          setEvents(MOCK_EVENTS);
          setIsOffline(true);
        }
      } catch (err) {
        console.log(err);
        setEvents(MOCK_EVENTS);
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [MOCK_EVENTS]);

  const today = new Date();
  const upcoming = events.filter((e) => new Date(e.date) >= today);
  const past     = events.filter((e) => new Date(e.date) < today);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-400" size={40} />
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

      {isOffline && (
        <div className="max-w-2xl mx-auto mb-10 px-6 py-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
          <AlertCircle className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-400" />
          <span>
            <strong>Demo Mode:</strong> The frontend cannot connect to the backend server (at <code className="bg-slate-950 px-1.5 py-0.5 rounded font-mono text-xs text-white">http://localhost:5000</code>). Showing offline mock events.
          </span>
        </div>
      )}

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span> Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming events right now.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} isPast={false} />
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default Events;
