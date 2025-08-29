import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Heart, MessageCircle, Shield, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  const openWhatsApp = () => {
    const phoneNumber = "+1234567890";
    const message = "Hi! I'd like to know more about Scorpio.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Scorpio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're passionate about bringing you the finest selection of premium
            products, with personalized service that puts your needs first.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                Scorpio was born from a simple belief: shopping should be
                personal, premium, and effortless. We curate each product with
                care, ensuring quality and style in every selection.
              </p>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Through direct WhatsApp communication, we provide personalized
                service that traditional e-commerce can't match. Every interaction
                is handled by our dedicated team – just genuine human
                connection.
              </p>
              <Button
                onClick={openWhatsApp}
                className="bg-foreground hover:bg-foreground/90 rounded-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Us
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center"
                alt="Our team"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything we do is guided by these core principles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: "Quality First",
                description:
                  "Every product is carefully selected for superior quality and craftsmanship.",
              },
              {
                icon: Users,
                title: "Personal Service",
                description:
                  "Direct communication means personalized attention for every customer.",
              },
              {
                icon: Shield,
                title: "Trust & Security",
                description:
                  "Your satisfaction and security are our top priorities in every interaction.",
              },
              {
                icon: Heart,
                title: "Passion",
                description:
                  "We're passionate about connecting you with products you'll truly love.",
              },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
