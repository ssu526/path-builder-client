import { useContext, useEffect, useState } from "react";
import { FlowInfo } from "../../models/types";
import { PROGRESS } from "../../utils/enums";
import ProgressCategory from "./ProgressCategory";
import { FlowContext } from "../../context";
import { createNewFlow } from "../../api/flows_api";
import { logout } from "../../api/users_api";
import styles from "../../styles/Sidebar.module.css";

const Sidebar = () => {
  const [pendingFlows, setPendingFlows] = useState<FlowInfo[]>([]);
  const [inProgressFlows, setInProgressFlows] = useState<FlowInfo[]>([]);
  const [completedFlows, setCompletedFlows] = useState<FlowInfo[]>([]);
  const [terminatedFlows, setTerminatedFlows] = useState<FlowInfo[]>([]);
  const { user, setUser, setCurrentFlowId, setCurrentFlowName } =
    useContext(FlowContext);

  useEffect(() => {
    const pendingFlows = user!.flows.filter(
      (flow) => flow.progress === PROGRESS.PENDING
    );
    const inProgressFlows = user!.flows.filter(
      (flow) => flow.progress === PROGRESS.IN_PROGRESS
    );
    const completedFlows = user!.flows.filter(
      (flow) => flow.progress === PROGRESS.COMPLETED
    );
    const terminatedFlows = user!.flows.filter(
      (flow) => flow.progress === PROGRESS.TERMINATED
    );

    setPendingFlows(pendingFlows);
    setInProgressFlows(inProgressFlows);
    setCompletedFlows(completedFlows);
    setTerminatedFlows(terminatedFlows);
  }, [user]);

  const createNewFlowHandler = async () => {
    try {
      const result = await createNewFlow();
      const newFlowId = result.flowAdded[0]._id;
      const updatedUser = result.user;
      setUser(updatedUser);
      setCurrentFlowId(newFlowId);
      setCurrentFlowName(result.flowName);
    } catch (error) {
      console.log(error);
    }
  };

  const logoutHandler = async () => {
    logout();
    setUser(null);
  };
  return (
    <div className={styles.sidebar}>
      <div className={styles["sidebar-header-container"]}>
        <div className={styles["sidebar-header"]}>
          <img src="./logo-only-bg.png" alt="logo" className={styles.logo} />
          <h3 className={styles["sidebar-header-user"]}>
            {user?.username}'s Paths
          </h3>
        </div>
        <div className={styles["sidebar-header-buttons"]}>
          <button className={styles["logout-btn"]} onClick={logoutHandler}>
            Logout
          </button>
          <button
            className={styles["create-btn"]}
            onClick={createNewFlowHandler}
          >
            New Flow
          </button>
        </div>
      </div>

      <div className={styles["paths-container"]}>
        <ProgressCategory title="In Progress" flows={inProgressFlows} />
        <ProgressCategory title="Pending" flows={pendingFlows} />
        <ProgressCategory title="Completed" flows={completedFlows} />
        <ProgressCategory title="Terminated" flows={terminatedFlows} />
      </div>
    </div>
  );
};

export default Sidebar;
