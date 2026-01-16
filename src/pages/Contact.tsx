import { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will contact you shortly.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, subject: value });
  };

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Header */}
      <section className="bg-black text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300">Have questions? Reach out to us directly and we’ll respond promptly.</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl border-muted">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Your name"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="john@example.com"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="+27 12 345 6789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select onValueChange={handleSelectChange} value={formData.subject} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quote">Request a Quote</SelectItem>
                      <SelectItem value="order">Place an Order</SelectItem>
                      <SelectItem value="delivery">Delivery Inquiry</SelectItem>
                      <SelectItem value="product">Product Information</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows={5} 
                    placeholder="How can we help you?"
                    required 
                  />
                </div>

                <Button type="submit" className="w-full font-bold text-lg h-12">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          {/* Business Info */}
          <div className="space-y-6">
            <div className="grid gap-6">
              <Card className="shadow-md border-none bg-gray-50 hover:bg-white transition-colors">
                <CardContent className="flex items-center gap-6 p-6">
                  <div className="p-4 bg-primary/20 rounded-full text-primary-foreground shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground text-lg">+27 13 170 5511</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-none bg-gray-50 hover:bg-white transition-colors">
                <CardContent className="flex items-center gap-6 p-6">
                  <div className="p-4 bg-primary/20 rounded-full text-primary-foreground shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground text-lg">admin@toponemining.co.za</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-none bg-gray-50 hover:bg-white transition-colors">
                <CardContent className="flex items-center gap-6 p-6">
                  <div className="p-4 bg-primary/20 rounded-full text-primary-foreground shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Umkumaas+St+%26+Umlaas+St+Aerorand+Middelburg+1055"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                      >
                        N11 Keeromaspruit &amp; Middleburg,<br />Mpumalanga 1050
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Placeholder or Additional Info */}
            <Card className="overflow-hidden shadow-lg border-muted h-[300px] relative bg-gray-100 flex items-center justify-center">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.697079215467!2d29.4589!3d-25.7725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQ2JzIxLjAiUyAyOcKwMjcnMzIuMCJF!5e0!3m2!1sen!2sza!4v1620000000000!5m2!1sen!2sza" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0 }} 
                 allowFullScreen 
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
               />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
