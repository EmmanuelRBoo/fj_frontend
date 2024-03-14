import { ChangeEvent, FormEvent, useState } from 'react'
import { X } from '@phosphor-icons/react'
import { IModal } from '../interfaces'
import { AutoComplete } from './AutoComplete'
import { getCoords } from '../api/map'


function ModalDelete() {
    return (
        <div className='modal-body-delete'>
            <p>Tem certeza que quer remover este cliente?</p>
            <p>Ele será removido permanentemente</p>
        </div>
    )
}

export function Modal({ onClose, onSubmit, isDelete, defaultData }: IModal) {
    const [form, setForm] = useState(defaultData)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()

        onSubmit && onSubmit(form)
    }

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setForm((prev: any) => {
            return {
                ...prev,
                [target.name]: target.value
            }
        })
    }

    const handleChangeAddress = (rua: string) => {
        getCoords(rua)
            .then(res => {
                const data = res.data[0]
                if (data) {
                    setForm((prev: any) => {
                        return {
                            ...prev,
                            endereco: {
                                lat: Number(data.lat),
                                lng: Number(data.lon),
                                rua
                            }
                        }
                    })
                }
            })
    }

    const handleCloseOnClickOverlay = (event: any) => {
        event.stopPropagation()
        event.preventDefault()

        onClose && onClose()
    }

    const title = () => {
        switch (true) {
            case isDelete: return 'Remover cliente'
            case defaultData?.id != null: return 'Editar dados cliente'
            default: return 'Adicionar cliente'
        }
    }

    return (
        <div
            className='modal-overlay'
            onClick={handleCloseOnClickOverlay}
        >
            <div
                className='modal-container'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='modal-header'>
                    <h3>{title()}</h3>

                    <X
                        className='close-icon'
                        onClick={onClose}
                        size={28}
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    {
                        isDelete
                            ? <ModalDelete />
                            : (
                                <div className='modal-body'>
                                    <label>
                                        Endereço
                                        <AutoComplete
                                            onSelectAddress={handleChangeAddress}
                                            defaultValue={defaultData?.endereco.rua}
                                        />
                                    </label>

                                    <label>
                                        Nome
                                        <input
                                            type='text'
                                            name='nome'
                                            placeholder='Nome do cliente'
                                            onChange={handleChange}
                                            defaultValue={defaultData?.nome}
                                        />
                                    </label>

                                    <label>
                                        Email
                                        <input
                                            type='email'
                                            name='email'
                                            placeholder='Email do cliente'
                                            onChange={handleChange}
                                            defaultValue={defaultData?.email}
                                        />
                                    </label>

                                    <label>
                                        Telefone
                                        <input
                                            type='text'
                                            name='telefone'
                                            placeholder='Telefone do cliente'
                                            onChange={handleChange}
                                            defaultValue={defaultData?.telefone}
                                        />
                                    </label>
                                </div>
                            )
                    }

                    <div className='modal-footer'>
                        <button
                            className={isDelete ? 'btn-danger' : 'btn-success'}
                            disabled={form == defaultData && !isDelete}
                            type='submit'
                        >
                            {isDelete ? 'Remover' : 'Salvar'}
                        </button>

                        {
                            !isDelete && (
                                <button
                                    className='btn-danger'
                                    type='button'
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}