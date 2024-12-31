import Jwt, { JwtPayload} from "jsonwebtoken";

export const generateJWT = (payload: JwtPayload): string => {
    const token = Jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "180d"
    });
    return token;
}
