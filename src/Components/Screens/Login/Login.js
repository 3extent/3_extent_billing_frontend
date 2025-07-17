import { useNavigate } from 'react-router-dom';
import billingimage from '../../../Assets/billingimage.webp';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login() {
    const navigate = useNavigate();
    const [loginFormData, setLoginFormData] = useState({
        mobileNumber: "",
        password: ""
    });
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === "mobileNumber") {
            const digitsOnly = value.replace(/\D/g, '');

            // Show toast if more than 10 digits tried
            if (digitsOnly.length > 10) {
                toast.error("Mobile number cannot exceed 10 digits.");
                return;
            }

            setLoginFormData({ ...loginFormData, [name]: digitsOnly });
        } else {
            setLoginFormData({ ...loginFormData, [name]: value });
        }
    };


    const handleLogin = () => {
        const { mobileNumber, password } = loginFormData;

        if (!mobileNumber && !password) {
            toast.error(' Please fill out all the fields.');
            return;
        }
        if (mobileNumber.length !== 10) {
            toast.error('Mobile number must be exactly 10 digits.');
            return;
        }
        if (!password) {
            toast.error('please enter valid password.');
            return;
        }

        toast.success('Login successful!');
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
                            onChange={handleInputChange}
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
                                onClick={handleLogin}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true}
                closeButton={false}
            />
        </div>

    );
}







