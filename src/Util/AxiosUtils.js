import axios from "axios";
export const apiCall = async ({ method, url, data, callback, setLoading }) => {
    console.log('method, url, data: ', method, url, data);
    if (setLoading) setLoading(true);
    try {
        await axios({ method, url, data }).then(response => {
            callback(response)
            console.log('response: ', response);
        });
    } catch (error) {
        console.log("ERROR:", error);
        if (error.response) {
            callback(error.response);
        } else {
            callback({
                status: 500,
                data: { error: "Network or server error occurred" }
            });
        }
    } finally {
        if (setLoading) setLoading(false);
    }
};
export const Spinner = () => (
    <div className="flex justify-center items-center h-screen">
        <div
            className="animate-spin rounded-full
                 h-8 w-8 border-4 border-gray-900
                 border-t-transparent"
        ></div>
    </div>
);
