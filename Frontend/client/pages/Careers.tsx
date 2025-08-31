import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

import { 
  Globe, 
  Heart, 
  MessageCircle, 
  Trophy, 
  Users, 
  GraduationCap,
  Building,
  Shirt,
  Target,
  Award,
  Zap
} from "lucide-react";

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
      title: "Innovation-Driven Team",
      description:
        "Work with passionate individuals from IIT ecosystem who are building the future of professional clothing.",
    },
    {
      icon: GraduationCap,
      title: "Campus Connect",
      description:
        "Be part of a movement that directly impacts students across IITs and leading colleges in India.",
    },
    {
      icon: Heart,
      title: "Purpose-Driven Work",
      description:
        "Help students, professionals, and institutions make their first impression count through quality clothing.",
    },
    {
      icon: Trophy,
      title: "Growth & Impact",
      description:
        "Scale a brand that's backed by IITNxt and recognized across educational institutions and corporates.",
    },
    {
      icon: Globe,
      title: "Flexible Environment",
      description:
        "Remote-friendly culture with opportunities to engage directly with college campuses and corporate clients.",
    },
    {
      icon: Zap,
      title: "Sustainability Focus",
      description:
        "Contribute to sustainable fashion practices while building a profitable and impactful business.",
    },
  ];

  const openPositions = [
    {
      title: "Campus Relations Manager",
      type: "Full-time",
      location: "On-field + Remote",
      description:
        "Build relationships with IITs and colleges, organize SuitUp campus programs, and drive student engagement.",
    },
    {
      title: "Product Design Specialist",
      type: "Full-time",
      location: "Hybrid",
      description:
        "Design formal wear, uniforms, and professional kits that meet the needs of students and corporates.",
    },
    {
      title: "Business Development Executive",
      type: "Full-time",
      location: "Remote + Travel",
      description:
        "Expand Scorpio's reach to new institutions, companies, and enterprise clients across India.",
    },
    {
      title: "Digital Marketing Specialist",
      type: "Contract",
      location: "Remote",
      description:
        "Create compelling campaigns for youth-focused initiatives like SuitUp and build brand presence across digital platforms.",
    },
    {
      title: "Operations Coordinator",
      type: "Full-time",
      location: "Hybrid",
      description:
        "Manage supply chain, quality control, and logistics for custom uniforms and professional wear orders.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our <span className="gradient-text">Movement</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Be part of Scorpio × Indian Innovators of Technology for Next Gen
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Help us empower students, professionals, and institutions through premium yet affordable 
            clothing solutions that make first impressions count.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Scorpio is more than a clothing brand; it's a movement for identity and confidence. 
              Backed by Indian Innovators of Technology for Next Gen, we're building something 
              that makes a real impact on how people present themselves professionally.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Student Impact</h3>
              <p className="text-muted-foreground">
                Help students across IITs and colleges suit up for placements, internships, and conferences with confidence.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Institutional Partnerships</h3>
              <p className="text-muted-foreground">
                Build meaningful relationships with educational institutions and corporations for uniform and branding solutions.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality & Innovation</h3>
              <p className="text-muted-foreground">
                Create sustainable, comfortable, and stylish professional wear that balances affordability with premium quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Why Join Scorpio?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be part of a trusted brand backed by IITNxt, making real impact in the lives of students and professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
            <p className="text-xl text-muted-foreground">
              Join us in building the future of professional clothing and personal branding.
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
              We're always looking for exceptional talent who share our vision of empowering 
              people through professional clothing. Send us your profile and let us know how 
              you'd like to contribute to Scorpio's mission.
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
