import { useContext, useState } from "react";
import { signup } from "../api/users_api";
import { User } from "../models/types";
import { HttpError } from "../errors/http_errors";
import { Link, useNavigate } from "react-router-dom";
import { FlowContext } from "../context";
import styles from "../styles/Auth.module.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(Boolean);
  const { user, setUser } = useContext(FlowContext);

  if (user) {
    navigate("/");
  }

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const user: User = await signup({ username, email, password });
      setUser(user);
      navigate("/");
    } catch (error) {
      if (error instanceof HttpError) {
        setErrorText("Failed to sign up: " + error.message);
      } else {
        setErrorText("Failed to sign up: Unknown Error");
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
    setErrorText(null);
  };

  return (
    <div className={styles["auth-container"]}>
      <div className={styles["logo-container"]}>
        <img src="./logo2-bg.png" alt="logo" className={styles.logo} />
      </div>

      <div className={styles["auth-form-container"]}>
        <p className={styles["login-signup-text"]}>Sign Up</p>
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
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
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
            Sign Up
          </button>
        </form>
        <div className={styles["login-signup-message"]}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
