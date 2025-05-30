import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { PowerOutageEvent } from '../types';
import * as eventStorage from '../services/eventStorage';

interface EventContextType {
  events: PowerOutageEvent[];
  loading: boolean;
  addEvent: (eventData: Omit<PowerOutageEvent, 'id' | 'timestampRegistro'>) => Promise<void>;
  updateEvent: (event: PowerOutageEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEvent: (id: string) => PowerOutageEvent | undefined;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [events, setEvents] = useState<PowerOutageEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadEvents = async () => {
    setLoading(true);
    const storedEvents = await eventStorage.getAllEvents();
    setEvents(storedEvents);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async (eventData: Omit<PowerOutageEvent, 'id' | 'timestampRegistro'>) => {
    const newEvent = await eventStorage.saveNewEvent(eventData);
    if (newEvent) {
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
  };

  const updateEvent = async (updatedEventData: PowerOutageEvent) => {
    const success = await eventStorage.updateEventById(updatedEventData);
    if (success) {
      setEvents(prevEvents =>
        prevEvents.map(event => (event.id === updatedEventData.id ? updatedEventData : event))
      );
    }
  };

  const deleteEvent = async (id: string) => {
    const success = await eventStorage.deleteEventById(id);
    if (success) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    }
  };

  const getEvent = (id: string): PowerOutageEvent | undefined => {
    return events.find(event => event.id === id);
  };

  return (
    <EventContext.Provider value={{ events, loading, addEvent, updateEvent, deleteEvent, getEvent, refreshEvents: loadEvents }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};