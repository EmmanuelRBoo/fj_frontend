import { IModal } from '.'

export interface IEndereco {
    lat: number
    lng: number
    rua: string
}

export interface ISelectWaypoint {
    lat: number
    lng: number
    id: string
}

export interface IClientes {
   clientes: IGetCliente[], 
   onSelect: (data: ISelectWaypoint) => void
   handleModal: (data: IModal) => void
}

export interface IGetCliente {
    id: string
    nome: string
    email: string
    telefone?: string
    endereco: IEndereco
}

export interface IPostCliente {
    nome: string
    email: string
    telefone?: string
    endereco: IEndereco
}

export interface IPutCliente {
    id?: string
    nome?: string
    email?: string
    telefone?: string
    endereco?: IEndereco
}