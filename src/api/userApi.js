import axiosClient from "./axiosClient";

const userApi = {
    getAll: () => axiosClient.get(
        'user'
    ),
    create: (params) => axiosClient.post(
        'user',
        params
    ),
    getOne: (id) => axiosClient.get(
        `user/${id}`
    ),
    update: (id, params) => axiosClient.put(
        `user/${id}`,
        params
    ),
    vaccinated: (params) => axiosClient.post(
        'user/vaccinated',
        params
    )
}

export default userApi