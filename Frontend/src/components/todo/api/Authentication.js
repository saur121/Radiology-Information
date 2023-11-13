import { apiClient } from "./ApiClient"


/* =========== BASIC AUTHENTICATION USING CREDENTIALS ===========*/
export const excuteJwtAuthentiationService = 
    (username,password) => apiClient.post('/authenticate',{username,password}) 