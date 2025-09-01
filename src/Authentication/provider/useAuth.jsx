import { useContext } from "react";
import { AuthContext } from "./Authprovider";

export const useAuth = () => {
    const auth = useContext(AuthContext);
    return auth;
};