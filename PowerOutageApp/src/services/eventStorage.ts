import AsyncStorage from '@react-native-async-storage/async-storage';
import { PowerOutageEvent } from '../types';
import * as Crypto from 'expo-crypto'; // Para gerar UUIDs

const STORAGE_KEY = 'powerOutageEvents';

// Função para gerar UUID
const generateUUID = (): string => {
  return Crypto.randomUUID();
};

// Ler todos os eventos
export const getAllEvents = async (): Promise<PowerOutageEvent[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao buscar eventos do AsyncStorage", e);
    return [];
  }
};

// Salvar um novo evento (ou sobrescrever todos os eventos, se preferir tratar IDs aqui)
export const saveNewEvent = async (eventData: Omit<PowerOutageEvent, 'id' | 'timestampRegistro'>): Promise<PowerOutageEvent | null> => {
  try {
    const currentEvents = await getAllEvents();
    const newEvent: PowerOutageEvent = {
      ...eventData,
      id: generateUUID(),
      timestampRegistro: new Date().toISOString(),
    };
    const updatedEvents = [...currentEvents, newEvent];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
    return newEvent;
  } catch (e) {
    console.error("Erro ao salvar novo evento no AsyncStorage", e);
    return null;
  }
};

// Ler um evento por ID (embora geralmente você vá ler todos e filtrar na UI)
export const getEventById = async (id: string): Promise<PowerOutageEvent | null> => {
  try {
    const events = await getAllEvents();
    return events.find(event => event.id === id) || null;
  } catch (e) {
    console.error("Erro ao buscar evento por ID", e);
    return null;
  }
};

// Atualizar um evento existente
export const updateEventById = async (updatedEvent: PowerOutageEvent): Promise<PowerOutageEvent | null> => {
  try {
    const currentEvents = await getAllEvents();
    const eventIndex = currentEvents.findIndex(event => event.id === updatedEvent.id);
    if (eventIndex === -1) {
      console.warn("Evento não encontrado para atualização:", updatedEvent.id);
      return null; // Evento não encontrado
    }
    const updatedEvents = [...currentEvents];
    updatedEvents[eventIndex] = updatedEvent;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
    return updatedEvent;
  } catch (e) {
    console.error("Erro ao atualizar evento no AsyncStorage", e);
    return null;
  }
};

// Deletar um evento por ID
export const deleteEventById = async (id: string): Promise<boolean> => {
  try {
    const currentEvents = await getAllEvents();
    const updatedEvents = currentEvents.filter(event => event.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
    return true;
  } catch (e) {
    console.error("Erro ao deletar evento do AsyncStorage", e);
    return false;
  }
};