import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ResultCard = ({ results }) => (
  <Card>
    <CardHeader>
      <CardTitle>Feasibility Results</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <p><strong>Total CAPEX:</strong> ZAR {results.totalCapex.toFixed(2)}</p>
        <p><strong>Annual Revenue:</strong> ZAR {results.annualRevenue.toFixed(2)}</p>
        <p><strong>Annual OPEX:</strong> ZAR {results.annualOpex.toFixed(2)}</p>
        <p><strong>Annual Cash Flow:</strong> ZAR {results.annualCashFlow.toFixed(2)}</p>
        <p><strong>NPV:</strong> ZAR {results.npv.toFixed(2)}</p>
        <p><strong>IRR:</strong> {results.irr.toFixed(2)}%</p>
        <p><strong>Payback Period:</strong> {results.paybackPeriod.toFixed(2)} years</p>
        <p><strong>ROI:</strong> {results.roi.toFixed(2)}%</p>
      </div>
    </CardContent>
  </Card>
);

export default ResultCard;