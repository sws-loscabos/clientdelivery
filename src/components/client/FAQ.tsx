
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const faqs = [
    {
      id: 'item-1',
      category: 'Project Timeline',
      question: 'How long will my project take to complete?',
      answer: 'Project timelines vary depending on scope and complexity. Website redesigns typically take 6-8 weeks, while brand identity projects take 4-6 weeks. Your specific timeline is outlined in your project contract and can be viewed in the documents section.'
    },
    {
      id: 'item-2',
      category: 'Design Process',
      question: 'How many revisions are included in my package?',
      answer: 'Your package includes 3 rounds of revisions for each major deliverable. Additional revisions can be requested and will be billed at our standard hourly rate. We encourage detailed feedback during each review phase to ensure the best final result.'
    },
    {
      id: 'item-3',
      category: 'Communication',
      question: 'How often will I receive project updates?',
      answer: 'We provide weekly progress updates via this portal and email. For urgent matters or quick questions, you can always reach out through the contact form. Major milestones will trigger automatic notifications to keep you informed.'
    },
    {
      id: 'item-4',
      category: 'File Delivery',
      question: 'In what formats will I receive my final files?',
      answer: 'Final deliverables are provided in multiple formats suitable for both print and digital use. This typically includes PNG, SVG, PDF, and original design files. Specific format requirements are discussed during the project kickoff and documented in your contract.'
    },
    {
      id: 'item-5',
      category: 'Payment',
      question: 'What are your payment terms?',
      answer: 'We typically work with a 50% deposit to begin work and 50% upon completion. For larger projects, we may break payments into milestone-based installments. All payment terms are clearly outlined in your signed contract.'
    },
    {
      id: 'item-6',
      category: 'Support',
      question: 'What kind of post-launch support do you provide?',
      answer: 'We provide 30 days of complimentary post-launch support for bug fixes and minor adjustments. This includes technical support for website projects and file format adjustments for design projects. Extended support packages are available upon request.'
    },
    {
      id: 'item-7',
      category: 'Changes',
      question: 'Can I request changes to the project scope?',
      answer: 'Yes, scope changes can be accommodated. Any changes that affect timeline, deliverables, or budget will require a written change order with updated terms. We\'ll provide a detailed estimate for any additional work before proceeding.'
    },
    {
      id: 'item-8',
      category: 'Ownership',
      question: 'Who owns the rights to the final designs?',
      answer: 'Upon final payment, you own all rights to the final approved designs and deliverables. We retain the right to showcase the work in our portfolio unless otherwise specified. All terms regarding intellectual property are detailed in your contract.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Frequently Asked Questions</h2>
        <p className="text-slate-600 mt-1">Find answers to common questions about your project</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-sm font-medium text-slate-800">{category}</div>
              <div className="text-xs text-slate-600 mt-1">
                {faqs.filter(faq => faq.category === category).length} questions
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Questions & Answers</CardTitle>
          <CardDescription>
            {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <div className="font-medium">{faq.question}</div>
                      <div className="text-sm text-slate-500 mt-1">{faq.category}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 text-slate-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No results found</h3>
              <p className="text-slate-500">Try different search terms or browse all questions above</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Still Have Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
          <CardDescription>
            Can't find what you're looking for? We're here to help!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => {/* Navigate to contact form */}}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            <Button variant="outline" className="flex-1">
              Schedule a Call
            </Button>
            <Button variant="outline" className="flex-1">
              Request New FAQ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
