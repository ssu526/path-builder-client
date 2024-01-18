import { PROGRESS } from "../../utils/enums";
import { Handle, NodeProps, Position, Node } from "reactflow";
import { useContext } from "react";
import { FlowContext } from "../../context";
import styles from "../../styles/Flow.module.css";

export type NodeData = {
  title: string;
  notes: string;
  progress: PROGRESS;
};

export type ValueNodeType = Node<NodeData>;

const ValueNode = ({ id, data }: NodeProps<NodeData>) => {
  const sanitizedProgress = data.progress.replace(/\s+/g, "-");
  const nodeClasses: string = `${styles["node-container"]} ${styles[sanitizedProgress]}`;
  const { setEditNodeData, setEditNodeId, setShowEditForm } =
    useContext(FlowContext);

  const editNodeHandler = () => {
    setEditNodeId(id);
    setEditNodeData(data);
    setShowEditForm(true);
  };

  return (
    <div className={nodeClasses}>
      <Handle
        type="target"
        className={`${styles.dragHandle} ${styles["dragHandle-top"]}`}
        position={Position.Top}
      />

      <div className={`${styles["node-content"]}`}>
        <p
          className={`${styles["node-title"]} ${styles["custom-drag-handle"]}`}
        >
          {data.title}
        </p>
        <span className={styles["edit-node-symbol"]} onClick={editNodeHandler}>
          ✎
        </span>
      </div>

      <Handle
        type="source"
        className={`${styles.dragHandle} ${styles["dragHandle-bottom"]}`}
        position={Position.Bottom}
      />
    </div>
  );
};

export default ValueNode;
