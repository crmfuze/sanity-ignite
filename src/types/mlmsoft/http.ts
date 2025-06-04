import { Dictionary, FieldType, ValuePair, ValuePairField } from "./utils";

/* Response */
export interface AdminMlmsoftResponse {
  success: boolean;
  requestId: string;
  payload?: Record<string, any>;
  error?: AdminMlmsoftErrorResponse;
  map?: AdminMlmsoftMapStructure;
}

export interface AdminMlmsoftErrorResponse {
  code: number;
  type: string;
  description: string;
  data: Record<string, any>;
}

/* Auth */
export interface AdminMlmsoftAuthResponse extends AdminMlmsoftResponse {
  payload?: {
    accessToken?: string;
    refreshToken?: string;
  };
}

/* User */
export interface AdminMlmsoftUser {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  login: string;
  registeredAt: string;
  country: {
    id: string;
    title: string;
  };
  profileFields: {} | null;
}

/* Account */
export interface AdminMlmsoftAccount {
  id: string | number;
  externalId: string;
  idValue: ValuePair;
  title?: string;
  status: number;
  created_at: string;
  activated_at: string;
  invite_code?: string;
  users?: AdminMlmsoftUser[];
  profile: ValuePairField[];
}

export type AdminCreateMlmsoftAccount = {
  login: string;
  sponsorId: number;
  password?: string;
  profile: ValuePairField[];
};

export type AdminUpdateMlmsoftAccount = Partial<AdminCreateMlmsoftAccount>;

/* Position */
export interface AdminMlmsoftPosition {
  id: number;
  level: number;
  treeId: number;
  treeLevel: number;
  accountId: string;
  parentPositionId: number;
  parentPosition?: {
    id: number;
    account: AdminMlmsoftAccount;
  };
  number: number;
  offset: number;
  spillLeg: null | string;
  childrenCount: number;
  createdAt: string;
  account: AdminMlmsoftAccount;
  properties: ValuePairField[];
}

/* Plan Property */
export interface AdminMlmsoftPlanProperty {
  id: number;
  plan_id: number;
  title: string;
  fieldType: FieldType;
  dictionary_id: number | null;
  dictionary: Dictionary | null;
  is_rank: boolean;
  is_volume: boolean;
  is_bonus: boolean;
  is_internal_editable: boolean;
  is_external_editable: boolean;
  is_direct_editable: boolean;
  alias: string;
  tree_id: number;
  description: string | null;
  order: number;
  is_invisible: boolean;
}

/* Account Property */
export interface AdminMlmsoftAccountProperty {
  id: number;
  alias: string;
  values: Array<{ positionId: number; value: ValuePair }>;
}

/* Profile Field Definition */
export interface AdminMlmsoftProfileFieldDefinition {
  id: number;
  title: string;
  description: string;
  fieldType: FieldType;
  dictionary_id: number | null;
  dictionary?: Dictionary | null;
  is_mandatory?: boolean;
  alias: string;
  is_system?: boolean;
  isDeleted?: boolean;
  isUnique: boolean;
}

export interface AdminMlmsoftMapStructure {
  planProperties: AdminMlmsoftPlanProperty[];
  profileFields: AdminMlmsoftProfileFieldDefinition[];
}

export interface AdminMlmsoftLanguage {
  id: string;
  name: string;
}

/* Store */
export interface StoreMlmsoftSearchByInviteCodeResponse {
  id: string;
  idValue: ValuePair
  title: string;
}