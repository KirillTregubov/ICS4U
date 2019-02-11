import Api from '@/services/Api'

export default {
  fetchContacts () {
    return Api().get('contacts')
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
