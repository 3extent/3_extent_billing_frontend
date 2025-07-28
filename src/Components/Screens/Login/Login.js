import { useNavigate } from 'react-router-dom';
import billingimage from '../../../Assets/billingimage.webp';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useEffect, useState } from 'react';
import { makeRequest } from '../../../Util/AxiosUtils';
export default function Login() {
    const navigate = useNavigate();
    const [loginFormData, setLoginFormData] = useState({
        mobile_number: "",
        password: ""
    });
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated === 'true') {
            navigate('/dashboard');
        }
    }, [navigate]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
        console.log('loginFormData: ', loginFormData);
    };
    const handleLogin = () => {
        makeRequest({
            method: 'POST',
            url: 'https://3-extent-billing-backend.vercel.app/api/users/login',
            data: loginFormData,
            callback: (response) => {
                console.log('response: ', response);
                if (response.status === 200) {
                    console.log('response.data: ', response.data);
                     localStorage.setItem('isAuthenticated', 'true');
                    console.log("Success");
                    navigate('/dashboard');
                } else {
                    console.log("login failed");
                }
            }
        })
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
                            name="mobile_number"
                            placeholder="Enter your mobile number"
                            inputClassName="w-full"
                            value={loginFormData.mobile_number}
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







