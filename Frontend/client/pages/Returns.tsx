import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RotateCcw, MessageCircle, Shield, Clock } from "lucide-react";

export default function Returns() {
  const openWhatsApp = () => {
    const phoneNumber = "+1234567890";
    const message = "Hi! I need help with a return or exchange.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const returnSteps = [
    {
      step: "1",
      title: "Contact Us",
      description:
        "Message us on WhatsApp within 7 days of delivery with your order details.",
    },
    {
      step: "2",
      title: "Get Approval",
      description:
        "We'll review your request and provide return instructions if approved.",
    },
    {
      step: "3",
      title: "Pack & Ship",
      description:
        "Pack the item securely in original packaging and ship using our provided label.",
    },
    {
      step: "4",
      title: "Refund/Exchange",
      description:
        "Once received and inspected, we'll process your refund or send your exchange.",
    },
  ];

  const returnPolicies = [
    {
      icon: Clock,
      title: "7-Day Return Window",
      description: "Returns must be initiated within 7 days of delivery.",
    },
    {
      icon: Shield,
      title: "Original Condition",
      description:
        "Items must be unused, undamaged, and in original packaging.",
    },
    {
      icon: RotateCcw,
      title: "Free Exchanges",
      description: "Size or color exchanges are free within the return period.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Returns & <span className="gradient-text">Exchanges</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We want you to love your purchase. If something isn't right, we'll
            make it right.
          </p>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">How to Return</h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to return or exchange your items.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={openWhatsApp}
              className="bg-foreground hover:bg-foreground/90 rounded-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Return Process
            </Button>
          </div>
        </div>
      </section>

      {/* Return Policies */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Return Policy</h2>
            <p className="text-xl text-muted-foreground">
              Key points about our return and exchange policy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {returnPolicies.map((policy, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <policy.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{policy.title}</h3>
                <p className="text-muted-foreground">{policy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-green-600">
                What We Accept
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  Items in original, unopened packaging
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  Products with all original tags and labels
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  Electronics in working condition with accessories
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  Fashion items unworn and unstained
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  Returns initiated within 7 days
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-red-600">
                What We Don't Accept
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Items damaged by misuse or wear
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">���</span>
                  Products without original packaging
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Personal care items for hygiene reasons
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Custom or personalized items
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">✗</span>
                  Returns after 7-day window
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center bg-muted/30 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-4">Refund Timeline</h3>
            <p className="text-muted-foreground mb-4">
              Refunds are processed within 5-7 business days after we receive
              and inspect your return. The amount will be credited back to your
              original payment method.
            </p>
            <p className="text-sm text-muted-foreground">
              For exchanges, we'll ship your new item as soon as we receive your
              return.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
