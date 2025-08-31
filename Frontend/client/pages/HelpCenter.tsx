import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { HelpCircle, Mail, MessageCircle, Phone, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const openWhatsApp = () => {
    const phoneNumber = import.meta.env.VITE_WHATSAPP_PHONE;
    const message = "Hi! I need help with something.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const helpCategories = [
    {
      title: "Orders & Payment",
      description:
        "Questions about placing orders, payment methods, and order status",
      topics: [
        "How to place an order",
        "Payment options",
        "Order tracking",
        "Order modifications",
      ],
    },
    {
      title: "Shipping & Delivery",
      description:
        "Information about shipping options, delivery times, and tracking",
      topics: [
        "Shipping costs",
        "Delivery times",
        "Tracking packages",
        "Delivery issues",
      ],
    },
    {
      title: "Returns & Exchanges",
      description: "How to return or exchange items, refund process",
      topics: [
        "Return policy",
        "Exchange process",
        "Refund timeline",
        "Return shipping",
      ],
    },
    {
      title: "Product Information",
      description:
        "Details about products, sizing, availability, and specifications",
      topics: [
        "Size guides",
        "Product care",
        "Availability",
        "Product specifications",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, click on items you like, and contact us via WhatsApp with your selection. We'll guide you through the ordering process personally.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI payments, net banking, and cash on delivery for select locations.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days, express shipping takes 2-3 days, and same-day delivery is available in select cities.",
    },
    {
      question: "Can I return an item?",
      answer:
        "Yes, you can return items within 7 days of delivery if they're in original condition with all tags and packaging intact.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, we'll send you tracking information via WhatsApp. You can also contact us anytime for updates.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only ship within India. We're working on expanding to international markets in the future.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "The fastest way is through WhatsApp. You can also email us or call during business hours for immediate assistance.",
    },
    {
      question: "Are your products authentic?",
      answer:
        "Absolutely! We only source authentic products directly from authorized suppliers and manufacturers.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Help <span className="gradient-text">Center</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find answers to your questions or get in touch with our support
            team.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-lg"
            />
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Get Help Fast</h2>
            <p className="text-xl text-muted-foreground">
              Choose the best way to reach us for your specific need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">WhatsApp Support</h3>
              <p className="text-muted-foreground mb-6">
                Get instant help through our WhatsApp chat. Perfect for quick
                questions and order assistance.
              </p>
              <Button
                onClick={openWhatsApp}
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full"
              >
                Chat Now
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Phone Support</h3>
              <p className="text-muted-foreground mb-6">
                Speak directly with our team for detailed assistance and complex
                queries.
              </p>
              <Button
                onClick={() => window.open(`tel:${import.meta.env.VITE_WHATSAPP_PHONE}`)}
                // variant="outline"
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full"
              >
                Call Us
              </Button>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Email Support</h3>
              <p className="text-muted-foreground mb-6">
                Send detailed inquiries and get comprehensive responses via
                email.
              </p>
              <Button
                onClick={() => window.open("mailto:help@scorpio.com")}
                // variant="outline"
                className="bg-foreground hover:bg-foreground/90 text-background rounded-full"
              >
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Browse by Category</h2>
            <p className="text-xl text-muted-foreground">
              Find answers organized by topic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border"
              >
                <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {category.topics.map((topic, topicIndex) => (
                    <Badge
                      key={topicIndex}
                      variant="secondary"
                      className="text-xs"
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Common questions and answers to help you quickly.
            </p>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <HelpCircle
                    className={`w-5 h-5 transition-transform ${openFAQ === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-8 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No FAQs found matching "{searchQuery}". Try a different search
                term or contact us directly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Can't find what you're looking for? Our support team is always ready
            to help.
          </p>
          <Button
            onClick={openWhatsApp}
            className="bg-foreground hover:bg-foreground/90 text-background rounded-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
