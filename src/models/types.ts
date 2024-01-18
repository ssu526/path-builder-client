import { ReactNode } from "react";

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  flows: FlowInfo[];
}

export interface FlowDetail {
  _id: string;
  userId: string;
  flow: FlowBody;
}

export interface FlowInfo {
  flowId: string;
  name: string;
  progress: string;
  visibility: string;
}

export interface FlowBody {
  nodes: any[];
  edges: any[];
  viewport: { x: number; y: number; zoom: number };
}

export interface FlowContextType {
  children: ReactNode;
}
