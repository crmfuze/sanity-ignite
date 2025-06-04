export interface AdminMlmsoftDownlineQueryParams {
  limit: number;
  page: number;
  treeId?: number;
  // includeTree?: boolean;
  positionId?: number;
  offset?: number;
  depth?: number;
  showInactiveAccounts?: boolean;
  showDisabledAccounts?: boolean;
  periodId?: number;
  properties?: string;
  includeCountryBranches?: boolean;
  orderBy?: string;
  countTotal?: boolean;
  disableSorting?: boolean;
}
