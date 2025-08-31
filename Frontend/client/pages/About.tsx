import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

import { 
  Heart, 
  MessageCircle, 
  Shield, 
  Star, 
  Users, 
  Shirt,
  Award,
  Target,
  Building,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Zap
} from "lucide-react";

export default function About() {
  const openWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
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
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            An initiative under Indian Innovators of Technology for Next Gen (IITNxt)
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Empowering students, professionals, and institutions with premium yet affordable 
            clothing, uniforms, and personal branding solutions.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Students</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We help youth suit up with confidence for placements, internships, conferences, 
                case competitions, and interviews. A well-tailored suit or formal kit makes the 
                first impression truly count.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Institutions</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We partner with IITs, colleges, and schools to design and deliver uniforms and 
                formal kits that reflect the identity of the institution while providing students 
                with a professional edge.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">For Organizations</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                From corporate offices to hotels and hospitals, we create professional uniforms 
                that strengthen brand presence and ensure comfort for daily wear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Portfolio */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Portfolio</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive clothing solutions for every professional need
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shirt,
                title: "Formal Wear",
                description: "Tailored suits, blazers, shirts, and ties for professional excellence.",
              },
              {
                icon: Users,
                title: "Professional Kits",
                description: "Uniforms for companies, hotels, hospitals, schools, and colleges.",
              },
              {
                icon: Target,
                title: "Smart Casuals",
                description: "Polo T-shirts, round-necks, hoodies, and sweatshirts for versatile style.",
              },
              {
                icon: Award,
                title: "Accessories",
                description: "Belts, socks, perfumes, and ties that complete the professional look.",
              },
            ].map((product, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-card border border-border">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <product.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Designed for Success</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We believe that clothing is not just about fabric – it is about identity, presence, and impact. 
              Every product we design blends style, comfort, and confidence so that whether you are a student 
              stepping into your first interview, a professor representing your institution at a conference, 
              or a company building a recognizable professional identity, you always look and feel your best.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Scorpio */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Why Choose Scorpio?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Backed by IITNxt",
                description: "Co-branded with Indian Innovators of Technology for Next Gen – bringing trust, credibility, and innovation.",
              },
              {
                icon: Star,
                title: "Wide Range",
                description: "From premium hand-stitched suits to budget-friendly kits for everyday professional needs.",
              },
              {
                icon: Target,
                title: "Customization at Scale",
                description: "Personalized fittings, embroidered logos, team branding, and special packaging tailored to your requirements.",
              },
              {
                icon: Heart,
                title: "Affordable Pricing",
                description: "Solutions that fit every pocket, ranging from ₹3,700 to ₹30,000, without compromising on quality.",
              },
              {
                icon: Zap,
                title: "Sustainability First",
                description: "Eco-friendly dyes, high-quality tested fabrics, and long-lasting designs that reduce waste.",
              },
              {
                icon: CheckCircle,
                title: "Comfort Meets Style",
                description: "All our clothing balances functionality with elegance, ensuring you look good and feel confident.",
              },
            ].map((value, index) => (
              <div key={index} className="text-center p-6">
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

      {/* SuitUp Program */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">SuitUp with Scorpio</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our exclusive campus program bringing professional clothing directly to IITs and leading colleges across India.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">₹3,500 - ₹30,000</div>
                <p className="text-muted-foreground">Affordable price ranges to suit every budget</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">On-Campus</div>
                <p className="text-muted-foreground">Campus stalls for on-spot measurements and fittings</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">Custom-Fit</div>
                <p className="text-muted-foreground">For individuals, group uniforms, or team branding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make Your First Impression Count?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            With Scorpio, every outfit is more than just clothing – it is a statement of who you are and who you aspire to be.
          </p>
          <Button
            onClick={openWhatsApp}
            size="lg"
            className="bg-foreground hover:bg-foreground/90 text-background rounded-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Get Started with Scorpio
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}