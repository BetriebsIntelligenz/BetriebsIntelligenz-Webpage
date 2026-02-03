import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, className = '', children, noPadding }) => {
  return (
    <section id={id} className={`relative max-w-7xl mx-auto px-4 md:px-6 ${noPadding ? '' : 'py-8'} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {children}
      </motion.div>
    </section>
  );
};