import axios from "axios";

const url = "http://localhost:9000/";

const getUsers = async () => {
    try {
        const resp = await axios.get(`${url}users`);
        if (resp.status !== 200) {
            throw new Error("Malfunctioning server GET request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return [];
    }
};

const getTweets = async () => {
    try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            console.error('User is not logged in');
            return [];
        }

        const resp = await axios.get(`${url}tweets`, {
            headers: {
                Authorization: `Bearer ${userId}` // Include the authentication token in the request headers
            }
        });
        
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
        const resp = await axios.post(`${url}login`, userData);
        if (resp.status === 201) {
            // Store authentication token in session storage upon successful login
            sessionStorage.setItem('userId', resp.data.userId);
            return resp.data;
        } else {
            throw new Error("Login failed");
        }
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

const signUp = async (newUser) => {
    try {
        if (newUser.password === newUser.verifyPassword) {
            delete newUser.verifyPassword
            const resp = await axios.post(`${url}signUp`, newUser);
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

const tweet = async (tweetData) => {
    try {
        const userId = sessionStorage.getItem('userId');
        if (!userId) {
            console.error('User is not logged in');
            return null;
        }

        console.log(tweetData); // Ensure that tweetData contains the necessary information

        const resp = await axios.post(`${url}tweet`, tweetData, {
            headers: {
                Authorization: `Bearer ${userId}` // Include the authentication token in the request headers
            }
        });
        
        if (resp.status !== 201) {
            throw new Error("Malfunctioning server POST request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};



const getOne = async (id) => {
    try {
        const resp = await axios.get(`${url}profile/${id}`);
        if (resp.status !== 201) {
            throw new Error("Malfunctioning server GET request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return [];
    }
};

const change = async (id, userData) => {
    try {
        const resp = await axios.put(`${url}profile/${id}`, userData);
        if (resp.status !== 201) {
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
        if (resp.status !== 201) {
            throw new Error("Malfunctioning server DELETE request");
        }
        return resp.data;
    } catch (err) {
        console.error(err.message);
        return null;
    }
};

export { getUsers, getTweets, login, signUp, tweet, getOne, remove, change };

