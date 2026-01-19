export enum ContractStatus {
  Created = 'Created',
  Approved = 'Approved',
  Sent = 'Sent',
  Signed = 'Signed',
  Locked = 'Locked',
  Revoked = 'Revoked'
}

export interface BlueprintField {
  type: 'Text' | 'Date' | 'Signature' | 'Checkbox';
  label: string;
  x: number;
  y: number;
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  fields: BlueprintField[];
  createdAt: string;
}

export interface Contract {
  id: string;
  name: string;
  blueprintId: string;
  blueprintName: string;
  status: ContractStatus;
  fieldData: Record<string, string | number | boolean | null>;
  createdAt: string;
}
