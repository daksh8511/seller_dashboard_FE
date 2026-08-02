import axios from 'axios'

const NodeApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default NodeApi