import React, { useContext } from "react";
import { FlowContext } from "../../context";
import { PROGRESS } from "../../utils/enums";
import { updateFlowProgress } from "../../api/flows_api";
import styles from "../../styles/Flow.module.css";

interface ChangeProgressBtnProps {
  progress: PROGRESS;
}

const ChangeProgressBtn = ({ progress }: ChangeProgressBtnProps) => {
  const {
    currentFlowProgress,
    currentFlowId,
    setUser,
    setCurrentFlowProgress,
  } = useContext(FlowContext);

  const updateProgressHandler = async () => {
    try {
      const updatedUser = await updateFlowProgress(progress, currentFlowId!);
      setCurrentFlowProgress(progress);
      setUser(updatedUser);
    } catch (error) {
      console.log("Failed to update progress: " + error);
    }
  };

  return (
    <button
      className={`${styles["change-progress-btn"]} ${
        currentFlowProgress === progress ? styles["current-progress"] : ""
      }`}
      disabled={currentFlowProgress === progress}
      onClick={updateProgressHandler}
    >
      {progress}
    </button>
  );
};

export default ChangeProgressBtn;
