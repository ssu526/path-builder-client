import { useContext, useEffect, useState } from "react";
import { FlowInfo } from "../../models/types";
import { PROGRESS } from "../../utils/enums";
import ProgressCategory from "./ProgressCategory";
import { FlowContext } from "../../context/context";
import { createNewFlow } from "../../api/flows_api";
import { logout } from "../../api/users_api";
import styles from "../../styles/Sidebar.module.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [pendingFlows, setPendingFlows] = useState<FlowInfo[]>([]);
  const [inProgressFlows, setInProgressFlows] = useState<FlowInfo[]>([]);
  const [completedFlows, setCompletedFlows] = useState<FlowInfo[]>([]);
  const [terminatedFlows, setTerminatedFlows] = useState<FlowInfo[]>([]);
  const { user, setUser, setCurrentFlowId, setCurrentFlowName } =
    useContext(FlowContext);
  const [hideSidebar, setHideSidebar] = useState(false);
  const navigate = useNavigate();

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
    navigate("/login");
  };

  const toggleSidebar = () => {
    setHideSidebar((prev) => !prev);
    console.log(hideSidebar);
  };

  return (
    <div
      className={`${styles["sidebar-container"]} ${
        hideSidebar ? styles["small-width"] : ""
      }`}
    >
      <div className={`${styles.sidebar} ${hideSidebar ? styles.hide : ""}`}>
        <div className={styles["sidebar-header-container"]}>
          <img
            className={styles["sidebar-header-profile-img"]}
            src="./user-acct-img-placeholder.png"
            alt="user-profile"
          />

          <div className={styles["sidebar-header-user"]}>
            <h3 className={styles["sidebar-header-user-name"]}>
              {user?.username}'s Paths
            </h3>
            <button className={styles["logout-btn"]} onClick={logoutHandler}>
              Logout
            </button>
          </div>
        </div>
        <div className={styles["paths-container"]}>
          <button
            className={styles["create-btn"]}
            onClick={createNewFlowHandler}
          >
            New Flow
          </button>
          <ProgressCategory title="In Progress" flows={inProgressFlows} />
          <ProgressCategory title="Pending" flows={pendingFlows} />
          <ProgressCategory title="Completed" flows={completedFlows} />
          <ProgressCategory title="Terminated" flows={terminatedFlows} />
        </div>
      </div>

      <div className={styles["sidebar-toggle-arrow"]} onClick={toggleSidebar}>
        <img src="/double-arrow.png" alt="sidebar-toggle" />
      </div>
    </div>
  );
};

export default Sidebar;
