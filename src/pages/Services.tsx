import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Truck, Clock, Percent } from 'lucide-react';
import sand from '../assets/sand.jpeg';
import sand1 from '../assets/sand 1.jpeg';
import sandg from '../assets/sand g.jpeg';
import sandgr from '../assets/sand gr.jpeg';

const products = [
  {
    name: 'River Sand',
    description: 'Premium quality river sand, perfect for concrete mixing, masonry work, and plastering. Clean, washed, and ready to use.',
    features: ['Washed & Screened', 'Multiple Grades', 'Bulk Available'],
    price: 'From R45/ton',
    image: sand
  },
  {
    name: 'Crushed Stone',
    description: 'High-quality crushed stone in various sizes. Ideal for road base, drainage, and concrete aggregate.',
    features: ['3/4" to 1.5" sizes', 'Clean & Graded', 'Durable'],
    price: 'From R38/ton',
    image: sand1
  },
  {
    name: 'Gravel Mix',
    description: 'Versatile gravel mix suitable for driveways, pathways, and landscaping projects.',
    features: ['Mixed Sizes', 'Well Compacted', 'Drainage Optimized'],
    price: 'From R42/ton',
    image: sandg
  },
  {
    name: 'Fill Sand',
    description: 'Economical fill sand for large-scale earthwork and foundation projects.',
    features: ['Bulk Orders', 'Fast Delivery', 'Cost Effective'],
    price: 'From R35/ton',
    image: sand
  },
  {
    name: 'Masonry Sand',
    description: 'Fine-grade sand specifically for brick laying, block work, and mortar applications.',
    features: ['Fine Texture', 'Consistent Quality', 'Premium Grade'],
    price: 'From R48/ton',
    image: sandgr
  },
  {
    name: 'Decorative Stone',
    description: 'Beautiful decorative aggregates for landscaping and aesthetic applications.',
    features: ['Various Colors', 'Multiple Sizes', 'Premium Quality'],
    price: 'From R55/ton',
    image: sandg
  }
];

export function Services() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="bg-black text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Our Premium Construction Materials</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">High-quality sands, aggregates, and stones for all your building needs</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow border-none shadow-md group">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-medium">Available for bulk delivery</p>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <Badge variant="secondary" className="font-bold text-nowrap">{product.price}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <CardDescription className="text-base leading-relaxed">{product.description}</CardDescription>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm font-medium text-gray-700">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full font-bold text-lg h-12">Request Quote</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-none shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Same-Day Delivery</h3>
                <p className="text-muted-foreground">Order before noon for same-day delivery within our service area</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-none shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Percent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Bulk Discounts</h3>
                <p className="text-muted-foreground">Special pricing available for large construction projects and contractors</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 border-none shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Reliable Transport</h3>
                <p className="text-muted-foreground">Our fleet ensures your materials arrive safely and on time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
