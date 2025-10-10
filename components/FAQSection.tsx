import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  export const FAQSection = () => {
    const faqs = [
      {
        question: 'Are lab-grown diamonds truly different?',
        answer: 'Lab-grown diamonds have the same crystal structure and visual properties as natural diamonds; the key differences are origin and price. Both can be certified by the same grading institutes and are optically, chemically, and physically identical.'
      },
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all purchases. If you\'re not completely satisfied with your jewellery, you can return it within 30 days for a full refund, provided it\'s in its original condition.'
      },
      {
        question: 'Do you offer ring sizing services?',
        answer: 'Yes, we provide complimentary ring sizing within the first 30 days of purchase. Our expert jewellers ensure the perfect fit for your comfort and security.'
      },
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping typically takes 3-5 business days within the UK. Express shipping (1-2 business days) is available for urgent orders. All shipments are fully insured and require signature confirmation.'
      },
      {
        question: 'Are your diamonds certified?',
        answer: 'Yes, all our diamonds come with certification from reputable grading institutes such as GIA, AGS, or equivalent. Each certificate details the diamond\'s cut, colour, clarity, and carat weight.'
      },
      {
        question: 'How should I care for my diamond jewellery?',
        answer: 'Clean your diamonds regularly with warm soapy water and a soft brush. Avoid harsh chemicals and store pieces separately to prevent scratching. We recommend professional cleaning every 6 months.'
      },
      {
        question: 'Do you offer custom designs?',
        answer: 'Absolutely! Our design team works with you to create bespoke pieces that reflect your personal style. Custom orders typically take 4-6 weeks from design approval to completion.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, bank transfers, and offer financing options for qualifying purchases. All transactions are processed securely with 256-bit SSL encryption.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Your privacy and security are our top priorities. We use industry-standard encryption and never share your personal information with third parties. All data is stored securely and processed in compliance with GDPR.'
      }
    ];
  
    return (
      <section className="py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our diamonds and services
            </p>
          </div>
  
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={`faq-${index}`}
                  value={`faq-${index}`}
                  className="bg-card rounded-lg shadow-sm border border-border px-6"
                >
                  <AccordionTrigger className="text-left py-6 hover:no-underline">
                    <span className="font-semibold text-foreground">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  };