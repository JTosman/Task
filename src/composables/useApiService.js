import axios from "axios";
import environment from "src/envirorment";
import { useAuthStore } from "src/stores/auth";

const apiUrl = environment.host;

export default function useApiService() {

  const apiGet = async (url, auth) => {

    let response = null

    if (auth) {

      const auth = useAuthStore()

      return response = await axios.get(apiUrl + url, {
        headers: {
          'Authorization': 'Bearer ' + auth.token
        }
      })
    }

    return response = await axios.get(apiUrl + url)
  }

  const apiPost = async (url, data, auth) => {

    let response = null

    if (auth) {

      const auth = useAuthStore()

      return response = await axios.post(apiUrl + url, data, {
        headers: {
          'Authorization': 'Bearer ' + auth.token
        }
      })
    }

    return response = await axios.post(apiUrl + url, data)
  }

  return {
    apiGet,
    apiPost
  }
}
