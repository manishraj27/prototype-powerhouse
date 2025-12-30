import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { EventGrid } from '@/components/events/EventGrid';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, Sparkles, CalendarDays, Users, Zap } from 'lucide-react';

const Index = () => {
  const { events } = useEvents();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Technology', 'Networking', 'Workshop', 'Design', 'Music', 'Sports', 'Art'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-muted">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container relative mx-auto px-4 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Mini Event Platform</span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover & Create
                <span className="text-gradient"> Amazing Events</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                Join a community of event enthusiasts. Create memorable experiences, 
                connect with like-minded people, and never miss out.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link to={isAuthenticated ? "/create" : "/signup"}>
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    {isAuthenticated ? 'Create Event' : 'Get Started Free'}
                  </Button>
                </Link>
                <a href="#events">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    Browse Events
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-16 grid max-w-2xl gap-8 sm:grid-cols-3"
            >
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{events.length}+</p>
                <p className="text-sm text-muted-foreground">Active Events</p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="rounded-lg bg-accent/10 p-3">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Community Members</p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-3xl font-bold">99%</p>
                <p className="text-sm text-muted-foreground">Happy Attendees</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="mb-2 font-display text-2xl font-bold sm:text-3xl">Upcoming Events</h2>
              <p className="text-muted-foreground">Discover events happening around you</p>
            </div>

            {/* Search & Filter */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <EventGrid events={filteredEvents} emptyMessage="No events match your search" />
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default Index;
