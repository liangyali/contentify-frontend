import {
    Message
} from 'element-ui'

export default function ({ $axios }) {
    $axios.onResponse(response => {
        if (response.data && response.data.code != 200 && response.data.msg) {
            Message({
                message: response.data.msg,
                type: 'error',
                duration: 3 * 1000
            });
        }
        return Promise.resolve(response);
    })

    $axios.onError(error => {
        if (error.response.status === 500) {
            Message({
                message: '服务器内部错误,请刷新界面后重试',
                type: 'error',
                duration: 3 * 1000
            });
        }
    })
}