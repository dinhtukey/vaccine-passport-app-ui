import axiosClient from "./axiosClient";

const vaccineApi = {
    getAll: () => axiosClient.get(
        'vaccine'
    ),
    create: (params) => axiosClient.post(
        'vaccine',
        params
    ),
    getOne: (id) => axiosClient.get(
        `vaccine/${id}`
    ),
    update: (id, params) => axiosClient.put(
        `vaccine/${id}`,
        params
    ),
    delete: (id) => axiosClient.delete(
        `vaccine/${id}`
    )
}

export default vaccineApi