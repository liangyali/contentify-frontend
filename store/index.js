import {
    menuEach,
    menuRecursion
} from '~/utils'
import Cookie from 'js-cookie'

export const state = () => ({
    menusList: [],
    curMenu: null,
    breadcrumb: [],
    menuLoading: false,
})

export const getters = {
    menus(state) {
        let list = state.menusList;
        let menus = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].parentId === 0) {
                menus.push({
                    index: list[i],
                    value: menuRecursion(list, list[i])
                })
            }
        }
        return menus;
    },
    menuActive(state) {
        return state.curMenu ? state.curMenu.menuId + '' : '0-0'
    }
}

export const mutations = {
    setToken(state, token) {
        state.token = token;
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    },
    removeToken(state) {
        state.token = '';
        Cookie.remove('__token')
        request.defaults.headers.common['token'] = '';
    },
    setMenus(state, menu) {
        state.menusList = menu;
    },
    setCurrentUser(state, user) {
        state.currentUser = user;
    },
    setMenuLoading(state, loading) {
        state.menuLoading = loading;
    },
    setCurMenu(state, route) {
        if (route.name === 'index') {
            state.curMenu = null;
            return;
        }
        let menus = state.menusList;
        for (let i = 0; i < menus.length; i++) {
            if (route.path.slice(1) === menus[i].uri) {
                state.curMenu = menus[i];
                break;
            }
        }
    },
    setBreadcrumb(state) {
        let level = [];
        if (state.curMenu) {
            level.push(state.curMenu);
            menuEach(state.menusList, state.curMenu, level);
            state.breadcrumb = level.reverse();
        } else {
            state.breadcrumb = [];
        }
    },
    setTagsView(state) {
        if (state.curMenu) {
            let flag = true;
            state.tagsView.map(v => {
                v.id === state.curMenu.id && (flag = false);
            })
            flag && state.tagsView.push(state.curMenu);
        }
    },
    removeTagView(state, menu) {
        let i = state.tagsView.indexOf(menu);
        console.log('i', i);
        if (i !== -1) {
            state.tagsView.splice(i, 1);
        }
    }
}

export const actions = {
    async getMenus({
        commit
    }) {
        commit('setMenuLoading', true)
        try {
            let { data } = await this.$axios.get('/admin/api/v1/menu');
            commit('setMenuLoading', false)
            data && commit('setMenus', data.data);

        } catch (e) {
            commit('setMenuLoading', false)
            commit('setMenus', []);
        }

    }
}
