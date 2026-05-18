import axios from 'axios'

const STRAPI_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337'

const apiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export { STRAPI_URL }

export default {
  async getMembers(params = {}, token = null) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const response = await apiClient.get('/api/members', {
      params: { 
        populate: '*',
        ...params 
      },
      headers
    })
    return response.data.data
  },

  async getMember(documentId) {
    const response = await apiClient.get('/api/members', {
      params: { 
        'filters[documentId][$eq]': documentId,
        populate: '*'
      }
    })
    return response.data.data?.[0] || null
  },

  async getArticles(params = {}) {
    const response = await apiClient.get('/api/articles', { params })
    return response.data.data
  },

  async getArticle(documentId) {
    const response = await apiClient.get(`/api/articles/${documentId}`, {
      params: { populate: '*' }
    })
    return response.data.data
  },

  async getCategories() {
    const response = await apiClient.get('/api/categories')
    return response.data.data
  },

  async getArticlesByCategory(categoryName, params = {}) {
    const response = await apiClient.get('/api/articles', {
      params: {
        'filters[category][name][$eq]': categoryName,
        populate: '*',
        sort: 'date:desc',
        ...params
      }
    })
    return response.data.data
  },

  async getGalleries(params = {}) {
    const response = await apiClient.get('/api/galleries', {
      params: { populate: '*', ...params }
    })
    return response.data.data
  },

  async postAspiration(data) {
    const response = await apiClient.post('/api/aspirations', { data })
    return response.data.data
  },

  async getFollowups(params = {}) {
    const response = await apiClient.get('/api/followups', {
      params: { sort: 'date:desc', populate: '*', ...params }
    })
    return response.data.data
  },

  async getEvents(params = {}) {
    const response = await apiClient.get('/api/events', {
      params: { sort: 'date:desc', populate: '*', ...params }
    })
    return response.data.data
  },

  async getLegislativeDocuments(type, params = {}) {
    const response = await apiClient.get('/api/legislative-documents', {
      params: {
        'filters[type][$eq]': type,
        sort: 'publish_date:desc',
        populate: '*',
        ...params
      }
    })
    return response.data.data
  },

  async getPansuses(params = {}) {
    const response = await apiClient.get('/api/pansuses', {
      params: {
        sort: 'publish_date:desc',
        populate: '*',
        ...params
      }
    })
    return response.data.data
  },

  async getPansus(documentId) {
    const response = await apiClient.get('/api/pansuses', {
      params: {
        'filters[documentId][$eq]': documentId,
        populate: '*'
      }
    })
    return response.data.data?.[0] || null
  },

  async getInternships(params = {}) {
    const response = await apiClient.get('/api/internships', {
      params: {
        sort: 'createdAt:desc',
        populate: '*',
        ...params
      }
    })
    return response.data.data
  },

  async getAspirationArticles(params = {}) {
    const response = await apiClient.get('/api/aspiration-articles', {
      params: { sort: 'date:desc', populate: '*', ...params }
    })
    return response.data.data
  },

  async getAspirationArticle(documentId) {
    const response = await apiClient.get('/api/aspiration-articles', {
      params: {
        'filters[documentId][$eq]': documentId,
        populate: '*'
      }
    })
    return response.data.data?.[0] || null
  },

  // ─── Auth ─────────────────────────────────────────────────────────
  async login(identifier, password) {
    const response = await apiClient.post('/api/auth/local', { identifier, password })
    return response.data
  },

  async getMe(token) {
    const response = await apiClient.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  // ─── Aspiration Article CRUD (authenticated) ──────────────────────
  async createAspirationArticle(data, token) {
    const response = await apiClient.post('/api/members/articles', { data }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async updateAspirationArticle(documentId, data, token) {
    const response = await apiClient.put(`/api/members/articles/${documentId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data.data
  },

  async deleteAspirationArticle(documentId, token) {
    const response = await apiClient.delete(`/api/members/articles/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  async uploadMedia(file, token) {
    const form = new FormData()
    form.append('files', file)
    const response = await apiClient.post('/api/members/upload', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data[0]
  }
}
