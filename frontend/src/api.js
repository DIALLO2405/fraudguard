import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL 
  || 'https://fraudguard-loca.onrender.com'

const API = axios.create({ baseURL: BASE_URL })

export const getHealth    = ()      => API.get('/health')
export const getMetrics   = ()      => API.get('/model_metrics')
export const predire      = (data)  => API.post('/predict', data)
export const predireBatch = (liste) => API.post('/batch_predict',
                              { transactions: liste })