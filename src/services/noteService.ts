import axios from "axios";

const API_URL=import.meta.env.VITE_API_URL;;

export const getNotes=async () => {
    const response=await axios.get(`${API_URL}/notes`);
    return response.data;
};

export const getNote=async (title: string) => {
    const response=await axios.get(`${API_URL}/notes/${encodeURIComponent(title)}`);
    return response.data;
};

export const addNote=async (note: {title: string, body: string, color: string}) => {
    const response=await axios.post(`${API_URL}/notes`, note);
    return response.data;
};

export const deleteNote=async (title: string) => {
    const response=await axios.delete(`${API_URL}/notes/${encodeURIComponent(title)}`);
    return response.data;
}

export const updateNote=async (title: string, updatedFields: {title?: string; body?: string}) => {
    const response=await axios.patch(`${API_URL}/notes/${encodeURIComponent(title)}`, updatedFields);
    return response.data;
}
