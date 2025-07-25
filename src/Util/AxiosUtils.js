import axios from "axios";
export const makeRequest = async ({ method, url, data, callback }) => {
    try {
        await axios({ method, url, data }).then(response => {
            callback(response)
        });
    } catch (error) {
        console.log("ERROR:", error);
    }
};
