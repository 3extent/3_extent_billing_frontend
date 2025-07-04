import billingimage from '../../../Assets/billingimage.webp';
import InputComponent from "../../CustomComponents/InputComponent/InputComponent";
import PrimaryButtonComponent from "../../CustomComponents/PrimaryButtonComponent/PrimaryButtonComponent";

export default function Login() {
    return (
        <div className="w-[100%] h-screen flex">
            <div className="w-[50%] h-[100%]">
                <img className="w-full h-full object-cover" src={billingimage} />
            </div>
            <div className="w-[50%] h-[100%] flex items-center justify-center">
                <div className="text-center w-[70%] space-y-6">
                    <div className="text-3xl font-bold">Welcome To 3-EXTENT</div>
                    <div className="font-serif text-xl">Log in Your Account</div>
                    <div className="space-y-4">
                        <InputComponent
                            label="Mobile Number:"
                            type="text"
                            placeholder="Enter your mobile number"
                        />
                        <InputComponent
                            label="Password:"
                            type="password" 
                            placeholder="Enter your password"
                        />
                        <div>
                            <PrimaryButtonComponent
                                label="Login"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
}
