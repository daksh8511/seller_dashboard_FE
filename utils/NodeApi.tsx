import axios from 'axios'

const NodeApi = axios.create({
    baseURL: import.meta.env.NEXT_API_URI,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default NodeApi