import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { faqs } from "../data/content";

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="bg-luxury-white py-24">
      <div className="container-main mx-auto max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm uppercase tracking-[0.3em] text-gold"
        >
          FAQ
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="mt-4 text-center font-heading text-4xl text-premium-black md:text-5xl"
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
