import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event, EventFormData } from '@/types/event';
import eventTech from '@/assets/event-tech.jpg';
import eventNetworking from '@/assets/event-networking.jpg';
import eventWorkshop from '@/assets/event-workshop.jpg';
import eventDesign from '@/assets/event-design.jpg';

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    description: 'Join us for an incredible day of innovation, networking, and learning about the latest trends in technology. Featuring keynote speakers from top tech companies.',
    date: '2025-02-15',
    time: '09:00',
    location: 'San Francisco Convention Center',
    capacity: 500,
    attendees: ['user-1', 'user-2', 'user-3'],
    image: eventTech,
    creatorId: 'user-demo',
    creatorName: 'Demo User',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and innovators in a relaxed setting. Perfect for finding your next co-founder or investor.',
    date: '2025-01-20',
    time: '18:00',
    location: 'WeWork Downtown',
    capacity: 100,
    attendees: ['user-1'],
    image: eventNetworking,
    creatorId: 'user-demo',
    creatorName: 'Demo User',
    category: 'Networking',
  },
  {
    id: '3',
    title: 'AI Workshop: Build Your First Model',
    description: 'Hands-on workshop where you will learn to build, train, and deploy your first machine learning model. Beginners welcome!',
    date: '2025-01-25',
    time: '10:00',
    location: 'Google Campus',
    capacity: 50,
    attendees: [],
    image: eventWorkshop,
    creatorId: 'user-demo',
    creatorName: 'Demo User',
    category: 'Workshop',
  },
  {
    id: '4',
    title: 'Design Systems Summit',
    description: 'A full-day event dedicated to design systems, component libraries, and scalable design. Learn from industry leaders.',
    date: '2025-02-01',
    time: '09:30',
    location: 'Figma HQ, SF',
    capacity: 200,
    attendees: ['user-2', 'user-3'],
    image: eventDesign,
    creatorId: 'user-other',
    creatorName: 'Another User',
    category: 'Design',
  },
];

interface EventContextType {
  events: Event[];
  addEvent: (event: EventFormData, userId: string, userName: string) => Event;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  rsvpEvent: (eventId: string, userId: string) => { success: boolean; message: string };
  cancelRsvp: (eventId: string, userId: string) => void;
  getEventById: (id: string) => Event | undefined;
  getUserEvents: (userId: string) => { created: Event[]; attending: Event[] };
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = (eventData: EventFormData, userId: string, userName: string): Event => {
    const newEvent: Event = {
      ...eventData,
      id: 'event-' + Date.now(),
      attendees: [],
      creatorId: userId,
      creatorName: userName,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...eventData } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const rsvpEvent = (eventId: string, userId: string): { success: boolean; message: string } => {
    const event = events.find(e => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found' };
    if (event.attendees.includes(userId)) {
      return { success: false, message: 'You have already RSVPd to this event' };
    }
    if (event.attendees.length >= event.capacity) {
      return { success: false, message: 'Event is at full capacity' };
    }
    
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, attendees: [...e.attendees, userId] }
        : e
    ));
    return { success: true, message: 'Successfully RSVPd!' };
  };

  const cancelRsvp = (eventId: string, userId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, attendees: e.attendees.filter(id => id !== userId) }
        : e
    ));
  };

  const getEventById = (id: string) => events.find(e => e.id === id);

  const getUserEvents = (userId: string) => ({
    created: events.filter(e => e.creatorId === userId),
    attending: events.filter(e => e.attendees.includes(userId)),
  });

  return (
    <EventContext.Provider value={{ 
      events, addEvent, updateEvent, deleteEvent, 
      rsvpEvent, cancelRsvp, getEventById, getUserEvents 
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
