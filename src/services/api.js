import axios from "axios"

const API_URL = "http://192.168.100.17:8000"; // la IP de red local de tu PC


// Para depurar, añade un timeout más largo
axios.defaults.timeout = 10000 // 10 segundos

const api = {
  // Obtener todos los eventos
  getEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/events/`)
      return response.data
    } catch (error) {
      console.error("Error al obtener eventos:", error.message)
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

  // NUEVO: Marcar/desmarcar evento como completado
  toggleEventComplete: async (id, completed) => {
    try {
      const response = await axios.patch(`${API_URL}/events/${id}/toggle-complete`, {
        completed: completed,
      })
      return response.data
    } catch (error) {
      console.error(`Error al cambiar estado del evento ${id}:`, error)
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
