export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  attendees: string[];
  image: string;
  creatorId: string;
  creatorName: string;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type EventFormData = Omit<Event, 'id' | 'attendees' | 'creatorId' | 'creatorName'>;
