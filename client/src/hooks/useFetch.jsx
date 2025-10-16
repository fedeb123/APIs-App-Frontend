import { useEffect, useState } from "react";

const apiUrl  = import.meta.env.VITE_APP_API_URL

export default function useFetch(location, method, data = null, token = null, refresh = false) {
    
    const [loading, setLoading] = useState(true)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)

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
            setLoading(false)
            return
        }

        if (!location) {
            setLoading(false)
            return
        }

        fetch(url, options)
        .then((responseData) => responseData.json().then((responseJson) => ({responseData, responseJson})))
        .then(({responseData, responseJson}) => {                        
            if (!responseData.ok) {
                console.log(responseData)
                setError({ status: responseData.status, body: responseJson.error})
            } else {
                setResponse(responseJson)
            }
        })
        .catch((error) => {
            setError(error)
            setLoading(false)
        })
        .finally(() => setLoading(false))
    }, [location, token, JSON.stringify(data), refresh])

    return { response, loading, error }
}