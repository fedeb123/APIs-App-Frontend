import { useEffect, useState } from "react";

const apiUrl  = import.meta.env.VITE_APP_API_URL

export default function useFetch(location, data = null, token = null) {
    
    const [loading, setLoading] = useState(true)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)

    let options = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }

    const method = data ? 'POST' : 'GET'
    const url = `${apiUrl}/${location}`

    if (data) {
        options.method = method
        options.body = JSON.stringify(data)
    }

    if (token) {
        options.headers.Authorization = `Bearer ${token}`
    }

    useEffect(() => {
        setLoading(true)
        fetch(url, options)
        .then((responseData) => responseData.json())
        .then((responseJson) => {
            setResponse(responseJson)
            setLoading(false)
        })
        .catch((error) => {
            setError(error)
            setLoading(false)
        })
    }, [location, token])

    return { response, loading, error}
}