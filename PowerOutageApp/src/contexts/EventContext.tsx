import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback, // Importe o useCallback
} from 'react';
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

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<PowerOutageEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoizando loadEvents (que é o nosso refreshEvents)
  const loadEvents = useCallback(async () => {
    console.log('EventContext: Chamando loadEvents'); // Para debug
    setLoading(true);
    try {
      const storedEvents = await eventStorage.getAllEvents();
      setEvents(storedEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos no Context:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências, pois eventStorage.getAllEvents é estável

  useEffect(() => {
    // Este useEffect agora depende da versão memoizada de loadEvents
    // e só será executado se loadEvents mudar (o que não acontecerá após a montagem inicial)
    loadEvents();
  }, [loadEvents]);

  const addEvent = useCallback(
    async (eventData: Omit<PowerOutageEvent, 'id' | 'timestampRegistro'>) => {
      console.log('EventContext: Chamando addEvent'); // Para debug
      const newEvent = await eventStorage.saveNewEvent(eventData);
      if (newEvent) {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        // Para consistência total, você poderia chamar loadEvents() aqui,
        // mas a atualização otimista acima geralmente funciona bem.
        // await loadEvents();
      }
    },
    [] // Nenhuma dependência de estado ou props do provider aqui
     // Se dependesse de 'loadEvents', por exemplo, ele seria adicionado aqui: [loadEvents]
  );

  const updateEvent = useCallback(
    async (updatedEventData: PowerOutageEvent) => {
      console.log('EventContext: Chamando updateEvent'); // Para debug
      const success = await eventStorage.updateEventById(updatedEventData);
      if (success) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEventData.id ? updatedEventData : event
          )
        );
        // await loadEvents(); // Opcional para recarregar tudo
      }
    },
    [] // Nenhuma dependência de estado ou props do provider aqui
  );

  const deleteEvent = useCallback(
    async (id: string) => {
      console.log('EventContext: Chamando deleteEvent para o ID:', id); // Para debug
      const success = await eventStorage.deleteEventById(id);
      if (success) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
        // await loadEvents(); // Opcional para recarregar tudo
      }
    },
    [] // Nenhuma dependência de estado ou props do provider aqui
  );

  // getEvent PRECISA ser recriada se 'events' mudar, para que os componentes
  // que a utilizam recebam a versão mais recente que opera sobre a lista 'events' atualizada.
  const getEvent = useCallback(
    (id: string): PowerOutageEvent | undefined => {
      return events.find((event) => event.id === id);
    },
    [events] // Dependência crucial: o array 'events'
  );

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent,
        getEvent,
        refreshEvents: loadEvents, // Passa a versão memoizada de loadEvents
      }}
    >
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