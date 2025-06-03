import React, { createContext, useCallback, useState, useEffect } from 'react';
import { PowerOutageEvent } from '@/types/event';
import { storeEvents, getEvents } from '@/services/eventStorage';

interface EventContextData {
  events: PowerOutageEvent[];
  loading: boolean;
  fetchEvents: () => Promise<void>;
  addEvent: (event: PowerOutageEvent) => void;
  updateEvent: (id: string, event: Partial<PowerOutageEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => PowerOutageEvent | null;
}

const EventContext = createContext<EventContextData>({} as EventContextData);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<PowerOutageEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const storedEvents = await getEvents();
      setEvents(storedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = useCallback((event: PowerOutageEvent) => {
    const newEvents = [...events, event];
    setEvents(newEvents);
    storeEvents(newEvents);
  }, [events]);

  const updateEvent = useCallback((id: string, updatedEvent: Partial<PowerOutageEvent>) => {
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex >= 0) {
      const newEvents = [...events];
      newEvents[eventIndex] = {
        ...newEvents[eventIndex],
        ...updatedEvent
      };
      
      setEvents(newEvents);
      storeEvents(newEvents);
    }
  }, [events]);

  const deleteEvent = useCallback((id: string) => {
    const newEvents = events.filter(event => event.id !== id);
    setEvents(newEvents);
    storeEvents(newEvents);
  }, [events]);

  const getEventById = useCallback((id: string) => {
    return events.find(event => event.id === id) || null;
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        getEventById
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;