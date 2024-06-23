import React from 'react';
import { Home, PieChart, Settings, Users } from 'lucide-react';

const Sidebar = () => (
  <div className="bg-indigo-800 text-white w-16 flex flex-col items-center py-4">
    <div className="mb-8">
      <Home size={24} />
    </div>
    <div className="mb-8">
      <PieChart size={24} />
    </div>
    <div className="mb-8">
      <Users size={24} />
    </div>
    <div>
      <Settings size={24} />
    </div>
  </div>
);

export default Sidebar;