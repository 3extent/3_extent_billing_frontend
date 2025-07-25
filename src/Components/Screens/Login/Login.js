import { useNavigate } from 'react-router-dom';
import billingimage from '../../../Assets/billingimage.webp';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useState } from 'react';
import { makeRequest } from '../../../Util/AxiosUtil';
export default function Login() {
    const navigate = useNavigate();
    // const [userData, setUserData] = useState(null);
    const [loginFormData, setLoginFormData] = useState({
        mobileNumber: "",
        password: ""
    });
    const handleInputChange = (event) => {
        
    };
    const handleLogin = () => {
          makeRequest({
            method: 'GET',
            url:'https://3-extent-billing-backend.vercel.app/api/users' ,
            data: loginFormData,
            callback:(response)=>{
                console.log('response: ', response);
                if(response.status===200){
                    //  setUserData(response.data);
                    // localStorage.setItem('userData', JSON.stringify(response.data));
                    console.log("Success");
                    navigate('/dashboard');
                }else{
                    console.log("Error");
                }
            }
        });
    };
    return (
        <div className="w-[100%] h-screen flex">
            <div className="w-[50%] h-[100%]">
                <img className="w-full h-full object-cover" src={billingimage} />
            </div>
            <div className="w-[50%] h-[100%] flex items-center justify-center">
                <div className="text-center w-[70%] space-y-6">
                    <div className="text-3xl font-bold">Welcome To 3_EXTENT</div>
                    <div className="font-serif text-xl">Log in Your Account</div>
                    <div className="space-y-4">
                        <InputComponent
                            label="Mobile Number"
                            type="number"
                            name="mobileNumber"
                            placeholder="Enter your mobile number"
                            inputClassName="w-full"
                            value={loginFormData.mobileNumber}
                            onChange={handleInputChange}
                        />
                        <InputComponent
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            inputClassName="w-full"
                            value={loginFormData.password}
                            onChange={handleInputChange}
                        />
                        <div>
                            <PrimaryButtonComponent
                                label="Login"
                                onClick={handleLogin}
                                buttonclassName="w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}







