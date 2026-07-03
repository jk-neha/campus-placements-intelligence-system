import api from './axios'

// Backend /login uses OAuth2PasswordRequestForm, which requires
// x-www-form-urlencoded body with "username" and "password" fields
// (username carries the email here).
export const loginRequest = async (email, password) => {
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)

  const { data } = await api.post('/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export const registerRequest = async ({ user_name, user_mail, password, role }) => {
  const { data } = await api.post('/register_user', {
    user_name,
    user_mail,
    password,
    role,
  })
  return data
}

export const fetchProfile = async () => {
  const { data } = await api.get('/profile')
  return data
}
