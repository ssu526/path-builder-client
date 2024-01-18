import { useContext, useState } from "react";
import { HttpError } from "../errors/http_errors";
import { login } from "../api/users_api";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../models/types";
import { FlowContext } from "../context";
import styles from "../styles/Auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(Boolean);
  const { user, setUser } = useContext(FlowContext);

  if (user) {
    navigate("/");
  }

  const submitFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const user: User = await login({ username, password });
      setUser(user);
      navigate("/");
    } catch (error) {
      if (error instanceof HttpError) {
        setErrorText("Failed to login: " + error.message);
      } else {
        setErrorText("Failed to login: Unknown Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
    setErrorText("");
  };

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["logo-container"]}>
        <img src="./logo2-bg.png" alt="logo" className={styles.logo} />
      </div>
      <div className={styles["auth-form-container"]}>
        <p className={styles["login-signup-text"]}>Log In</p>
        {errorText && (
          <div className={styles["error-container"]}>
            <p className={styles["error-text"]}>{errorText}</p>
          </div>
        )}
        <form className={styles["auth-form"]} onSubmit={submitFormHandler}>
          <input
            className={styles["auth-input"]}
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(e) => handleInputChange(e, setUsername)}
          />
          <input
            className={styles["auth-input"]}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
          />
          <button
            className={styles["auth-btn"]}
            disabled={isSubmitting}
            type="submit"
          >
            Login
          </button>
        </form>
        <div className={styles["login-signup-message"]}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
