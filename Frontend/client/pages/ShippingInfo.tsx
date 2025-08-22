import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Truck, Clock, MapPin, Shield } from "lucide-react";

export default function ShippingInfo() {
  const shippingOptions = [
    {
      icon: Truck,
      title: "Standard Shipping",
      time: "5-7 business days",
      price: "Free on orders over ₹999",
      description: "Reliable delivery through our trusted shipping partners.",
    },
    {
      icon: Clock,
      title: "Express Shipping",
      time: "2-3 business days",
      price: "₹199",
      description: "Faster delivery for when you need your products quickly.",
    },
    {
      icon: MapPin,
      title: "Same-Day Delivery",
      time: "Within 24 hours",
      price: "₹299",
      description: "Available in select cities for urgent orders.",
    },
  ];

  const shippingZones = [
    {
      zone: "Zone 1",
      areas: "Metro Cities",
      time: "2-3 days",
      price: "Free on orders ₹999+",
    },
    {
      zone: "Zone 2",
      areas: "Tier 1 Cities",
      time: "3-5 days",
      price: "Free on orders ₹999+",
    },
    {
      zone: "Zone 3",
      areas: "Tier 2/3 Cities",
      time: "5-7 days",
      price: "Free on orders ₹999+",
    },
    {
      zone: "Zone 4",
      areas: "Remote Areas",
      time: "7-10 days",
      price: "₹99 shipping fee",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Shipping <span className="gradient-text">Information</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We deliver your premium products safely and efficiently across the
            country.
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Shipping Options</h2>
            <p className="text-xl text-muted-foreground">
              Choose the delivery option that works best for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <option.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-2xl font-bold text-primary mb-2">
                  {option.time}
                </p>
                <p className="text-lg font-medium mb-4">{option.price}</p>
                <p className="text-muted-foreground">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Shipping Zones</h2>
            <p className="text-xl text-muted-foreground">
              Delivery times and charges based on your location.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full bg-card">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Zone</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Coverage Areas
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Delivery Time
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Shipping Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map((zone, index) => (
                  <tr key={index} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{zone.zone}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {zone.areas}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {zone.time}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {zone.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Important Notes</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Order Processing
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Orders are processed within 24 hours of confirmation
                  </li>
                  <li>
                    • Weekend orders are processed on the next business day
                  </li>
                  <li>• You'll receive tracking information via WhatsApp</li>
                  <li>
                    • Estimated delivery times exclude order processing time
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Delivery Guidelines
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• Someone must be available to receive the package</li>
                  <li>• Valid ID required for high-value deliveries</li>
                  <li>• Packages are insured against damage or loss</li>
                  <li>• Contact us immediately for any delivery issues</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
