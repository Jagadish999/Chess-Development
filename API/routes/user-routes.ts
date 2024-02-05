import { Router, Response, Request } from "express";

const userRoutes: Router = Router();

userRoutes.post('/register', (req: Request, res: Response) => {

    const fullName: string | undefined = req.body.fullName;
    const email: string | undefined = req.body.email;
    const password: string | undefined = req.body.password;
    
    //Basic Input validations
    if(!fullName || !email || !password){
        return res.status(422).send("Invalid Inputs");
    }

    res.status(200).send("User Registered");
});

userRoutes.post('/login', (req: Request, res: Response) => {

    const email: string | undefined = req.body.email;
    const password: string | undefined = req.body.password;

    //Basic Input validations
    if(!email || !password){
        return res.status(422).send("Invalid Inputs");
    }

    res.status(200).send("User Can Login");
});



export default userRoutes;
