import { Router, Response, Request } from "express";

const userRoutes: Router = Router();

userRoutes.get('/users', (req: Request, res: Response) => {

    res.status(200).send("Hello World");
});

export default userRoutes;
