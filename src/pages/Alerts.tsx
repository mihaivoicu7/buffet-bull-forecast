
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { Bell, BellOff, TrendingDown, TrendingUp } from 'lucide-react';

interface AlertItem {
  id: string;
  symbol: string;
  type: 'price' | 'pe' | 'volume';
  condition: 'above' | 'below';
  value: number;
}

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [symbol, setSymbol] = useState('');
  const [alertType, setAlertType] = useState<'price' | 'pe' | 'volume'>('price');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [value, setValue] = useState('');

  const handleAddAlert = () => {
    if (!symbol) {
      toast.error("Please enter a stock symbol");
      return;
    }

    if (!value || isNaN(Number(value))) {
      toast.error("Please enter a valid numeric value");
      return;
    }

    const newAlert: AlertItem = {
      id: Date.now().toString(),
      symbol: symbol.toUpperCase(),
      type: alertType,
      condition,
      value: Number(value)
    };

    setAlerts([...alerts, newAlert]);
    toast.success(`Alert created for ${symbol.toUpperCase()}`);
    
    // Reset form
    setSymbol('');
    setValue('');
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Alert removed");
  };

  const getAlertTypeLabel = (type: 'price' | 'pe' | 'volume') => {
    switch (type) {
      case 'price': return 'Price';
      case 'pe': return 'P/E Ratio';
      case 'volume': return 'Trading Volume';
    }
  };

  const getAlertIcon = (condition: 'above' | 'below') => {
    return condition === 'above' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Price Alerts</h1>
      
      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Alert</TabsTrigger>
          <TabsTrigger value="manage">Manage Alerts ({alerts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Create New Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="symbol" className="text-sm font-medium">Stock Symbol</label>
                  <Input 
                    id="symbol" 
                    placeholder="e.g., AAPL, MSFT" 
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="alertType" className="text-sm font-medium">Alert Type</label>
                  <Select 
                    value={alertType} 
                    onValueChange={(value) => setAlertType(value as 'price' | 'pe' | 'volume')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="pe">P/E Ratio</SelectItem>
                      <SelectItem value="volume">Trading Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="condition" className="text-sm font-medium">Condition</label>
                  <Select 
                    value={condition} 
                    onValueChange={(value) => setCondition(value as 'above' | 'below')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Goes Above</SelectItem>
                      <SelectItem value="below">Goes Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="value" className="text-sm font-medium">Value</label>
                  <Input 
                    id="value" 
                    placeholder={alertType === 'price' ? "e.g., 150.00" : alertType === 'pe' ? "e.g., 20" : "e.g., 1000000"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    type="number"
                    min="0"
                    step={alertType === 'price' ? "0.01" : "0.1"}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleAddAlert}
                className="w-full mt-4 bg-financial-700 hover:bg-financial-800"
              >
                <Bell className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">How alerts work:</h3>
                <p className="text-sm text-gray-600">
                  Create alerts to notify you when stocks meet specific conditions. 
                  In a real application, these alerts would be monitored continuously and you 
                  would receive notifications via email or push notification when triggered.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Your Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <BellOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">You don't have any alerts set up yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Create alerts to get notified when stocks meet your criteria.
                  </p>
                </div>
              ) : (
                <ul className="divide-y">
                  {alerts.map((alert) => (
                    <li key={alert.id} className="py-4 flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{alert.symbol}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          {getAlertIcon(alert.condition)}
                          {getAlertTypeLabel(alert.type)} {alert.condition} {alert.value}
                          {alert.type === 'price' && ' USD'}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveAlert(alert.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;
