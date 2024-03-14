import { IEndereco } from './clientes'

export interface IModalForm {
    id?: string
    nome: string
    email: string
    telefone?: string
    endereco: IEndereco
}

export interface IModal {
    id?: string
    show?: boolean
    isDelete?: boolean
    defaultData?: IModalForm 
    onClose?: () => void
    onSubmit?: (data: any) => void
}