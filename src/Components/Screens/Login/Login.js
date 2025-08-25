import { useNavigate } from 'react-router-dom';
import billingimage from '../../../Assets/billingimage.webp';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useState } from 'react';
import { apiCall } from '../../../Util/AxiosUtils';

export default function Login({ onLoginSuccess }) {
    const navigate = useNavigate();
    const [loginFormData, setLoginFormData] = useState({
        contact_number: "",
        password: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginFormData({ ...loginFormData, [name]: value });
    };

    const getLoginCallBack = (response) => {
        console.log('response: ', response);
        if (response.status === 200) {
            localStorage.setItem('isAuthenticated', 'true');
            console.log("Success");
            // localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Call the callback to update parent state
            if (onLoginSuccess) {
                onLoginSuccess();
            }
            
            navigate('/salesbilling');
        } else {
            console.log("login failed");
        }
    }

    const handleLogin = () => {
        apiCall({
            method: 'POST',
            url: 'https://3-extent-billing-backend.vercel.app/api/users/login',
            data: loginFormData,
            callback: getLoginCallBack,
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
                            name="contact_number"
                            placeholder="Enter your mobile number"
                            inputClassName="w-full"
                            value={loginFormData.contact_number}
                            onChange={(e) => {
                                const input = e.target.value.replace(/\D/g, '');
                                if (input.length <= 10) {
                                    setLoginFormData({ ...loginFormData, contact_number: input });
                                }
                            }}
                            maxLength={10}
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
                                icon="fa fa-arrow-right"
                                iconPosition="right"
                                onClick={handleLogin}
                                buttonClassName="w-full py-2 px-5 text-xl font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}







