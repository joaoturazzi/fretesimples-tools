
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Bell, Palette, Database, 
  Shield, Download, Upload, RefreshCw, Save, Check,
  MapPin, Calculator, DollarSign, Fuel, Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuickNotify } from './ui/enhanced-notification';

interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    calculations: boolean;
    reports: boolean;
    updates: boolean;
    marketing: boolean;
  };
  defaults: {
    vehicleType: string;
    fuelPrice: number;
    consumption: number;
    costPerKm: number;
    currency: string;
  };
  privacy: {
    analytics: boolean;
    location: boolean;
    history: boolean;
  };
  profile: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
}

const Settings = () => {
  const notify = useQuickNotify();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    notifications: {
      calculations: true,
      reports: true,
      updates: false,
      marketing: false,
    },
    defaults: {
      vehicleType: 'truck',
      fuelPrice: 5.50,
      consumption: 10.5,
      costPerKm: 2.50,
      currency: 'BRL',
    },
    privacy: {
      analytics: true,
      location: true,
      history: true,
    },
    profile: {
      name: '',
      company: '',
      email: '',
      phone: '',
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => {
      const sectionData = prev[section] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [key]: value,
        },
      };
    });
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setHasChanges(false);
    
    notify.success(
      'Configurações Salvas!',
      'Suas preferências foram atualizadas com sucesso'
    );
  };

  const resetToDefaults = () => {
    setSettings(prev => ({
      ...prev,
      theme: 'light',
      defaults: {
        vehicleType: 'truck',
        fuelPrice: 5.50,
        consumption: 10.5,
        costPerKm: 2.50,
        currency: 'BRL',
      },
    }));
    setHasChanges(true);
    
    notify.info(
      'Configurações Restauradas',
      'Valores padrão foram restaurados'
    );
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'frete-simples-settings.json';
    link.click();
    
    notify.success(
      'Configurações Exportadas',
      'Arquivo de configurações baixado com sucesso'
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon size={28} className="text-orange-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600">Personalize sua experiência no Frete Simples</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              Alterações não salvas
            </div>
          )}
          
          <Button onClick={saveSettings} className="gap-2" disabled={!hasChanges}>
            <Save size={16} />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="defaults">Padrões</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="data">Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Informações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => updateSettings('profile', 'name', e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={settings.profile.company}
                    onChange={(e) => updateSettings('profile', 'company', e.target.value)}
                    placeholder="Nome da empresa"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) => updateSettings('profile', 'phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defaults" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator size={20} />
                Valores Padrão para Cálculos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Truck size={16} />
                    Tipo de Veículo Padrão
                  </Label>
                  <Select
                    value={settings.defaults.vehicleType}
                    onValueChange={(value) => updateSettings('defaults', 'vehicleType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck">Caminhão</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="car">Carro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Fuel size={16} />
                    Preço do Combustível (R$/L)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.defaults.fuelPrice}
                    onChange={(e) => updateSettings('defaults', 'fuelPrice', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Consumo Padrão (km/L)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.defaults.consumption}
                    onChange={(e) => updateSettings('defaults', 'consumption', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign size={16} />
                    Custo por KM (R$)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings.defaults.costPerKm}
                    onChange={(e) => updateSettings('defaults', 'costPerKm', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button onClick={resetToDefaults} variant="outline" className="gap-2">
                  <RefreshCw size={16} />
                  Restaurar Padrões
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações de Cálculos</Label>
                    <p className="text-sm text-gray-500">Receba alertas quando cálculos forem concluídos</p>
                  </div>
                  <Switch
                    checked={settings.notifications.calculations}
                    onCheckedChange={(checked) => updateSettings('notifications', 'calculations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Relatórios Automáticos</Label>
                    <p className="text-sm text-gray-500">Receba relatórios semanais de atividade</p>
                  </div>
                  <Switch
                    checked={settings.notifications.reports}
                    onCheckedChange={(checked) => updateSettings('notifications', 'reports', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Atualizações do Sistema</Label>
                    <p className="text-sm text-gray-500">Notificações sobre novas funcionalidades</p>
                  </div>
                  <Switch
                    checked={settings.notifications.updates}
                    onCheckedChange={(checked) => updateSettings('notifications', 'updates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ofertas e Promoções</Label>
                    <p className="text-sm text-gray-500">Receba informações sobre novos serviços</p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => updateSettings('notifications', 'marketing', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                Configurações de Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Coleta de Analytics</Label>
                    <p className="text-sm text-gray-500">Ajude-nos a melhorar o sistema compartilhando dados de uso</p>
                  </div>
                  <Switch
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) => updateSettings('privacy', 'analytics', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dados de Localização</Label>
                    <p className="text-sm text-gray-500">Permitir acesso à localização para melhorar rotas</p>
                  </div>
                  <Switch
                    checked={settings.privacy.location}
                    onCheckedChange={(checked) => updateSettings('privacy', 'location', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Histórico de Cálculos</Label>
                    <p className="text-sm text-gray-500">Manter histórico local dos seus cálculos</p>
                  </div>
                  <Switch
                    checked={settings.privacy.history}
                    onCheckedChange={(checked) => updateSettings('privacy', 'history', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database size={20} />
                Gerenciamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={exportSettings} className="h-20 flex-col gap-2" variant="outline">
                  <Download size={24} />
                  <span>Exportar Configurações</span>
                </Button>
                
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Upload size={24} />
                  <span>Importar Configurações</span>
                </Button>
                
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Database size={24} />
                  <span>Backup de Dados</span>
                </Button>
                
                <Button className="h-20 flex-col gap-2" variant="destructive">
                  <RefreshCw size={24} />
                  <span>Limpar Todos os Dados</span>
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Informações sobre seus dados:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Todos os dados são armazenados localmente no seu dispositivo</li>
                  <li>• Você pode exportar ou limpar seus dados a qualquer momento</li>
                  <li>• Não compartilhamos informações pessoais com terceiros</li>
                  <li>• O backup é recomendado antes de grandes atualizações</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
