import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";
// used to authenticate requests by verifying the JWT
// (JSON Web Token) provided in the access_token header


//pipeline
export default (req: any, res: any, next: any) => {
    const token = req.headers.access_token as string;//token from headers
    if(!token) return res.status(HTTP_UNAUTHORIZED).send();

    try {
        const decodedUser = verify(token, process.env.JWT_SECRET!);//jwt requires try catch
        req.user = decodedUser;

    } catch (error) {
        res.status(HTTP_UNAUTHORIZED).send();
    }

    return next();
}