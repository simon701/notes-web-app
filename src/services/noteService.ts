import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const handleAuthError = (error: any) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  } else {
    throw error;
  }
};

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getNotes = async () => {
  try {
    const response = await axios.get(`${API_URL}/notes`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const getNote = async (title: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/notes/${encodeURIComponent(title)}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const addNote = async (note: {
  title: string;
  body: string;
  color: string;
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/notes`,
      note,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const deleteNote = async (title: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/notes/${encodeURIComponent(title)}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const updateNote = async (
  title: string,
  updatedFields: { title?: string; body?: string }
) => {
  try {
    const response = await axios.patch(
      `${API_URL}/notes/${encodeURIComponent(title)}`,
      updatedFields,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};
