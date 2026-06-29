export const getToken = () => localStorage.getItem('teduhtech_token')

export const setToken = (token: string) => localStorage.setItem('teduhtech_token', token)

export const removeToken = () => localStorage.removeItem('teduhtech_token')

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
})
