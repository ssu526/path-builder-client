import { fetchWrapper } from "./fetchWrapper";
import { LoginCredentials, SignupCredentials, User } from "../models/types";
import { useNavigate } from "react-router-dom";

/**
 * Fetches the currently logged-in user
 *
 * @returns {Promise<User>}
 * @throws {Error}
 */
export const getLoggedInUser = async (): Promise<User> => {
  const response = await fetchWrapper("/api/v1/users", { method: "GET" });
  return response.json();
};

/**
 * Sends a request to create a new user
 *
 * @param {SignupCredentials} credentials
 * @returns {Promise<User>}
 * @throws {Error}
 */
export const signup = async (credentials: SignupCredentials): Promise<User> => {
  const response = await fetchWrapper("/api/v1/users/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

/**
 * Sends a login request
 *
 * @param {LoginCredentials} credentials
 * @returns {Promise<User>}
 * @throws {Error}
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await fetchWrapper("/api/v1/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

/**
 * Sends a logout request
 *
 * @throws {Error}
 */
export const logout = async () => {
  await fetchWrapper("/api/v1/users/logout", {
    method: "POST",
  });
};
