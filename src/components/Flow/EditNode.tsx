import { Node, useReactFlow } from "reactflow";
import { PROGRESS } from "../../utils/enums";
import React, { useContext, useState } from "react";
import { NodeData } from "./ValueNode";
import { FlowBody } from "../../models/types";
import { updateFlowDetail } from "../../api/flows_api";
import { FlowContext } from "../../context/context";
import styles from "../../styles/UserHome.module.css";

const EditNode = () => {
  const {
    currentFlowId,
    editNodeId,
    editNodeData,
    setShowEditForm,
    setEditNodeId,
    setEditNodeData,
  } = useContext(FlowContext);
  const [title, setTitle] = useState(editNodeData!.title);
  const [notes, setNotes] = useState(editNodeData!.notes);
  const [progress, setProgress] = useState(editNodeData!.progress);
  const { setNodes, toObject } = useReactFlow();

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // const nodes: Node<NodeData>[] = getNodes();

    setNodes((nodes: Node<NodeData>[]) =>
      nodes.map((node) => {
        if (node.id === editNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              title: title,
              notes: notes,
              progress: progress,
            },
          };
        } else {
          return node;
        }
      })
    );

    const obj: FlowBody = toObject() as FlowBody;
    await updateFlowDetail(obj, currentFlowId!);

    setShowEditForm(false);
  };

  const onCancelHandler = () => {
    setEditNodeId(null);
    setEditNodeData(null);
    setShowEditForm(false);
  };

  return (
    <div className={styles["edit-node-form"]}>
      <div className={styles["edit-node-form-title"]}>
        <p>Edit Node</p>
      </div>

      <form>
        <div className={styles["edit-node-form-topic-container"]}>
          <p>Topic</p>
          <input
            type="text"
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles["progress-radio-container"]}>
          <p>Progress</p>
          <div className={styles["progress-radio"]}>
            <input
              type="radio"
              name="progress"
              value={PROGRESS.PENDING}
              checked={progress === PROGRESS.PENDING}
              onChange={(e) => setProgress(PROGRESS.PENDING)}
            />
            <span>Pending</span>
          </div>

          <div className={styles["progress-radio"]}>
            <input
              type="radio"
              name="progress"
              value={PROGRESS.IN_PROGRESS}
              checked={progress === PROGRESS.IN_PROGRESS}
              onChange={(e) => setProgress(PROGRESS.IN_PROGRESS)}
            />
            <span>In Progress</span>
          </div>

          <div className={styles["progress-radio"]}>
            <input
              type="radio"
              name="progress"
              value={PROGRESS.COMPLETED}
              checked={progress === PROGRESS.COMPLETED}
              onChange={(e) => setProgress(PROGRESS.COMPLETED)}
            />
            <span>Completed</span>
          </div>

          <div className={styles["progress-radio"]}>
            <input
              type="radio"
              name="progress"
              value={PROGRESS.TERMINATED}
              checked={progress === PROGRESS.TERMINATED}
              onChange={(e) => setProgress(PROGRESS.TERMINATED)}
            />
            <span>Terminated</span>
          </div>
        </div>

        <div className={styles["node-notes-container"]}>
          <p>Notes</p>
          <textarea
            value={notes}
            name="notes"
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles["node-notes-buttons"]}>
          <button onClick={onSubmitHandler} className={styles["save-btn"]}>
            Save
          </button>

          <button onClick={onCancelHandler} className={styles["cancel-btn"]}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNode;
