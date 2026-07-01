import React from 'react';

const componentNameMap = {
  Domains: 'Domains Page',
  Projects: 'Projects Page',
  Events: 'Events Page',
  Team: 'Team Page',
  Contact: 'Contact Page',
  Feedback: 'Feedback Page',
  Login: 'Login Page'
};

const Template = ({ name }) => (
  <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
    <div className="glass p-12 rounded-2xl">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        {componentNameMap[name]}
      </h1>
      <p className="mt-4 text-gray-400">Coming soon...</p>
    </div>
  </div>
);

export default Template;
