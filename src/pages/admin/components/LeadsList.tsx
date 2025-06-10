
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Profile } from '../types';
import { getLeadStatusColor } from '../utils';

interface LeadsListProps {
  profiles: Profile[];
}

const LeadsList: React.FC<LeadsListProps> = ({ profiles }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Capturados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{profile.full_name}</h3>
                <p className="text-sm text-gray-600">{profile.email}</p>
                {profile.company && (
                  <p className="text-sm text-gray-500">{profile.company}</p>
                )}
                <p className="text-xs text-gray-400">
                  Cadastrado: {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getLeadStatusColor(profile.lead_status)}>
                  {profile.lead_status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsList;
