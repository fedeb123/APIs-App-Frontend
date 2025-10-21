import { useEffect, useState } from "react";
import useFetch from "./useFetch";

export default function useUser(token, refresh = false) {

    const [user, setUser] = useState(null)
    const { response, loading, error } = useFetch('usuarios/usuario', 'GET', null, token, refresh)

    useEffect(() => {
        if (error) {
            console.log(JSON.stringify(error))
        }
    }, [error])

    useEffect(() => {
        if (response) {
            setUser(response)
            localStorage.setItem('user', JSON.stringify(response))
        }
        
    }, [response])

    return { user, loading, error }
}