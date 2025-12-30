import { Link } from 'react-router-dom';
import { Event } from '@/types/event';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
  index?: number;
}

export const EventCard = ({ event, index = 0 }: EventCardProps) => {
  const spotsLeft = event.capacity - event.attendees.length;
  const isFull = spotsLeft <= 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/event/${event.id}`}>
        <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-medium hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
            {event.image ? (
              <img 
                src={event.image} 
                alt={event.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <CalendarDays className="h-16 w-16 text-primary/30" />
              </div>
            )}
            <div className="absolute left-3 top-3">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {event.category}
              </Badge>
            </div>
            {isFull && (
              <div className="absolute right-3 top-3">
                <Badge variant="destructive">Sold Out</Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="mb-2 font-display text-lg font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary">
              {event.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span>{formatDate(event.date)} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {isFull ? (
                    <span className="text-destructive font-medium">No spots left</span>
                  ) : (
                    <>{spotsLeft} of {event.capacity} spots left</>
                  )}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};
