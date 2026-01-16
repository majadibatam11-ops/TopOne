import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { CheckCircle, Users, Truck, Shield, PhoneCall } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { getNotices, type Notice } from '../lib/noticeStore';
import { saveMessage } from '../lib/messageStore';
import heroImage from '../assets/sand truck.jpeg';
import sand from '../assets/sand.jpeg';
import sandG from '../assets/sand g.jpeg';
import sandgr from '../assets/sand gr.jpeg';
import sand1 from '../assets/sand 1.jpeg';
import truck from '../assets/sand machine.jpeg';
import machine from '../assets/sand machine.jpeg';
import machine2 from '../assets/sand truck 2.jpeg';
import blasterSand from '../assets/Blastaring .jpeg';
import stone19 from '../assets/-19.jpeg';

export function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locError, setLocError] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      const data = await getNotices();
      setNotices(data);
    };
    fetchNotices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!formData.name.trim()) nextErrors.name = 'Please enter your full name';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) nextErrors.email = 'Please enter a valid email address';
    if (!formData.subject) nextErrors.subject = 'Please select a subject';
    if (!formData.message.trim() || formData.message.trim().length < 10) nextErrors.message = 'Please provide at least 10 characters';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSending(true);

    try {
      const success = await saveMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      if (success) {
        // Send email alert
        try {
          const emailResponse = await fetch("https://formsubmit.co/ajax/admin@toponemining.co.za", {
            method: "POST",
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              subject: formData.subject,
              message: formData.message,
              _subject: `New Web Inquiry: ${formData.subject} from ${formData.name}`,
              _template: "table", // Use table template for better readability
              _captcha: "false" // Disable captcha for direct API calls
            })
          });
          
          if (!emailResponse.ok) {
            console.warn("Email alert might not have been sent. Status:", emailResponse.status);
          }
        } catch (err) {
          console.error("Failed to send email alert:", err);
        }

        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof typeof errors]) {
      const next = { ...errors };
      delete next[e.target.name as keyof typeof errors];
      setErrors(next);
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, subject: value });
  };

  const useMyLocation = () => {
    setLocError('');
    if (!navigator.geolocation) {
      setLocError('Location is not supported on this device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        setLocError(err.message || 'Unable to retrieve location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const mapSrc = userLocation
    ? `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}&output=embed`
    : 'https://www.google.com/maps?q=Top+One+Mining+Sands+N11+Keeromaspruit%2C+Middleburg%2C+Mpumalanga+1050&output=embed';

  const productPricing = [
    {
      name: 'Filling Sand',
      description: 'Economical sand for backfilling trenches and foundations, site leveling, and general earthworks. Compacts well to provide stable support.',
      price: 'R45/ton',
      image: sand
    },
    {
      name: '-19mm Stones',
      description: 'Ideal for concrete mixes, pathways, and drainage. Clean and durable aggregate.',
      price: 'R38/ton',
      image: stone19
    },
    {
      name: '-22mm Stones',
      description: 'Ideal for concrete mixes, drainage systems, and durable driveway surfaces.',
      price: 'R42/ton',
      image: sandG
    },
    {
      name: 'Red Sand',
      description: 'Versatile red building sand, perfect for general construction, bricklaying, and plastering.',
      price: 'R35/ton',
      image: sand
    },
    {
      name: 'G-material',
      description: 'High-quality granular material essential for road construction, sub-base layers, and reliable foundation support.',
      price: 'R48/ton',
      image: sandgr
    },
    {
      name: 'Blaster Sand',
      description: 'High-quality abrasive sand designed for efficient sandblasting, rust removal, and surface preparation.',
      price: 'R55/ton',
      image: blasterSand
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section id="home" className="relative w-full h-[80vh] overflow-hidden">
        <ImageWithFallback
          src={heroImage}
          alt="Sand mining construction site"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            TOPONE MINING SANDS
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl drop-shadow-md">
            TopOne Mining Sands — Powering Construction at the Core
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-8">
              <a href="#about">Learn More</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black font-bold text-lg px-8">
              <a href="tel:+27131705511">Get Quote</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 container mx-auto px-4 mt-8 md:mt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Products & Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Competitive pricing on premium materials. Contact us for bulk rates and delivery scheduling.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productPricing.map((item, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow border-none shadow-md group">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <div className="flex w-full justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-10 w-10 p-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        aria-label="Contact options"
                      >
                        <PhoneCall className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onSelect={() => { window.location.href = 'tel:+27131705511'; }}
                        className="flex items-center gap-2"
                      >
                        <PhoneCall className="h-4 w-4" />
                        <span>Call Us</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          const url = `https://wa.me/27131705511?text=${encodeURIComponent(`Hello, I would like to inquire about ${item.name}.`)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center gap-2"
                      >
                        <svg viewBox="0 0 32 32" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                          <path fill="currentColor" d="M26.37 22.97c-1.04 2.89-3.82 5.03-6.9 5.61-3.03.57-6.3-.23-8.75-2.15l-5.14 1.35 1.38-5.01c-2.06-2.61-2.84-6.2-2.01-9.45.82-3.19 3.26-5.88 6.35-7.01 3.06-1.12 6.63-.79 9.42.86 2.86 1.69 4.88 4.66 5.37 7.95.5 3.29-.45 6.73-2.72 9.85Zm-3.79-3.11c.2.33.2.76-.02 1.07-.41.58-1.03 1.29-1.7 1.39-.45.06-.99-.1-1.58-.49-1.22-.77-2.71-1.88-4.05-3.39-1.34-1.51-2.38-3.18-2.99-4.52-.24-.55-.32-1.07-.24-1.5.09-.47.52-1.1 1.02-1.54.31-.28.73-.33 1.09-.17.37.16.8.57 1.32 1.24.41.53.9 1.26 1.02 1.65.11.36.04.71-.18.97-.19.22-.43.5-.6.69-.18.2-.23.46-.14.7.08.22.3.59.73 1.09.42.5 1.18 1.19 1.83 1.63.43.29.74.35.94.29.22-.07.47-.28.76-.57.3-.29.64-.34.98-.21.35.14 1.09.52 1.65.94.53.39 1.03.82 1.16 1.05Z"/>
                        </svg>
                        <span>WhatsApp</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">Our Story</h1>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded over 5+ years ago, Premium Sands & Aggregates has been serving the construction industry with top-quality materials and exceptional service. What started as a small family business has grown into one of the region's most trusted suppliers of sand and aggregate materials.
                </p>
                <p>
                  Our commitment to quality, reliability, and customer satisfaction has been the cornerstone of our success. We work tirelessly to ensure that every load meets the highest standards and arrives on time, every time.
                </p>
                <p>
                  Today, we serve contractors, builders, landscapers, and homeowners across the region, delivering premium materials for projects of all sizes.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-xl transform rotate-3 scale-105" />
              <ImageWithFallback
                src={truck}
                alt="Our construction team"
                className="relative rounded-xl shadow-lg w-full object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            To provide the construction industry with the highest quality sand and aggregate materials, delivered with reliability and backed by unmatched customer service. We're committed to building lasting relationships with our clients through integrity, innovation, and excellence.
          </p>
        </div>
      </section>

      <section id="why" className="py-20 container mx-auto px-4 mt-8 md:mt-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: CheckCircle, title: "Quality Guaranteed", text: "All our materials are tested and certified to meet industry standards" },
            { icon: Truck, title: "Fast Delivery", text: "Modern fleet ensures timely delivery within 24 Hours to your job site" },
            { icon: Users, title: "Expert Team", text: "Knowledgeable staff ready to help with your project needs" },
            { icon: Shield, title: "Trusted Service", text: "5+ years of reliable service in the industry" }
          ].map((item, idx) => (
            <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-shadow text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="fleet" className="py-20 container mx-auto px-4 mt-8 md:mt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Fleet & Facilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our modern fleet of trucks and state-of-the-art facilities ensure we can handle orders of any size, delivered on your schedule.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <ImageWithFallback
            src={machine}
            alt="Our delivery trucks"
            className="rounded-xl shadow-md w-full h-[300px] object-cover hover:shadow-xl transition-shadow"
          />
          <ImageWithFallback
            src={machine2}
            alt="Our warehouse facility"
            className="rounded-xl shadow-md w-full h-[300px] object-cover hover:shadow-xl transition-shadow"
          />
        </div>
      </section>

      <section id="noticeboard" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Noticeboard</h2>
            <p className="text-muted-foreground text-lg">
              Important updates, announcements, and news from Top One Mining
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {notices.map((notice) => (
              <Card key={notice.id} className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${
                notice.type === 'important' ? 'border-l-red-500 bg-red-50/50' :
                notice.type === 'alert' ? 'border-l-orange-500 bg-orange-50/50' :
                notice.type === 'promo' ? 'border-l-green-500 bg-green-50/50' :
                'border-l-blue-500 bg-blue-50/50'
              }`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                      notice.type === 'important' ? 'bg-red-100 text-red-700' :
                      notice.type === 'alert' ? 'bg-orange-100 text-orange-700' :
                      notice.type === 'promo' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {notice.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{notice.date}</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{notice.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notice.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 container mx-auto px-4 mb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="shadow-xl border-muted">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted && (
                <div className="mb-6 rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3">
                  Thank you. Your message was sent successfully.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Full name"
                      required 
                      aria-invalid={!!errors.name}
                    />
                    <p className={`text-sm ${errors.name ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {errors.name || 'Please enter your legal name'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="name@company.com"
                      required 
                      aria-invalid={!!errors.email}
                    />
                    <p className={`text-sm ${errors.email ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {errors.email || 'We will reply to this address'}
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+27 13 170 5511"
                      pattern="^[+\\d][\\d\\s-]{6,}$"
                    />
                    <p className="text-sm text-muted-foreground">Optional, include country code</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={formData.subject} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote">Request a Quote</SelectItem>
                        <SelectItem value="delivery">Delivery Inquiry</SelectItem>
                        <SelectItem value="general">General Question</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className={`text-sm ${errors.subject ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {errors.subject || 'Tell us what the message is about'}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Project details, timeline and delivery location"
                    className="min-h-[120px]"
                    required 
                    aria-invalid={!!errors.message}
                  />
                  <div className="flex items-center justify-between">
                    <p className={`text-sm ${errors.message ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {errors.message || 'Please include relevant project details'}
                    </p>
                    <span className="text-xs text-muted-foreground">{formData.message.length}/2000</span>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card className="shadow-xl border-muted">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-muted-foreground">
                  <p>Phone: +27 13 170 5511</p>
                  <p>Email: admin@toponemining.co.za</p>
                  <p>Address: N11 Keeromaspruit, Middleburg, Mpumalanga 1050</p>
                  <p>Hours: Mon-Fri 7:00am–4:00pm, Sat 7:00am–1:00pm</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={useMyLocation} variant="secondary" className="font-semibold">
                    Use My Current Location
                  </Button>
                  {userLocation && (
                    <span className="text-sm text-muted-foreground">
                      Using your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </span>
                  )}
                </div>
                {locError && (
                  <p className="text-sm text-destructive">{locError}</p>
                )}
                <div className="rounded-lg overflow-hidden">
                  <iframe
                    title="Map"
                    src={mapSrc}
                    className="w-full h-[300px] border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
