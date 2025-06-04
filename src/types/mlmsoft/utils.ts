import { AdminMlmsoftResponse } from "./http";

export interface ValuePair {
  raw: string | number | boolean | null;
  presentable: string;
}

export interface ValuePairField {
  alias: string;
  value: ValuePair;
}

export interface DictionaryItem {
  id: number;
  dictionaryId: number;
  key: string;
  title: null | string;
  priority: null | number;
  alias: string;
  value: string;
  isDeleted: boolean;
}

export interface Dictionary {
  id: number;
  title: string;
  alias: string;
  dictionaryType: string;
  dictionaryItems: DictionaryItem[];
  isDeleted: boolean;
}

export interface FieldType {
  id: number | null;
  title: string;
  alias: string;
}

export function isMlmsoftResponse(
  response: unknown
): response is AdminMlmsoftResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    "requestId" in response
  );
}

export function getValuePairField(
  fields: ValuePairField[],
  alias: string
): ValuePairField | undefined {
  const field = fields.find((field) => field.alias === alias);
  return field;
}
