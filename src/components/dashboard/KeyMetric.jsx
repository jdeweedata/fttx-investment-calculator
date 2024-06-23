import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

const KeyMetric = ({ title, value, change, progress }) => (
  <Card>
    <CardContent className="p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-1 flex items-baseline justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change.startsWith('+') ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {change}
          </p>
        )}
      </div>
      {progress && (
        <p className={`mt-1 text-sm ${progress === 'On Track' ? 'text-green-600' : 'text-red-600'}`}>
          {progress}
        </p>
      )}
    </CardContent>
  </Card>
);

export default KeyMetric;