import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { MessageCircle, Ruler, Shirt, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SizeGuide() {
  const openWhatsApp = () => {
    const phoneNumber = "+1234567890";
    const message = "Hi! I need help with sizing for a product.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const clothingSizes = {
    men: [
      { size: "S", chest: "36-38", waist: "30-32", length: "27" },
      { size: "M", chest: "38-40", waist: "32-34", length: "28" },
      { size: "L", chest: "40-42", waist: "34-36", length: "29" },
      { size: "XL", chest: "42-44", waist: "36-38", length: "30" },
      { size: "XXL", chest: "44-46", waist: "38-40", length: "31" },
    ],
    women: [
      { size: "XS", bust: "32-34", waist: "24-26", hips: "34-36" },
      { size: "S", bust: "34-36", waist: "26-28", hips: "36-38" },
      { size: "M", bust: "36-38", waist: "28-30", hips: "38-40" },
      { size: "L", bust: "38-40", waist: "30-32", hips: "40-42" },
      { size: "XL", bust: "40-42", waist: "32-34", hips: "42-44" },
    ],
  };

  const shoeSizes = [
    { us: "6", uk: "5.5", eu: "39", cm: "24.5" },
    { us: "6.5", uk: "6", eu: "39.5", cm: "25" },
    { us: "7", uk: "6.5", eu: "40", cm: "25.5" },
    { us: "7.5", uk: "7", eu: "40.5", cm: "26" },
    { us: "8", uk: "7.5", eu: "41", cm: "26.5" },
    { us: "8.5", uk: "8", eu: "42", cm: "27" },
    { us: "9", uk: "8.5", eu: "42.5", cm: "27.5" },
    { us: "9.5", uk: "9", eu: "43", cm: "28" },
    { us: "10", uk: "9.5", eu: "44", cm: "28.5" },
    { us: "10.5", uk: "10", eu: "44.5", cm: "29" },
  ];

  const measurementTips = [
    {
      icon: User,
      title: "Chest/Bust",
      description:
        "Measure around the fullest part of your chest, keeping the tape horizontal.",
    },
    {
      icon: Ruler,
      title: "Waist",
      description:
        "Measure around your natural waistline, typically the narrowest part of your torso.",
    },
    {
      icon: Shirt,
      title: "Length",
      description:
        "For tops, measure from the highest point of the shoulder to the desired hem length.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Size <span className="gradient-text">Guide</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find your perfect fit with our comprehensive sizing charts and
            measurement guide.
          </p>
        </div>
      </section>

      {/* Measurement Tips */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">How to Measure</h2>
            <p className="text-xl text-muted-foreground">
              Follow these tips for accurate measurements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {measurementTips.map((tip, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 border border-border text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <tip.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{tip.title}</h3>
                <p className="text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-muted/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-muted-foreground text-sm">
                <strong>Pro Tip:</strong> Use a flexible measuring tape and have
                someone help you for the most accurate measurements. Measure
                over thin, well-fitting undergarments for clothing sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Charts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Size Charts</h2>
            <p className="text-xl text-muted-foreground">
              Visual size guides for all our clothing items.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* T-shirt Size Chart */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-center">
                T-shirt Size Chart
              </h3>
              <div className="flex justify-center">
                <img
                  src="/TshirtSizeChart.png"
                  alt="T-shirt Size Chart"
                  className="max-w-full h-auto rounded-lg border border-border"
                  onLoad={(e) => {
                    console.log('T-shirt image loaded successfully');
                  }}
                  onError={(e) => {
                    console.error('Failed to load T-shirt image');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Sweatshirt Size Chart */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Sweatshirt Size Chart
              </h3>
              <div className="flex justify-center">
                <img
                  src="/sweatShirtSize.png"
                  alt="Sweatshirt Size Chart"
                  className="max-w-full h-auto rounded-lg border border-border"
                  onLoad={(e) => {
                    console.log('Sweatshirt image loaded successfully');
                  }}
                  onError={(e) => {
                    console.error('Failed to load Sweatshirt image');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Pant Size Chart */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Pant Size Guide
              </h3>
              <div className="flex justify-center">
                <img
                  src="/PantSizeGuide.webp"
                  alt="Pant Size Guide"
                  className="max-w-full h-auto rounded-lg border border-border"
                  onLoad={(e) => {
                    console.log('Pant image loaded successfully');
                  }}
                  onError={(e) => {
                    console.error('Failed to load Pant image');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Blazer Size Chart */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-semibold mb-6 text-center">
                Blazer Size Guide
              </h3>
              <div className="flex justify-center">
                <img
                  src="/BlazerSizeGuide.webp"
                  alt="Blazer Size Guide"
                  className="max-w-full h-auto rounded-lg border border-border"
                  onLoad={(e) => {
                    console.log('Blazer image loaded successfully');
                  }}
                  onError={(e) => {
                    console.error('Failed to load Blazer image');
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-muted/30 rounded-2xl p-6 max-w-3xl mx-auto">
              <p className="text-muted-foreground text-sm">
                <strong>Note:</strong> These size charts are specific to our clothing items. 
                For other products or if you're between sizes, we recommend contacting us for personalized sizing advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clothing Sizes */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Clothing Sizes</h2>
            <p className="text-xl text-muted-foreground">
              All measurements are in inches.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Men's Sizes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">
                Men's Clothing
              </h3>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full bg-card">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Chest
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Waist
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Length
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clothingSizes.men.map((size, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{size.size}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {size.chest}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {size.waist}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {size.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women's Sizes */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-center">
                Women's Clothing
              </h3>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full bg-card">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Bust
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Waist
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Hips
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clothingSizes.women.map((size, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{size.size}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {size.bust}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {size.waist}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {size.hips}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shoe Sizes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Shoe Sizes</h2>
            <p className="text-xl text-muted-foreground">
              International shoe size conversion chart.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full bg-card">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">US</th>
                    <th className="px-6 py-4 text-left font-semibold">UK</th>
                    <th className="px-6 py-4 text-left font-semibold">EU</th>
                    <th className="px-6 py-4 text-left font-semibold">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {shoeSizes.map((size, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="px-6 py-4 font-medium">{size.us}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {size.uk}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {size.eu}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {size.cm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our team is here to help you find the perfect fit. Send us your
            measurements and we'll recommend the best size for any product.
          </p>
          <Button
            onClick={openWhatsApp}
            className="bg-foreground hover:bg-foreground/90 rounded-full"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Get Sizing Help
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
