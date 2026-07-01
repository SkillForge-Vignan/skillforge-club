import React from 'react';
import CardGrid from '../components/CardGrid';
import DomainCard from '../components/DomainCard';
import { Globe, Code2, Smartphone, Paintbrush, Database, ShieldAlert } from 'lucide-react';

const domainsList = [
  { title: 'Web Development', description: 'Build modern, responsive, and interactive websites using cutting edge frameworks and technologies.', Icon: Globe },
  { title: 'AI & ML', description: 'Dive into artificial intelligence, neural networks, and machine learning algorithms.', Icon: Code2 },
  { title: 'App Development', description: 'Create stunning mobile applications for iOS and Android using cross-platform tools.', Icon: Smartphone },
  { title: 'UI/UX Design', description: 'Craft beautiful, user-centric interfaces and improve overall user experiences.', Icon: Paintbrush },
  { title: 'Data Science', description: 'Learn to extract insights from raw data, build predictive models, and visualize information.', Icon: Database },
  { title: 'Cyber Security', description: 'Understand vulnerabilities, ethical hacking, and how to protect systems from cyber threats.', Icon: ShieldAlert },
];

const Domains = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-tight">
          Our Domains
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore the diverse fields of technology we focus on. Choose your path, acquire new skills, and start building.
        </p>
      </div>

      <CardGrid columns={3}>
        {domainsList.map((domain, index) => (
          <DomainCard key={index} {...domain} />
        ))}
      </CardGrid>
    </div>
  );
};

export default Domains;
