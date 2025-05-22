import axios from "axios"

const API_URL = "http://localhost:8000"

// Para depurar, añade un timeout más largo
axios.defaults.timeout = 10000 // 10 segundos

const api = {
  // Obtener todos los eventos
  getEvents: async () => {
    try {
      console.log("Intentando conectar a:", API_URL)
      const response = await axios.get(`${API_URL}/events/`)
      console.log("Respuesta recibida:", response.data)
      return response.data
    } catch (error) {
      console.error("Error al obtener eventos:", error.message, error.response?.status)
      throw error
    }
  },

  // Obtener un evento específico
  getEvent: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener el evento ${id}:`, error)
      throw error
    }
  },

  // Crear un nuevo evento
  createEvent: async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}/events/`, eventData)
      return response.data
    } catch (error) {
      console.error("Error al crear evento:", error)
      throw error
    }
  },

  // Actualizar un evento existente
  updateEvent: async (id, eventData) => {
    try {
      const response = await axios.put(`${API_URL}/events/${id}`, eventData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar el evento ${id}:`, error)
      throw error
    }
  },

  // Eliminar un evento
  deleteEvent: async (id) => {
    try {
      await axios.delete(`${API_URL}/events/${id}`)
      return true
    } catch (error) {
      console.error(`Error al eliminar el evento ${id}:`, error)
      throw error
    }
  },
}

export default api
