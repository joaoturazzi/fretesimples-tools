
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Zap,
  Shield,
  TestTube
} from 'lucide-react';

const TestingUtils: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = React.useState(navigator.onLine);
  const [viewport, setViewport] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  React.useEffect(() => {
    const handleOnline = () => setConnectionStatus(true);
    const handleOffline = () => setConnectionStatus(false);
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getDeviceType = () => {
    if (viewport.width < 768) return 'mobile';
    if (viewport.width < 1024) return 'tablet';
    return 'desktop';
  };

  const deviceType = getDeviceType();
  const deviceIcons = {
    mobile: <Smartphone className="h-4 w-4" />,
    tablet: <Tablet className="h-4 w-4" />,
    desktop: <Monitor className="h-4 w-4" />
  };

  const runResponsiveTest = () => {
    const tests = [
      { name: 'Mobile Portrait', width: 375, height: 667 },
      { name: 'Mobile Landscape', width: 667, height: 375 },
      { name: 'Tablet Portrait', width: 768, height: 1024 },
      { name: 'Tablet Landscape', width: 1024, height: 768 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    tests.forEach((test, index) => {
      setTimeout(() => {
        console.log(`Testing ${test.name}: ${test.width}x${test.height}`);
        // Simulate viewport change for testing
        document.documentElement.style.width = `${test.width}px`;
        document.documentElement.style.height = `${test.height}px`;
      }, index * 1000);
    });
  };

  const runPerformanceTest = () => {
    const startTime = performance.now();
    
    // Test navigation performance
    const navigationEntries = performance.getEntriesByType('navigation');
    const paintEntries = performance.getEntriesByType('paint');
    
    console.log('Navigation Performance:', navigationEntries);
    console.log('Paint Performance:', paintEntries);
    
    const endTime = performance.now();
    console.log(`Performance test completed in ${endTime - startTime}ms`);
  };

  const testAccessibility = () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    console.log(`Found ${focusableElements.length} focusable elements`);
    
    // Test tab navigation
    focusableElements.forEach((el, index) => {
      setTimeout(() => {
        (el as HTMLElement).focus();
        console.log(`Focused element ${index + 1}:`, el);
      }, index * 100);
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Painel de Testes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status do Sistema */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            {deviceIcons[deviceType]}
            <div>
              <p className="text-sm font-medium capitalize">{deviceType}</p>
              <p className="text-xs text-gray-500">
                {viewport.width}x{viewport.height}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            {connectionStatus ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <div>
              <p className="text-sm font-medium">
                {connectionStatus ? 'Online' : 'Offline'}
              </p>
              <p className="text-xs text-gray-500">
                Conectividade
              </p>
            </div>
          </div>
        </div>

        {/* Badges de Status */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={deviceType === 'mobile' ? 'default' : 'secondary'}>
            Mobile: {viewport.width < 768 ? 'OK' : 'N/A'}
          </Badge>
          <Badge variant={deviceType === 'tablet' ? 'default' : 'secondary'}>
            Tablet: {viewport.width >= 768 && viewport.width < 1024 ? 'OK' : 'N/A'}
          </Badge>
          <Badge variant={deviceType === 'desktop' ? 'default' : 'secondary'}>
            Desktop: {viewport.width >= 1024 ? 'OK' : 'N/A'}
          </Badge>
        </div>

        {/* Botões de Teste */}
        <div className="space-y-2">
          <Button 
            onClick={runResponsiveTest}
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Testar Responsividade
          </Button>
          
          <Button 
            onClick={runPerformanceTest}
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Testar Performance
          </Button>
          
          <Button 
            onClick={testAccessibility}
            variant="outline" 
            size="sm" 
            className="w-full"
          >
            <Shield className="h-4 w-4 mr-2" />
            Testar Acessibilidade
          </Button>
        </div>

        {/* Informações de Debug */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <p><strong>User Agent:</strong> {navigator.userAgent.substring(0, 50)}...</p>
          <p><strong>Platform:</strong> {navigator.platform}</p>
          <p><strong>Language:</strong> {navigator.language}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingUtils;
