import { useEffect, useState } from "react";

const apiUrl  = import.meta.env.VITE_APP_API_URL

export default function useFetch(location, method, data = null, token = null) {
    
    const [loading, setLoading] = useState(true)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    const [status, setStatus] = useState(null)
    const [ok, setOk] = useState(false)

    let options = {
        'method': method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }
    
    const url = `${apiUrl}/${location}`

    if (data) {
        options.body = JSON.stringify(data)
    }

    if (token) {
        options.headers.Authorization = `Bearer ${token}`
    }

    useEffect(() => {
        setLoading(true)

        if (method === 'POST' && !data) {
            return
        }

        fetch(url, options)
        .then((responseData) => responseData.json().then((responseJson) => ({responseData, responseJson})))
        .then(({responseData, responseJson}) => {                        
            if (!responseData.ok) {
                setError({ status: responseData.status, body: responseJson})
            } else {
                setResponse(responseJson)
            }
        })
        .catch((error) => {
            setError(error)
            setLoading(false)
        })
        .finally(() => setLoading(false))
    }, [location, token, JSON.stringify(data)])

    return { response, loading, error }
}