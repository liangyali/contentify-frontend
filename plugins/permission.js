import Vue from 'vue'

export default function ({ store }) {

    function checkPermission(el, binding) {
        const { value } = binding
        const roles = store.state.auth.user && (store.state.auth.user.permissionValues || [])
        if (value && value instanceof Array) {
            const permissionRoles = value
            const hasPermission = roles.some(role => {
                return (permissionRoles || []).includes(role)
            })

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
            return
        }

        throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
    Vue.directive('permission', {
        inserted(el, binding) {
            checkPermission(el, binding)
        },
        update(el, binding) {
            checkPermission(el, binding)
        }
    })
}






