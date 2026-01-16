import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CheckCircle, Users, Truck, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

import truck from '../assets/sand machine.jpeg';
import machine from '../assets/sand machine.jpeg';
import machine2 from '../assets/sand truck 2.jpeg';

export function About() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Company Story */}
      <section className="py-20 bg-gray-50">
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

      {/* Mission */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            To provide the construction industry with the highest quality sand and aggregate materials, delivered with reliability and backed by unmatched customer service. We're committed to building lasting relationships with our clients through integrity, innovation, and excellence.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: CheckCircle, title: "Quality Guaranteed", text: "All our materials are tested and certified to meet industry standards" },
            { icon: Truck, title: "Fast Delivery", text: "Modern fleet ensures timely delivery to your job site" },
            { icon: Users, title: "Expert Team", text: "Knowledgeable staff ready to help with your project needs" },
            { icon: Shield, title: "Trusted Service", text: "2+ years of reliable service in the industry" }
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

      {/* Fleet & Facilities */}
      <section className="container mx-auto px-4 pb-12">
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
    </div>
  );
}
