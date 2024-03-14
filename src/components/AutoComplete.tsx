import { ChangeEvent, useState, useRef, useEffect } from 'react'
import { debounce } from 'lodash'
import { MagnifyingGlass, CircleNotch } from '@phosphor-icons/react'
import { searchLocation } from '../api/map'
import { IAutocomplete } from '../interfaces'

export function AutoComplete({ defaultValue = '', onSelectAddress }: IAutocomplete) {
    const [locations, setLocations] = useState([])
    const [selected, setSelected] = useState<string | undefined>()
    const [loading, setLoading] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)

    const divRef = useRef<HTMLDivElement>(null)

    const debounceSearch = debounce(async (location: string) => {
        const { data } = await searchLocation(location)

        setLocations(data.suggestions ? data.suggestions : [])

        if (data.suggestions.length > 1) {
            setShow(true)
        }

        setLoading(false)
    }, 500)

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setSelected(target.value)
        if (target.value.length > 3) {
            setLoading(true)

            debounceSearch(target.value)
        } else {
            setLoading(false)
            setShow(false)
        }
    }

    const handleSelect = (data: any) => {
        setSelected(data?.placePrediction?.text.text)
        onSelectAddress(data?.placePrediction?.text.text)
        setShow(false)
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (divRef.current && !divRef.current.contains(event.target as Node)) {
            setShow(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className='autocomplete-container'>
            <div className='autocomplete-input-container'>
                <input
                    type='text'
                    onChange={handleChange}
                    className='autocomplete-input'
                    placeholder='Pesquise o endereço do cliente'
                    value={selected}
                    defaultValue={defaultValue}
                />

                <div className='autocomplete-input-icon'>
                    {
                        loading
                            ? <CircleNotch size={18} className='loading-icon' />
                            : <MagnifyingGlass size={18} />
                    }
                </div>
            </div>
            {
                show && (
                    <div
                        ref={divRef}
                        className='autocomplete-list-container'

                    >
                        <ul className='autocomplete-list'>
                            {
                                locations.map((data: any) => {
                                    return (
                                        <li
                                            className='autocomplete-list-item'
                                            onClick={() => handleSelect(data)}
                                        >
                                            {data?.placePrediction?.text.text}
                                        </li>

                                    )
                                })
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    )
}