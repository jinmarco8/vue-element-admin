import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-XToken'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { response_status, response_message } = response.data

    // 除402（服务器端token过期），的所有情况都自动refresh复位
    // 返回码：402手工复位
    if (response_status !== '402') {
      store.dispatch('globals/changeSetting', {
        'key': 'isRefresh',
        'value': false })
    }

    // if the custom code is not 20000, it is judged as an error.
    if (response_status === '403') {
      Message({
        message: response_message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      /**
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }**/
      return Promise.reject(new Error(response_message || 'Error'))
    } else if (response_status === '401') {
      Message({
        message: response_message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(response_message || 'Error'))
    } else if (response_status === '402') {
      if (store.getters.isReFresh) {
        store.dispatch('globals/changeSetting', {
          'key': 'isRefresh',
          'value': false })
        // 如果是客户点击refresh按钮，当前页面已经不存在，因此直接返回登录页面报错
        // 将response_message中的402过滤掉,让外层permission可以正常消费
        return Promise.reject(new Error(response_message.replace('402', '') || 'Error'))
      }
      // 非客户refresh按钮，正常调整则弹框提示
      MessageBox.confirm('抱歉，登录超时, 请您重新登录', '提示信息', {
        confirmButtonText: '返回登录页面',
        cancelButtonText: '留在当前页',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          // const current_path = this.$route.path
          // if (current_path.indexOf('/login') !== -1) {
          location.reload()
          // }
        })
      })
      // Message({
      //   message: response_message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      store.dispatch('globals/changeSetting', {
        'key': 'isRefresh',
        'value': false })

      return Promise.reject(new Error(response_message || 'Error'))
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 6 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
