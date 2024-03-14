import { useState, useEffect } from 'react'
import { Plus, Trash, Pencil } from '@phosphor-icons/react'
import { Alert, Maps, Modal } from './components'
import { getClientes, postCliente, deleteCliente, putCliente } from './api/clientes'
import { IAlert, ISelectWaypoint, IGetCliente, IModalForm } from './interfaces'

export default function App() {
    const [clientes, setClientes] = useState<IGetCliente[]>([])
    const [modal, setModal] = useState<any>({ show: false })
    const [waypoints, setWaypoints] = useState<Array<ISelectWaypoint>>([])
    const [alert, setAlert] = useState<IAlert>({ show: false })
    const [loading, setLoading] = useState<boolean>(true)
    const [selecteds, setSelecteds] = useState<string[]>([])
    const [filter, setFilter] = useState<string>('')

    const handleSetWaypoints = ({ id, lat, lng }: ISelectWaypoint) => {
        if (Array.isArray(waypoints)) {
            const isAlreadySet = waypoints.some((data) => data.id == id)

            setWaypoints((prev) => {
                if (isAlreadySet) {
                    return prev.filter((data) => data.id != id)
                }

                return [...prev, { id, lat, lng }]
            })
        }
    }

    const selectedId = (id: string) => selecteds.some((selectId) => selectId == id)

    const data = clientes.filter(({ email, nome }) => email.includes(filter) || nome.includes(filter) || nome.toLowerCase().includes(filter) || email.toLowerCase().includes(filter))

    const handleSelected = (id: string) => {
        setSelecteds(prev => {
            if (prev.includes(id)) {
                return prev.filter(i => i !== id)
            }

            return [...prev, id]
        })
    }

    const handleAlert = ({ message, type }: IAlert) => {
        setAlert({ show: true, message, type })

        setTimeout(() => {
            setAlert({ show: false })
        }, 3000)
    }

    const getAllClientes = () => {
        getClientes()
            .then(({ data }) => {
                setClientes(data.data)
                setLoading(false)

            })
            .catch(res => {
                handleAlert({
                    message: res.response.data,
                    type: 'error'
                })
                setLoading(false)
            })
    }

    const createCliente = async (data: IModalForm) => {
        postCliente(data)
            .then(res => {
                handleAlert({
                    message: res.data,
                    type: 'success'
                })
                setModal({ show: false })
                getAllClientes()
            })
            .catch(res => {
                handleAlert({
                    message: res.response.data,
                    type: 'error'
                })
            })
    }

    const editCliente = async (data: IModalForm) => {
        putCliente(data)
            .then(res => {
                handleAlert({
                    message: res.data,
                    type: 'success'
                })
                setModal({ show: false })
                getAllClientes()
            })
            .catch(res => {
                handleAlert({
                    message: res.response.data,
                    type: 'error'
                })
            })
    }

    const removeCliente = async (data: IModalForm) => {
        deleteCliente(data.id)
            .then(() => {
                handleAlert({
                    message: 'Cliente removido com sucesso',
                    type: 'success'
                })
                setModal({ show: false })
                getAllClientes()
            })
            .catch(res => {
                handleAlert({
                    message: res.response.data,
                    type: 'error'
                })
            })
    }

    useEffect(() => {
        getAllClientes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main>
            <h1>Facilita Jurídico</h1>

            <section className='main-container'>
                <Maps waypointLocations={waypoints} />
                <div className='cliente-container'>
                    <h2>Clientes</h2>
                    <p>Selecione clientes para montarmos a melhor rota possível.</p>

                    <div className='cliente-list'>
                        {
                            loading
                                ? <span>Carregando clientes...</span>
                                : <>
                                    {
                                        clientes.length == 0
                                            ? (
                                                <div>
                                                    <span>Nenhum cliente cadastrado.</span>
                                                    <span
                                                        className='add-cliente-link'
                                                        onClick={() => {
                                                            setModal({
                                                                show: true,
                                                                onSubmit: createCliente,
                                                            })
                                                        }}
                                                    >
                                                        Clique aqui para adicionar um cliente.
                                                    </span>
                                                </div>
                                            )
                                            : (
                                                <div className='cliente-list-container'>
                                                    <button
                                                        type='button'
                                                        className='btn-primary'
                                                        onClick={() => {
                                                            setModal({
                                                                show: true,
                                                                onSubmit: createCliente,
                                                            })
                                                        }}
                                                    >
                                                        <Plus size={18} /> Cliente
                                                    </button>

                                                    <input
                                                        type='text'
                                                        placeholder='Prucure pelo email ou nome do cliente'
                                                        onChange={({ target }) => setFilter(target.value)}
                                                    />

                                                    <div className='card-list-body'>
                                                        {
                                                            data.map(({ nome, email, id, endereco, telefone }) => {
                                                                const [rua, bairro] = endereco.rua.split(',')

                                                                return (
                                                                    <div
                                                                        key={id}
                                                                        className={`card-list ${selectedId(id) ? 'selected-card' : ''}`}
                                                                        onClick={() => {
                                                                            handleSelected(id)
                                                                            handleSetWaypoints({ id, lat: endereco.lat, lng: endereco.lng })
                                                                        }}
                                                                    >
                                                                        <div className='card-list-header'>
                                                                            <span>{nome}</span>

                                                                            <div
                                                                                className='card-list-icons'
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <Pencil
                                                                                    size={24}
                                                                                    onClick={() => {
                                                                                        setModal({
                                                                                            show: true,
                                                                                            onSubmit: editCliente,
                                                                                            id: id,
                                                                                            defaultData: {
                                                                                                id,
                                                                                                nome,
                                                                                                email,
                                                                                                telefone,
                                                                                                endereco
                                                                                            }
                                                                                        })
                                                                                    }}
                                                                                />

                                                                                <Trash
                                                                                    size={24}
                                                                                    onClick={() => {
                                                                                        setModal({
                                                                                            show: true,
                                                                                            onSubmit: removeCliente,
                                                                                            isDelete: true,
                                                                                            defaultData: { id }
                                                                                        })
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <span>{email}</span>
                                                                        <small>{rua + bairro}</small>
                                                                        {telefone && <small>(41) {telefone}</small>}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                    }
                                </>
                        }
                    </div>
                </div>
            </section>

            {alert.show && <Alert message={alert.message} type={alert.type} />}

            {
                modal?.show && (
                    <Modal
                        onClose={() => setModal({ show: false })}
                        onSubmit={modal.onSubmit}
                        id={modal.id}
                        isDelete={modal.isDelete}
                        defaultData={modal.defaultData}
                    />
                )
            }
        </main>
    )
}