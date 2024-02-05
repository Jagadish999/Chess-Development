import { ChangeEvent, FormEvent, useState } from "react";
import { RegisterUserInfo } from "../../models/model";

export default function RegisterForm() {

    const [userInfo, setUserInfo] = useState<RegisterUserInfo>({
        fullName: "",
        email: "",
        password: ""
    });

    const handleFormSubmission = (e: FormEvent) => {

        e.preventDefault();
        console.log("Register Form Submitted");
        console.log(userInfo);
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>, action: string) => {

        if(action === "name"){
            setUserInfo(prevValue => {
                prevValue.fullName = e.target.value
                return prevValue;
            });
        }
        else if(action === "email"){
            setUserInfo(prevValue => {
                prevValue.email = e.target.value
                return prevValue;
            });
        }
        else if(action === "password"){
            setUserInfo(prevValue => {
                prevValue.password = e.target.value
                return prevValue;
            });
        }
        
    };

    return (
        <form onSubmit={handleFormSubmission}>

            <div>
                <label htmlFor="fullName">Full Name</label>
                <input
                    onChange={(e) => { handleInputChanges(e, "name") }}
                    type="text"
                    name="fullName"
                    id="fullName"
                    placeholder="Enter Full Name"
                    required
                />
            </div>


            <div>
                <label htmlFor="email">Email</label>
                <input
                    onChange={(e) => { handleInputChanges(e, "email") }}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Your email"
                    required
                />
            </div>

            <div>
                <label htmlFor="passowrd">Password</label>
                <input
                    onChange={(e) => { handleInputChanges(e, "password") }}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter Your Password"
                    required
                />
            </div>

            <div>
                <input type="submit" className="w-[10%] h-[100%] bg-[rgba(33,33,33,0.9)] text-white" />
            </div>
        </form>
    );
}