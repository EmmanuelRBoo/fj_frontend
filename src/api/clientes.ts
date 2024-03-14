import { api } from '.'
import { IPostCliente, IPutCliente } from '../interfaces/clientes'

export const getClientes = async () => {
    return await api.get('/cliente')
}

export const postCliente = async (data: IPostCliente) => {
    return await api.post('/cliente', data)
}

export const putCliente = async (data: IPutCliente) => {
    return await api.put(`/cliente/${data.id}`, data)
}

export const deleteCliente = async (id?: string) => {
    return await api.delete(`/cliente/${id}`)
}