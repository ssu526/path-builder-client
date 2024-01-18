import { useContext, useEffect } from "react";
import Flow from "../components/Flow/Flow";
import Sidebar from "../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { FlowContext } from "../context/context";
import EditNode from "../components/Flow/EditNode";
import styles from "../styles/UserHome.module.css";

const UserHome = () => {
  const { user, showEditForm } = useContext(FlowContext);

  const formClasses: string = `${styles["edit-node-form-container"]} ${
    showEditForm ? "" : styles["hide-form"]
  }`;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  return (
    user && (
      <div className={styles["user-home"]}>
        <ReactFlowProvider>
          <Sidebar />
          <Flow />
          {showEditForm && (
            <div className={formClasses}>
              <EditNode />
            </div>
          )}
        </ReactFlowProvider>
      </div>
    )
  );
};

export default UserHome;
