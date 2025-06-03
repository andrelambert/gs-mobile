export interface PowerOutageEvent {
  id: string;
  location: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'resolved';
  cause?: string;
  damages?: string;
  createdAt: string;
}