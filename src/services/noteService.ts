import axios from "axios";

const BASE_URL='http://localhost:5000';

export const getNotes=async () => {
    const response=await axios.get(`${BASE_URL}/notes`);
    return response.data;
};

export const getNote=async (title: string) => {
    const response=await axios.get(`${BASE_URL}/notes/${encodeURIComponent(title)}`);
    return response.data;
};

export const addNote=async (note: {title: string, body: string, color: string}) => {
    const response=await axios.post(`${BASE_URL}/notes`, note);
    return response.data;
};

export const deleteNote=async (title: string) => {
    const response=await axios.delete(`${BASE_URL}/notes/${encodeURIComponent(title)}`);
    return response.data;
}

export const updateNote=async (title: string, updatedFields: {title?: string; body?: string}) => {
    const response=await axios.patch(`${BASE_URL}/notes/${encodeURIComponent(title)}`, updatedFields);
    return response.data;
}
