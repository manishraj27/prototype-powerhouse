import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { EventGrid } from '@/components/events/EventGrid';
import { Header } from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { Plus, CalendarDays, Users } from 'lucide-react';

const Dashboard = () => {
  const { getUserEvents } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Please login first</h2>
            <p className="mb-4 text-muted-foreground">You need to be logged in to view your dashboard</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        </div>
      </>
    );
  }

  const { created, attending } = getUserEvents(user.id);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 font-display text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your events and RSVPs</p>
            </div>
            <Button onClick={() => navigate('/create')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                  <CalendarDays className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{created.length}</p>
                  <p className="text-sm text-muted-foreground">Events Created</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-accent">
                  <Users className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{attending.length}</p>
                  <p className="text-sm text-muted-foreground">Events Attending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="created" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="created" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                My Events ({created.length})
              </TabsTrigger>
              <TabsTrigger value="attending" className="gap-2">
                <Users className="h-4 w-4" />
                Attending ({attending.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="created">
              <EventGrid 
                events={created} 
                emptyMessage="You haven't created any events yet" 
              />
            </TabsContent>
            <TabsContent value="attending">
              <EventGrid 
                events={attending} 
                emptyMessage="You're not attending any events yet" 
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </>
  );
};

export default Dashboard;
