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
    <div className="relative inset-0 z-50 flex items-center justify-center h-screen">
        <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-gray-600 border-t-transparent animate-spin"></div>
        </div>
    </div>
);
