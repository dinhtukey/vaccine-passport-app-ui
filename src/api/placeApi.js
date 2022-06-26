import axiosClient from "./axiosClient";

const placeApi = {
    getAll: () => axiosClient.get(
        'place'
    ),
    create: (params) => axiosClient.post(
        'place',
        params
    ),
    getOne: (id) => axiosClient.get(
        `place/${id}`
    ),
    update: (id, params) => axiosClient.put(
        `place/${id}`,
        params
    ),
    delete: (id) => axiosClient.delete(
        `place/${id}`
    )
}

export default placeApi