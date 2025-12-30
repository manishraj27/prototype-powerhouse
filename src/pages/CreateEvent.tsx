import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Users, Clock, Image, ArrowLeft, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';

const categories = ['Technology', 'Networking', 'Workshop', 'Design', 'Music', 'Sports', 'Art', 'Other'];

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addEvent } = useEvents();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error('Please login to create an event');
      navigate('/login');
      return;
    }
    if (!title || !description || !date || !time || !location || !capacity || !category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      addEvent({
        title,
        description,
        date,
        time,
        location,
        capacity: parseInt(capacity),
        category,
        image,
      }, user.id, user.name);
      
      toast.success('Event created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-bold">Please login first</h2>
            <p className="mb-4 text-muted-foreground">You need to be logged in to create events</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8">
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
            Back
          </button>

          <div className="mb-8">
            <h1 className="mb-2 font-display text-3xl font-bold">Create New Event</h1>
            <p className="text-muted-foreground">Fill in the details below to create your event</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Event Image</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted"
              >
                {image ? (
                  <img src={image} alt="Event" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Image className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="title"
                  placeholder="Give your event a catchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Date & Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Where will the event take place?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Capacity & Category */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    placeholder="Max attendees"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </form>
        </motion.div>
      </main>
    </>
  );
};

export default CreateEvent;
