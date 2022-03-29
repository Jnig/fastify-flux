export interface AddionalResponse {
  id: number;
  user: { id: number; name: string };
}

export interface NullResponse {
  id: number;
  user: { id: number; name: string } | null;
  userNull: { id: number; name: string } | null;
}

export interface ObjectResponse {
  id: number;
  anyRecord: Record<string, any>;
  anyObject: { [key: string]: string };
  stringObject: { [key: string]: string };
}

export interface AnyResponse {
  id: number;
  anyString: any;
  anyArray: any[];
  anyObject: any;
  multiNull: null | number | string;
  multiNumber: null | number | string;
  multiString: null | number | string;
}

export interface UndefinedResponse {
  id: number;
  string?: string;
  stringUndefined?: string;
  object?: { id: number; name: string };
  objectUndefined?: { id: number; name: string };
  objectNull?: { id: number; name: string } | null;
  objectNullUndefined?: { id: number; name: string } | null;
  objectNullUndefined2?: { id: number; name: string } | null;
}

export interface NestedInterfaceResponseChild {
  id: number;
}

export interface EmptyInterfaceResponse {}

export interface NestedInterfaceResponse {
  ids: NestedInterfaceResponseChild[];
}
