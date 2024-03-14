import { IAlert } from '../interfaces'

export function Alert({ message, type }: IAlert) {

    return (
        <div className={`alert alert-${type}`}>
            <p>{message}</p>
        </div>
    )
}