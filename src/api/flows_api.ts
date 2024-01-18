import { FlowBody, FlowDetail, User } from "../models/types";
import { fetchWrapper } from "./fetchWrapper";

export const getFlowDetail = async (
  flowId: string | null
): Promise<FlowDetail> => {
  const response = await fetchWrapper("/api/v1/flows/" + flowId);
  return response.json();
};

export const createNewFlow = async (): Promise<{
  flowAdded: FlowDetail[];
  user: User;
  flowName: string;
}> => {
  const response = await fetchWrapper("/api/v1/flows/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

export const updateFlowName = async (
  newName: string,
  flowId: string
): Promise<User> => {
  const requestBody = JSON.stringify({ name: newName });
  const response = await fetchWrapper("/api/v1/flows/name/" + flowId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: requestBody,
  });
  return response.json();
};

export const updateFlowProgress = async (progress: string, flowId: string) => {
  const response = await fetchWrapper("/api/v1/flows/progress/" + flowId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progress }),
  });
  return response.json();
};

export const updateFlowDetail = async (flowBody: FlowBody, flowId: string) => {
  const response = await fetchWrapper("/api/v1/flows/detail/" + flowId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flowBody }),
  });
  return response.json();
};

export const deleteFlow = async (flowId: string): Promise<User> => {
  const response = await fetchWrapper("/api/v1/flows/" + flowId, {
    method: "DELETE",
  });
  return response.json();
};
