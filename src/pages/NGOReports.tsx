import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Download, 
  Calendar,
  BarChart3,
  Leaf,
  Users,
  Globe
} from 'lucide-react';

const NGOReports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('monthly');

  if (!user || user.role !== 'ngo') {
    return <div>Access denied</div>;
  }

  const reports = [
    {
      id: 'monthly',
      title: 'Monthly Impact Report',
      description: 'Comprehensive overview of your monthly environmental impact',
      lastGenerated: '2025-09-30',
      icon: FileText,
    },
    {
      id: 'quarterly',
      title: 'Quarterly Performance Report',
      description: 'Detailed analysis of your quarterly campaign performance',
      lastGenerated: '2025-09-30',
      icon: BarChart3,
    },
    {
      id: 'annual',
      title: 'Annual Sustainability Report',
      description: 'Year-end summary for CSR and stakeholder reporting',
      lastGenerated: '2024-12-31',
      icon: FileText,
    },
    {
      id: 'campaign',
      title: 'Campaign-Specific Report',
      description: 'Detailed metrics for individual recycling campaigns',
      lastGenerated: '2025-10-01',
      icon: Leaf,
    },
  ];

  const handleGenerateReport = (reportId: string) => {
    // In a real app, this would generate and download the report
    alert(`Generating ${reportId} report...`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/ngo')} className="mb-4">
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate and download detailed reports for your stakeholders and CSR requirements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3>{report.title}</h3>
                    <p className="text-sm font-normal text-muted-foreground">{report.description}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last generated: {report.lastGenerated}
                  </div>
                  <Button onClick={() => handleGenerateReport(report.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">From</label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">To</label>
                  <input
                    type="date"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Metrics to Include</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="waste" className="mr-2" defaultChecked />
                  <label htmlFor="waste" className="text-sm">Waste Collected</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="citizens" className="mr-2" defaultChecked />
                  <label htmlFor="citizens" className="text-sm">Citizens Engaged</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="co2" className="mr-2" defaultChecked />
                  <label htmlFor="co2" className="text-sm">CO₂ Saved</label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <select className="w-full border rounded-md px-3 py-2 text-sm">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
                <option>JSON</option>
              </select>
              
              <Button className="w-full mt-4">
                <FileText className="h-4 w-4 mr-2" />
                Generate Custom Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report History */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Report</th>
                  <th className="text-left py-3 px-4">Generated</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Monthly Impact Report - Sep 2025</td>
                  <td className="py-3 px-4">2025-10-01</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      Completed
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Quarterly Performance - Q3 2025</td>
                  <td className="py-3 px-4">2025-09-30</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                      Completed
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Campaign Report - EcoCity Initiative</td>
                  <td className="py-3 px-4">2025-09-28</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                      Processing
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm" disabled>
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOReports;