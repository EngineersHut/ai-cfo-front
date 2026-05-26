import React from 'react';
import { Building2, Landmark, Briefcase, Globe } from 'lucide-react';

export interface WorkspaceOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const workspaceOptions: WorkspaceOption[] = [
  {
    id: 'acme-inc',
    label: 'Acme Inc',
    description: 'Main production workspace',
    icon: <Building2 size={16} />
  },
  {
    id: 'north-quest',
    label: 'North Quest',
    description: 'Regional headquarters',
    icon: <Landmark size={16} />
  },
  {
    id: 'global-sol',
    label: 'Global Solutions',
    description: 'International operations',
    icon: <Globe size={16} />
  },
  {
    id: 'tech-labs',
    label: 'Tech Labs',
    description: 'Research and Development',
    icon: <Briefcase size={16} />
  }
];
