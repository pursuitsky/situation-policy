import axios from 'axios'

const Util = {
	imgPath: 'http://127.0.0.1:8011/img',
	apiPath: 'http://127.0.0.1:8080/'
}

Util.ajax = axios.create({
	baseURL: Util.apiPath
})

Util.ajax.interceptors.response.use(res => {
	return res.data
})

export default Util