'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ServiceSection = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/homedesign');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <>
      {sections.map((section) => (
        <div key={section._id} className="px-4 py-2">
          <h2 className="text-xl font-bold text-right mb-4">{section.title}</h2>
          <div className="grid grid-cols-3 gap-4">
            {section.services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                icon={service.icon}
                href={service.href}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const ServiceCard = ({ title, icon, href }) => {
  const content = (
    <div className="flex flex-col items-center">
      {icon}
      <span className="text-sm text-gray-700 mt-2">{title}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

export { ServiceCard, ServiceSection };
export default ServiceCard; 






// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';

// export default function ServiceCard({ title, icon, href, isDraggable = true }) {
//   return (
//     <motion.div
//       className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//       whileHover={isDraggable ? { scale: 1.02 } : {}}
//       whileTap={isDraggable ? { scale: 0.98 } : {}}
//     >
//       <Link href={href} className="block">
//         <div className="flex flex-col items-center text-center">
//           <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
//             {icon}
//           </div>
//           <h3 className="font-medium text-gray-800">{title}</h3>
//         </div>
//       </Link>
//     </motion.div>
//   );
// } 