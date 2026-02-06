import axios from 'axios'
import { ElMessage } from 'element-plus'

// Create axios instance
const service = axios.create({
  baseURL: '/api', // Use relative path to trigger proxy
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // You can add token here if needed
    // if (store.token) {
    //   config.headers['Authorization'] = 'Bearer ' + store.token
    // }
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // You can add custom business logic here
    return res
  },
  (error) => {
    console.error('Response Error:', error)
    
    let message = 'Unknown Error'
    if (error.response) {
      switch (error.response.status) {
        case 400: message = 'Bad Request'; break;
        case 401: message = 'Unauthorized'; break;
        case 403: message = 'Forbidden'; break;
        case 404: message = 'Not Found'; break;
        case 500: message = 'Internal Server Error'; break;
        default: message = `Error: ${error.response.status}`;
      }
    } else if (error.message) {
      message = error.message
    }

    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
