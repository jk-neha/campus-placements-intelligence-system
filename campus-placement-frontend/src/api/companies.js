import api from './axios'

export const getCompanies = async () => {
  const { data } = await api.get('/company')
  return data
}

export const createCompany = async (payload) => {
  const { data } = await api.post('/company', payload)
  return data
}

export const updateCompany = async (id, payload) => {
  const { data } = await api.put(`/company/${id}`, payload)
  return data
}

export const deleteCompany = async (id) => {
  const { data } = await api.delete(`/company/${id}`)
  return data
}
