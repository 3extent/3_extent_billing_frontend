import axios from "axios";
export const apiCall = async ({ method, url, data, callback }) => {
    try {
        await axios({ method, url, data }).then(response => {
            callback(response)
            console.log('response: ', response);
        });
    } catch (error) {
        console.log("ERROR:", error);
    }
};
