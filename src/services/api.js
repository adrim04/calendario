// Configuración de la API para integración con el backend
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:8000/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Métodos para eventos
  async getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const endpoint = queryString ? `/events?${queryString}` : '/events'
    return this.request(endpoint)
  }

  async getEvent(eventId) {
    return this.request(`/events/${eventId}`)
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
  }

  async updateEvent(eventId, eventData) {
    return this.request(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData)
    })
  }

  async deleteEvent(eventId) {
    return this.request(`/events/${eventId}`, {
      method: 'DELETE'
    })
  }

  // Métodos para filtros y búsqueda
  async searchEvents(query) {
    return this.request(`/events/search?q=${encodeURIComponent(query)}`)
  }

  async getEventsByDateRange(startDate, endDate) {
    return this.request(`/events?start_date=${startDate}&end_date=${endDate}`)
  }

  // Método para manejar errores de red
  handleNetworkError(error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet.'
    }
    if (error.message.includes('404')) {
      return 'Recurso no encontrado.'
    }
    if (error.message.includes('500')) {
      return 'Error interno del servidor.'
    }
    return error.message || 'Error desconocido'
  }

  // Método para validar datos antes de enviar
  validateEventData(eventData) {
    const errors = []
    
    if (!eventData.title || eventData.title.trim().length === 0) {
      errors.push('El título es obligatorio')
    }
    
    if (!eventData.date) {
      errors.push('La fecha es obligatoria')
    }
    
    if (eventData.date && new Date(eventData.date) < new Date().setHours(0,0,0,0)) {
      errors.push('La fecha no puede ser en el pasado')
    }
    
    return errors
  }
}

export default new ApiService()
