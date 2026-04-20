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
  async getMembers(params = {}) {
    const response = await apiClient.get('/api/members', {
      params: { populate: '*', ...params }
    })
    return response.data.data
  },

  async getMember(documentId) {
    const response = await apiClient.get(`/api/members/${documentId}`, {
      params: { populate: '*' }
    })
    return response.data.data
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
      params: { sort: 'date:desc', ...params }
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
  }
}

