import axios from "axios";
export const apiCall = async ({ method, url, data, callback }) => {
    console.log('method, url, data: ', method, url, data);
    try {
        await axios({ method, url, data }).then(response => {
            callback(response)
            console.log('response: ', response);
        });
    } catch (error) {
        console.log("ERROR:", error);
    }
};
