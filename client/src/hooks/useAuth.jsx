import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


// Este hook sirve para llamar al contexto y poder usarlo
export default function useAuth() {
    return useContext(AuthContext)
}