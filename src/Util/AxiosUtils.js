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
// export default function AxiosUtils() {
//     const [loading, setLoading] = useState(false);
//     return (
//         <div>
//             {loading &&
//                 < div className="absolute inset-0 flex items-center justify-center">
//                     <div className="relative w-10 h-10">
//                         <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
//                         <div className="absolute inset-2 rounded-full border-4 border-gray-600 border-b-transparent animate-spin [animation-direction:reverse]"></div>
//                     </div>
//                 </div>
//             }
//         </div>
//     );
// }
