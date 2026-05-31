// ═══════════════════════════════════════════════════════════
// api.js — Communication avec le backend FastAPI
// ═══════════════════════════════════════════════════════════

import axios from 'axios'

const API = axios.create({ baseURL: '/api' })

export const getHealth       = ()       => API.get('/health')
export const getMetrics      = ()       => API.get('/model_metrics')
export const predire         = (data)   => API.post('/predict', data)
export const predireBatch    = (liste)  => API.post('/batch_predict', { transactions: liste })