import coordtransform from "coordtransform";
export const menuEach = (list, menu, level) => {
    if (menu.parentId !== 0) {
        list.map(v => {
            if (v.id === menu.parentId) {
                level.push(v);
                menuEach(list, v, level);
            }
        });
    }
}

// 菜单递归遍历
export const menuRecursion = (list, cur) => {
    let menus = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].parentId === cur.id) {
            menus.push({
                index: list[i],
                value: menuRecursion(list, list[i])
            });
        }
    }
    return menus;
}

export const routeUrl = (url) => {
    return (url || '').includes('http') ? `/frame/?url=${url}` : '/' + url;
}

export function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}

export const toBD09ForList = (locations) => {
    const tmp = [];

    for (const location of locations) {
        const point = coordtransform.gcj02tobd09(
            location.longitude,
            location.latitude
        );
        tmp.push({
            ...location,
            longitude: point[0],
            latitude: point[1],
        });
    }
    return tmp;
}

export const toBD09ForItem = (location) => {

    const point = coordtransform.gcj02tobd09(
        location.longitude,
        location.latitude
    );
    return {
        ...location,
        longitude: point[0],
        latitude: point[1],
    }
}

export const toGCJ02ForItem = (location) => {

    const point = coordtransform.bd09togcj02(
        location.longitude,
        location.latitude
    );
    return {
        ...location,
        longitude: point[0],
        latitude: point[1],
    }
}

