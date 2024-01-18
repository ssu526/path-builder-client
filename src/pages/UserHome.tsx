import { useContext } from "react";
import Flow from "../components/Flow/Flow";
import Sidebar from "../components/Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { FlowContext } from "../context";
import styles from "../styles/UserHome.module.css";
import EditNode from "../components/Flow/EditNode";

const UserHome = () => {
  const { user, showEditForm } = useContext(FlowContext);

  const formClasses: string = `${styles["edit-node-form-container"]} ${
    showEditForm ? "" : styles["hide-form"]
  }`;

  return (
    <div>
      {user ? (
        <>
          {user ? (
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
          ) : (
            <div>
              Please{" "}
              <span>
                <Link to="/login">Login</Link>
              </span>
              or{" "}
              <span>
                <Link to="/signup">Sign Up</Link>
              </span>
            </div>
          )}
        </>
      ) : (
        <p>
          Please <Link to="/login">Login</Link> or{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      )}
    </div>
  );
};

export default UserHome;
