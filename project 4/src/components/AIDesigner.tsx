import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "./ui/button";
import { Upload } from "lucide-react";

export default function AIDesigner() {
  const ref = useRef<HTMLDivElement>(null!);
  const isInView = useInView(ref, { once: true });
  const [uploaded, setUploaded] = useState(false);

  return (
    <section ref={ref} className="bg-beige py-24">
      <div className="container-main">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-sm uppercase tracking-[0.3em] text-gold"
          >
            Innovation
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="mt-4 font-heading text-4xl text-premium-black md:text-5xl lg:text-6xl"
          >
            Visualize Your Dream Salon <br />
            <span className="text-gold">Before You Invest</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-gray-600"
          >
            Upload an image of your empty space and our AI will generate premium salon concepts with furniture placement and design suggestions.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <div
            onClick={() => setUploaded(true)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed border-gold/50 bg-luxury-white p-16 transition-all hover:border-gold hover:bg-gold/5"
          >
            <Upload size={40} className="text-gold" />
            <p className="mt-4 font-heading text-xl font-semibold text-premium-black">
              {uploaded ? "Image Uploaded ✓" : "Upload Your Salon Space"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {uploaded ? "Our AI is analyzing your space..." : "Drag & drop or click to browse (JPG, PNG)"}
            </p>
            {uploaded && (
              <div className="mt-6">
                <Button>Start AI Design Consultation</Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
