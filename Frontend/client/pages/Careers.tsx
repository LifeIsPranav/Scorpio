import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Globe, Heart, MessageCircle, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Careers() {
  const openWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
    const message = "Hi! I'm interested in career opportunities at Scorpio.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const benefits = [
    {
      icon: Users,
      title: "Great Team",
      description:
        "Work with passionate and talented individuals who share your vision.",
    },
    {
      icon: Globe,
      title: "Remote Friendly",
      description:
        "Flexible work arrangements with opportunities for remote work.",
    },
    {
      icon: Heart,
      title: "Work-Life Balance",
      description:
        "We believe in maintaining a healthy balance between work and personal life.",
    },
    {
      icon: Trophy,
      title: "Growth Opportunities",
      description:
        "Continuous learning and development opportunities to advance your career.",
    },
  ];

  const openPositions = [
    {
      title: "Customer Success Manager",
      type: "Full-time",
      location: "Remote",
      description:
        "Help our customers succeed by providing exceptional support and building relationships.",
    },
    {
      title: "Product Curator",
      type: "Part-time",
      location: "Hybrid",
      description:
        "Research and select premium products that align with our brand values.",
    },
    {
      title: "Social Media Specialist",
      type: "Contract",
      location: "Remote",
      description:
        "Create engaging content and manage our social media presence across platforms.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Be part of a mission to revolutionize premium shopping through
            personalized service and exceptional products.
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Why Scorpio?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're building something special, and we want passionate people to
              join us on this journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
            <p className="text-xl text-muted-foreground">
              Currently looking for talented individuals to join our team.
            </p>
          </div>

          <div className="grid gap-6">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold">
                        {position.title}
                      </h3>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                        {position.type}
                      </span>
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                        {position.location}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      {position.description}
                    </p>
                  </div>
                  <Button
                    onClick={openWhatsApp}
                    className="bg-foreground hover:bg-foreground/90 rounded-full"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* No Perfect Match */}
          <div className="text-center mt-16 p-8 bg-card rounded-2xl border border-border">
            <h3 className="text-xl font-semibold mb-4">
              Don't See a Perfect Match?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for exceptional talent. Send us your resume
              and let us know how you'd like to contribute.
            </p>
            <Button
              onClick={openWhatsApp}
              variant="outline"
              className="rounded-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Get in Touch
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
