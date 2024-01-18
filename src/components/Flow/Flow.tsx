import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  NodeTypes,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnConnectStartParams,
  Panel,
  addEdge,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import ValueNode, { ValueNodeType } from "./ValueNode";
import { PROGRESS } from "../../utils/enums";
import { v4 as uuidv4 } from "uuid";
import PathEdge from "./PathEdge";
import { FlowBody } from "../../models/types";
import {
  getFlowDetail,
  updateFlowDetail,
  updateFlowName,
} from "../../api/flows_api";
import { FlowContext } from "../../context/context";
import ChangeProgressBtn from "./ChangeProgressBtn";
import styles from "../../styles/Flow.module.css";
import "../../styles/Loader.css";

const nodeTypes: NodeTypes = {
  valueNode: ValueNode,
};

const edgeTypes = { edge: PathEdge };

const Flow = () => {
  const [initialNodes, setInitialNodes] = useState<any[]>([]);
  const [initialEdges, setInitialEdges] = useState<any[]>([]);
  const [initialViewPort, setInitialViewPort] = useState<any>({});
  const [isFlowLoading, setIsFlowLoading] = useState(false);
  const [showFlowLoadingError, setShowFlowLoadingError] = useState(false);
  const { currentFlowId, currentFlowName, setUser, setCurrentFlowName } =
    useContext(FlowContext);
  const [isEditingFlowName, setIsEditingFlowName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [showEditNameError, setShowEditedNameError] = useState(false);

  const {
    addNodes,
    getNodes,
    addEdges,
    getEdges,
    setNodes,
    setEdges,
    getNode,
    toObject,
  } = useReactFlow();

  useEffect(() => {
    setShowEditedNameError(false);
    const getFlow = async () => {
      try {
        setShowFlowLoadingError(false);
        setIsFlowLoading(true);

        const data = await getFlowDetail(currentFlowId);

        setInitialNodes(data.flow.nodes);
        setInitialEdges(data.flow.edges);
        setInitialViewPort(data.flow.viewport);
      } catch (err) {
        setShowFlowLoadingError(true);
      } finally {
        setIsFlowLoading(false);
      }
    };
    if (currentFlowId) {
      getFlow();
    }
    setEditedName(currentFlowName!);
  }, [currentFlowId]);

  const onConnect: OnConnect = useCallback(async (connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
    updateFlowInDB();
  }, []);

  const connectingNodeId = useRef<string | null>(null);

  const onConnectStart: OnConnectStart = useCallback(
    (
      e: React.MouseEvent<Element> | React.TouchEvent<Element>,
      { nodeId }: OnConnectStartParams
    ) => {
      connectingNodeId.current = nodeId;
    },
    [currentFlowId]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    async (e: MouseEvent | TouchEvent) => {
      const targetIsPane: boolean = (
        e.target as HTMLElement
      ).classList.contains("react-flow__pane");

      if (targetIsPane && connectingNodeId.current) {
        const parent: ValueNodeType | undefined = getNode(
          connectingNodeId.current
        );

        const nodeId: string = uuidv4();

        const newNode = {
          id: nodeId,
          type: "valueNode",
          position: {
            x: parent!.position.x + 100,
            y: parent!.position.y + 100,
          },
          data: {
            title: "Untitled",
            notes: "",
            progress: PROGRESS.PENDING,
          },
        };
        addNodes(newNode);
        setNodes(getNodes());

        const edgeId = uuidv4();
        const newEdge = {
          id: edgeId,
          type: "edge",
          source: connectingNodeId.current,
          target: nodeId,
        };
        addEdges(newEdge);
        setEdges(getEdges());

        updateFlowInDB();

        connectingNodeId.current = null;
      }
    },
    [currentFlowId]
  );

  const addNewNode = async () => {
    const nodeId: string = uuidv4();

    const newNode = {
      id: nodeId,
      type: "valueNode",
      position: { x: 0, y: 0 },
      data: {
        title: "Untitled",
        notes: "",
        progress: PROGRESS.PENDING,
      },
    };
    addNodes(newNode);
    setNodes(getNodes());
    updateFlowInDB();
  };

  const updateFlowInDB = async () => {
    const obj: FlowBody = toObject() as FlowBody;
    await updateFlowDetail(obj, currentFlowId!);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowEditedNameError(false);
    setEditedName(e.target.value);
  };

  const updatePathNameHandler = async () => {
    if (editedName.trim().length === 0) {
      setShowEditedNameError(true);
    } else {
      try {
        const updatedUser = await updateFlowName(editedName!, currentFlowId!);
        setCurrentFlowName(editedName);
        setUser(updatedUser);
      } catch (error) {
        console.log(error);
      } finally {
        setIsEditingFlowName(false);
        setShowEditedNameError(false);
      }
    }
  };

  const cancelUpdatePathNameHandler = () => {
    setIsEditingFlowName(false);
    setShowEditedNameError(false);
    setEditedName(currentFlowName!);
  };

  return (
    <>
      {!currentFlowId && (
        <div className={styles["no-flow-selected"]}>
          <h1>No flow selected</h1>
        </div>
      )}
      {isFlowLoading && (
        <div className={styles["loading"]}>
          <div className="loader"></div>
        </div>
      )}
      {showFlowLoadingError && (
        <div className={styles["something-went-wrong"]}>
          <h1>Something went wrong</h1>
        </div>
      )}

      {currentFlowId && !isFlowLoading && !showFlowLoadingError && (
        <div className={styles["flow-container"]}>
          <div className={styles["flow-name-container"]}>
            {isEditingFlowName ? (
              <div className={styles["update-path-name-container"]}>
                <div>
                  <input
                    className={styles["path-name-input"]}
                    type="text"
                    value={editedName!}
                    onChange={inputChangeHandler}
                  />
                  {showEditNameError && (
                    <div className={styles["edit-path-name-error"]}>
                      Please provide a name for the path
                    </div>
                  )}
                </div>
                <div className={styles["update-path-name-buttons"]}>
                  <div
                    className={[
                      styles["update-path-name-button"],
                      styles["confirm-update-name"],
                    ].join(" ")}
                    onClick={updatePathNameHandler}
                  >
                    ✔
                  </div>
                  <div
                    className={[
                      styles["update-path-name-button"],
                      styles["cancel-update-name"],
                    ].join(" ")}
                    onClick={cancelUpdatePathNameHandler}
                  >
                    ✖
                  </div>
                </div>
              </div>
            ) : (
              <p
                className={styles["path-name"]}
                onDoubleClick={() => setIsEditingFlowName(true)}
              >
                {currentFlowName}
              </p>
            )}

            <div className={styles["change-progress-container"]}>
              <ChangeProgressBtn progress={PROGRESS.IN_PROGRESS} />
              <ChangeProgressBtn progress={PROGRESS.PENDING} />
              <ChangeProgressBtn progress={PROGRESS.COMPLETED} />
              <ChangeProgressBtn progress={PROGRESS.TERMINATED} />
            </div>
          </div>
          <ReactFlow
            defaultNodes={initialNodes}
            defaultEdges={initialEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onNodesDelete={updateFlowInDB}
            onEdgesDelete={updateFlowInDB}
            fitView
          >
            <Background />
            <Controls showInteractive={false} position={"top-right"} />
            <Panel position="top-left">
              <button
                onClick={addNewNode}
                className={styles["add-new-node-btn"]}
              >
                ➕ New node
              </button>
            </Panel>
          </ReactFlow>
        </div>
      )}
    </>
  );
};

export default Flow;
