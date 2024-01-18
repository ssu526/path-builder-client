import React, { useContext } from "react";
import { deleteFlow, updateFlowDetail } from "../../api/flows_api";
import { FlowBody, FlowInfo } from "../../models/types";
import { FlowContext } from "../../context";
import styles from "../../styles/Sidebar.module.css";
import { useReactFlow } from "reactflow";

interface FlowNameComponentProps {
  flow: FlowInfo;
  isSelected: Boolean;
}

const FlowName = ({ flow, isSelected }: FlowNameComponentProps) => {
  const {
    setUser,
    currentFlowId,
    setCurrentFlowId,
    setCurrentFlowName,
    setCurrentFlowProgress,
  } = useContext(FlowContext);

  const { toObject } = useReactFlow();

  const selectFlowHandler = async (e: React.MouseEvent) => {
    if (currentFlowId) {
      const obj: FlowBody = toObject() as FlowBody;
      await updateFlowDetail(obj, currentFlowId);
    }

    setCurrentFlowId(flow.flowId);
    setCurrentFlowName(flow.name);
    setCurrentFlowProgress(flow.progress);
  };

  const deleteFlowHandler = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    flowId: string
  ) => {
    e.stopPropagation();
    try {
      const updatedUser = await deleteFlow(flowId);
      setUser(updatedUser);
      if (currentFlowId === flowId) {
        setCurrentFlowId(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`${styles["sidebar-pathname-container"]} ${
        isSelected ? styles.selected : ""
      }`}
      onClick={(e) => selectFlowHandler(e)}
    >
      <p className={styles["sidebar-pathname"]}>{flow.name}</p>
      <span
        className={styles["delete-flow-btn"]}
        onClick={(e) => deleteFlowHandler(e, flow.flowId)}
      >
        🗑
      </span>
    </div>
  );
};

export default FlowName;
