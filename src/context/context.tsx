import { createContext, useEffect, useState } from "react";
import { FlowContextType, User } from "../models/types";
import { getLoggedInUser } from "../api/users_api";
import { NodeData } from "../components/Flow/ValueNode";

interface FlowContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  currentFlowId: string | null;
  setCurrentFlowId: React.Dispatch<React.SetStateAction<string | null>>;
  currentFlowName: string | null;
  setCurrentFlowName: React.Dispatch<React.SetStateAction<string | null>>;
  currentFlowProgress: string | null;
  setCurrentFlowProgress: React.Dispatch<React.SetStateAction<string | null>>;
  editNodeId: string | null;
  setEditNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  editNodeData: NodeData | null;
  setEditNodeData: React.Dispatch<React.SetStateAction<NodeData | null>>;
  showEditForm: boolean;
  setShowEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValues: FlowContextProps = {
  user: null,
  setUser: () => {},
  currentFlowId: null,
  setCurrentFlowId: () => {},
  currentFlowName: null,
  setCurrentFlowName: () => {},
  currentFlowProgress: null,
  setCurrentFlowProgress: () => {},
  editNodeId: null,
  setEditNodeId: () => {},
  editNodeData: null,
  setEditNodeData: () => {},
  showEditForm: false,
  setShowEditForm: () => {},
};

export const FlowContext = createContext<FlowContextProps>(defaultValues);

export const FlowProvider = ({ children }: FlowContextType) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [currentFlowName, setCurrentFlowName] = useState<string | null>(null);
  const [currentFlowProgress, setCurrentFlowProgress] = useState<string | null>(
    null
  );
  const [editNodeId, setEditNodeId] = useState<string | null>(null);
  const [editNodeData, setEditNodeData] = useState<NodeData | null>(null);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  useEffect(() => {
    async function getUser() {
      try {
        const userData = await getLoggedInUser();
        setUser(userData);
      } catch (err) {
        console.log(err);
      }
    }
    getUser();
  }, []);

  const contextValues: FlowContextProps = {
    user,
    setUser,
    currentFlowId,
    setCurrentFlowId,
    currentFlowName,
    setCurrentFlowName,
    currentFlowProgress,
    setCurrentFlowProgress,
    editNodeId,
    setEditNodeId,
    editNodeData,
    setEditNodeData,
    showEditForm,
    setShowEditForm,
  };

  return (
    <FlowContext.Provider value={contextValues}>
      {children}
    </FlowContext.Provider>
  );
};
