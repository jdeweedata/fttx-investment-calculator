import React from 'react';
import { Search, Bell, Calendar, User } from 'lucide-react';

const TopBar = ({ title }) => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center">
        <Search className="mr-4" />
        <Calendar className="mr-4" />
        <Bell className="mr-4" />
        <User />
      </div>
    </div>
  </header>
);

export default TopBar;