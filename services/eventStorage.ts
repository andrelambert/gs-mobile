import AsyncStorage from '@react-native-async-storage/async-storage';
import { PowerOutageEvent } from '@/types/event';

const EVENTS_STORAGE_KEY = '@PowerOutageTracker:events';

export async function storeEvents(events: PowerOutageEvent[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(events);
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error storing events', error);
    throw error;
  }
}

export async function getEvents(): Promise<PowerOutageEvent[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error retrieving events', error);
    return [];
  }
}

export async function clearEvents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(EVENTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing events', error);
    throw error;
  }
}

export async function addEvent(event: PowerOutageEvent): Promise<void> {
  try {
    const events = await getEvents();
    events.push(event);
    await storeEvents(events);
  } catch (error) {
    console.error('Error adding event', error);
    throw error;
  }
}

export async function updateEvent(id: string, updatedEvent: Partial<PowerOutageEvent>): Promise<void> {
  try {
    const events = await getEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex >= 0) {
      events[eventIndex] = {
        ...events[eventIndex],
        ...updatedEvent
      };
      
      await storeEvents(events);
    }
  } catch (error) {
    console.error('Error updating event', error);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const events = await getEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    await storeEvents(filteredEvents);
  } catch (error) {
    console.error('Error deleting event', error);
    throw error;
  }
}

export async function getEventById(id: string): Promise<PowerOutageEvent | null> {
  try {
    const events = await getEvents();
    return events.find(event => event.id === id) || null;
  } catch (error) {
    console.error('Error getting event by ID', error);
    return null;
  }
}