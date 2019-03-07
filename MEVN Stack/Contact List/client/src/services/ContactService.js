import Api from '@/services/Api'

export default {
  fetchContacts (filter) {
    return Api().get('contacts/' + filter)
  },

  uploadImage (formData) {
    return Api().post('upload/', formData)
  },

  createContact (params) {
    return Api().post('contact', params)
  },

  updateContact (params) {
    return Api().put('contact/' + params.id, params)
  },

  fetchContact (params) {
    return Api().get('contact/' + params.id)
  },

  deleteContact (id) {
    return Api().delete('contact/' + id)
  }
}
