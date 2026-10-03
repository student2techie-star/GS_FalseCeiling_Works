import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const FAQS = [
  {
    question: "What is a false ceiling and why do I need one?",
    answer: "A false ceiling is a secondary ceiling hung below the main structural ceiling. It is used to conceal wiring, improve acoustics, provide thermal insulation, and enhance the aesthetic appeal of a room with modern lighting solutions."
  },
  {
    question: "How long does it take to install a false ceiling?",
    answer: "The timeline depends on the size and design complexity of the room. A standard room typically takes 2 to 4 days to complete, including framing, boarding, taping, and finishing."
  },
  {
    question: "Which material is best: Gypsum or PVC?",
    answer: "Gypsum is the most popular choice for living rooms and bedrooms as it offers a seamless, smooth finish and excellent fire resistance. PVC is water-resistant, making it ideal for bathrooms, kitchens, and commercial spaces with high moisture."
  },
  {
    question: "Does a false ceiling reduce the room height?",
    answer: "Yes, a false ceiling typically drops the room height by 4 to 6 inches to accommodate the framing and concealed lighting. We carefully design the layout to ensure the room still feels spacious."
  },
  {
    question: "How much does a false ceiling cost?",
    answer: "Cost varies based on the material, design complexity, and total square footage. We offer free site visits and provide detailed, transparent quotations before starting any work."
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={cn(
              "border rounded-2xl transition-all duration-300 overflow-hidden",
              isOpen ? "bg-white border-[var(--blue)] shadow-md" : "bg-white/50 border-slate-200 hover:border-slate-300"
            )}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
            >
              <span className={cn("font-bold text-lg", isOpen ? "text-[var(--blue)]" : "text-slate-800")}>
                {faq.question}
              </span>
              <ChevronDown 
                className={cn("w-5 h-5 transition-transform duration-300 shrink-0", isOpen ? "rotate-180 text-[var(--blue)]" : "text-slate-400")} 
              />
            </button>
            <div 
              className={cn(
                "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-48 pb-5 opacity-100" : "max-h-0 pb-0 opacity-0"
              )}
            >
              <p className="text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
