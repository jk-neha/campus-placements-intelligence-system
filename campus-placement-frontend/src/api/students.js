import api from './axios'

export const getStudents = async () => {
  const { data } = await api.get('/students')
  return data
}

export const createStudent = async (payload) => {
  const { data } = await api.post('/students', payload)
  return data
}

export const updateStudent = async (id, payload) => {
  const { data } = await api.put(`/students/${id}`, payload)
  return data
}

export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/students/${id}`)
  return data
}

export const uploadResume = async (file) => {
  const form = new FormData()
  form.append('file', file)
  const { data } = await api.post('/resume-upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getRecommendations = async (studentId) => {
  const { data } = await api.get(`/recommendations/${studentId}`)
  return data
}

export const getEligibilityReadiness = async (studentId) => {
  const { data } = await api.get(`/eligibility_readliness_status/${studentId}`)
  return data
}

export const checkEligibility = async (studentId, companyId) => {
  const { data } = await api.get(`/eligibility/${studentId}/${companyId}`)
  return data
}
