import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const openWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
    const message = "Hi! I'd like to get in touch with Scorpio.";
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
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to find your perfect product? We're here to help with
            personalized recommendations and dedicated support.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp Chat",
                description:
                  "Instant messaging for quick questions and personalized recommendations",
                action: "Start Chat",
                color: "bg-foreground hover:bg-foreground/90",
                onClick: openWhatsApp,
              },
              {
                icon: Phone,
                title: "Phone Support",
                description:
                  "Speak directly with our team for detailed product discussions",
                action: "Call Now",
                color: "bg-foreground hover:bg-foreground/90",
                onClick: () => window.open(`tel:${import.meta.env.VITE_PHONE_NUMBER}`),
              },
              {
                icon: Mail,
                title: "Email Us",
                description:
                  "Send detailed inquiries and get comprehensive responses",
                action: "Send Email",
                color: "bg-foreground hover:bg-foreground/90",
                onClick: () => window.open(`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`),
              },
            ].map((method, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{method.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {method.description}
                </p>
                <Button
                  onClick={method.onClick}
                  className={`${method.color} text-white rounded-full w-full`}
                >
                  {method.action}
                </Button>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="bg-muted/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Location",
                  info: `${import.meta.env.VITE_BUSINESS_ADDRESS_LINE1}\n${import.meta.env.VITE_BUSINESS_ADDRESS_LINE2}`,
                },
                {
                  icon: Clock,
                  title: "Business Hours",
                  info: `${import.meta.env.VITE_BUSINESS_HOURS_WEEKDAY}\n${import.meta.env.VITE_BUSINESS_HOURS_WEEKEND}`,
                },
                {
                  icon: Phone,
                  title: "Phone",
                  info: import.meta.env.VITE_PHONE_NUMBER,
                },
                {
                  icon: Mail,
                  title: "Email",
                  info: import.meta.env.VITE_CONTACT_EMAIL,
                },
              ].map((contact, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <contact.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{contact.title}</h3>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {contact.info}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
