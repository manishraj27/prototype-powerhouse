import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, Clock, ArrowLeft, Edit, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, rsvpEvent, cancelRsvp, deleteEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();

  const event = getEventById(id || '');

  if (!event) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Event not found</h2>
            <Button onClick={() => navigate('/')}>Back to Events</Button>
          </div>
        </div>
      </>
    );
  }

  const isCreator = user?.id === event.creatorId;
  const hasRsvpd = user ? event.attendees.includes(user.id) : false;
  const spotsLeft = event.capacity - event.attendees.length;
  const isFull = spotsLeft <= 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleRsvp = () => {
    if (!isAuthenticated) {
      toast.error('Please login to RSVP');
      navigate('/login');
      return;
    }
    if (!user) return;

    const result = rsvpEvent(event.id, user.id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleCancelRsvp = () => {
    if (!user) return;
    cancelRsvp(event.id, user.id);
    toast.success('RSVP cancelled');
  };

  const handleDelete = () => {
    deleteEvent(event.id);
    toast.success('Event deleted');
    navigate('/');
  };

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </button>

          {/* Hero Image */}
          <div className="relative mb-8 h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 sm:h-80 lg:h-96">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <CalendarDays className="h-24 w-24 text-primary/30" />
              </div>
            )}
            <div className="absolute left-4 top-4">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-sm">
                {event.category}
              </Badge>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="mb-4 font-display text-3xl font-bold sm:text-4xl">{event.title}</h1>
              
              <div className="mb-6 flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="prose prose-neutral max-w-none">
                <h3 className="font-display text-xl font-semibold mb-3">About this event</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>

              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Hosted by</h3>
                <p className="text-muted-foreground">{event.creatorName}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-soft">
                {/* Capacity */}
                <div className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Capacity</span>
                    <span className="font-medium">{event.attendees.length} / {event.capacity}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full gradient-primary transition-all duration-500"
                      style={{ width: `${(event.attendees.length / event.capacity) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isFull ? (
                      <span className="text-destructive font-medium">Event is full</span>
                    ) : (
                      <>{spotsLeft} spots remaining</>
                    )}
                  </p>
                </div>

                {/* Actions */}
                {isCreator ? (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/edit/${event.id}`)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Event
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your event and remove all RSVPs.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ) : hasRsvpd ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-primary/10 p-3 text-center">
                      <p className="text-sm font-medium text-primary">You're attending!</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleCancelRsvp}>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Cancel RSVP
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleRsvp}
                    disabled={isFull}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isFull ? 'Event Full' : 'RSVP Now'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};

export default EventDetail;
