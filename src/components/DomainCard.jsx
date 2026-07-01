import React from 'react';
import { motion } from 'framer-motion';

const DomainCard = React.memo(({ title, description, Icon }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-blue-500/50 transition-colors duration-200"
    >
      <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors duration-200">
        <Icon className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </motion.div>
  );
});

DomainCard.displayName = 'DomainCard';
export default DomainCard;
