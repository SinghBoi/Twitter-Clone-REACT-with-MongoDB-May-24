import axios from "axios";

const url = "http://localhost:9000/users";

const getAll = async () => {
    try {
        const resp = await axios.get(url);
        if (resp.status !== 200) {
            throw new Error("Malfunctioning server GET request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return [];
    }
};

const login = async (userData) => {
    try {
        const resp = await axios.post("http://localhost:9000/login", userData);
        if (resp.status !== 200) {
            throw new Error("Malfunctioning server GET request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

const signUp = async (newUser) => {
    try {
        if (newUser.password === newUser.verifyPassword) {
            delete newUser.verifyPassword
            const resp = await axios.post("http://localhost:9000/signUp", newUser);
            console.log(resp.status)
            if (resp.status !== 201) {
                throw new Error("Malfunctioning server GET request");
            }
            return resp.data;
        } else {
            throw new Error("Password Mismatch")
        }
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

const getOne = async (id) => {
    try {
        const resp = await axios.get(`${url}/${id}`);
        if (resp.status !== 200) {
            throw new Error("Malfunctioning server GET request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return [];
    }
};

const create = async (newUser) => {
    try {
        const resp = await axios.post(url, newUser);
        if (resp.status !== 201) {
            throw new Error("Malfunctioning server POST request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

const change = async (id, userData) => {
    try {
        const resp = await axios.put(`${url}/${id}`, userData);
        if (resp.status !== 200) {
            throw new Error("Malfunctioning server PUT request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

const remove = async (id) => {
    try {
        const resp = await axios.delete(`${url}/${id}`);
        if (resp.status !== 200) {
            throw new Error("Malfunctioning server DELETE request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

export { getAll, login, signUp, getOne, create, remove, change };