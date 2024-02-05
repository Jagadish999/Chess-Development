import { ChangeEvent, FormEvent, useState } from "react"
import { LoginUserInfo } from "../../models/model";

export default function LoginForm() {

    const [userInfo, setUserInfo] = useState<LoginUserInfo>({
        email: "",
        password: "",
    });

    const handleFormSubmission = (e: FormEvent) => {

        e.preventDefault();
        console.log("Login Form Submitted");
        console.log(userInfo);
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>, action: string) => {

        if (action === "email") {
            setUserInfo(prevValue => {
                prevValue.email = e.target.value
                return prevValue;
            });
        }
        else if (action === "password") {
            setUserInfo(prevValue => {
                prevValue.password = e.target.value
                return prevValue;
            });
        }
    };

    return (
        <form onSubmit={handleFormSubmission}>

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