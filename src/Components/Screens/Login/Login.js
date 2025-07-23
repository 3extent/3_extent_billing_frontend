import { useNavigate } from 'react-router-dom';
import billingimage from '../../../Assets/billingimage.webp';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useState } from 'react';
export default function Login() {
    const navigate = useNavigate();
    const [loginFormData, setLoginFormData] = useState({
        mobileNumber: "",
        password: ""
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
        console.log('loginFormData: ', loginFormData);
    };
    const handleLogin = () => {
        navigate('/dashboard');
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
                            onChange={(e) => {
                                const input = e.target.value.replace(/\D/g, '');
                                if (input.length <= 10) {
                                    setLoginFormData({ ...loginFormData, mobileNumber: input });
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







