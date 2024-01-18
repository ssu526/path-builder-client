import { useContext } from "react";
import FlowName from "./FlowName";
import { FlowInfo } from "../../models/types";
import { FlowContext } from "../../context";
import styles from "../../styles/Sidebar.module.css";

interface ProgressCategoryProps {
  title: string;
  flows: FlowInfo[];
}

const ProgressCategory = ({ title, flows }: ProgressCategoryProps) => {
  const { currentFlowId } = useContext(FlowContext);

  return (
    <div className={styles["progress-category"]}>
      <h3 className={styles["progress-category-name"]}>{title}</h3>
      {flows.length === 0 ? (
        <div className={styles["no-path-text"]}>No paths</div>
      ) : (
        flows.map((flow) => (
          <FlowName
            key={flow.flowId}
            flow={flow}
            isSelected={flow.flowId === currentFlowId}
          />
        ))
      )}
    </div>
  );
};

export default ProgressCategory;
