import { FieldError } from 'components/errors/form-errors/field-error'
import { useState } from 'react'

interface MyselectProps<T> {
  title: string
  items: T[] | undefined
  getKey: (item: T) => string | number
  getLabel: (item: T) => string
  onSelect: (item: T) => void
  addItem: (name: string) => Promise<unknown>
  checkfn: (value: string) => void | string | undefined
}
export function Myselect<T>({
  title,
  items,
  getKey,
  getLabel,
  onSelect,
  addItem,
  checkfn,
}: MyselectProps<T>) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const [alreadyExiststate, setalreadyExiststate] = useState(false)
  function openMenu() {
    setOpen(true)
  }
  function closeMenu() {
    setOpen(false)
  }

  function alreadyexistfn(input) {
    const Exist = items.some(
      (item) =>
        getLabel(item).trim().toLowerCase() === input.trim().toLowerCase()
    )
    if (Exist) {
      setalreadyExiststate(true)
      return true
    }
    return false
  }
  const filtered = items?.filter((item) =>
    getLabel(item).toLowerCase().includes(search.toLowerCase())
  )
  const placeholder = `Nome da nova ${title}`
  return (
    <div
      className="absolute z-20 w-9/10 h-2/3 bg-white  border-gray-600 p-3 flex flex-col scrollbar-none rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-row  text-center justify-between  text-black font-medium text-xl p-3">
        <div className=""> {title}</div>
        <div className=" content-around " onClick={openMenu}>
          +
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="search"
          className="border border-gray-300 w-full rounded-lg p-1 ring-0 focus:outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border border-gray-100 shadow rounded-lg p-3 flex-1 min-h-0 overflow-auto mt-1 scrollbar-none">
        {open && (
          <>
            <div
              className="flex flex-row gap-1  items-baseline content-center "
              onBlur={() => {
                closeMenu()
                setError(false)
                setalreadyExiststate(false)
              }}
            >
              <input
                type="text"
                className="text-left w-full p-2 border border-gray-500 mb-3 rounded-lg bg-gray-10 text-gray-600 outline-0"
                placeholder={placeholder}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    let input = e.currentTarget.value
                    const result = checkfn(input)
                    if (result) {
                      return setError(true)
                    }
                    try {
                      setError(false)
                      const duplicated = alreadyexistfn(input)
                      if (duplicated !== true) await addItem(input)
                      else {
                        return setalreadyExiststate(true)
                      }
                      setalreadyExiststate(false)

                      setOpen(false)
                      // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (err) {
                      setalreadyExiststate(true)
                    }
                  }
                }}
              />
              <div
                className="text-center w-2/15 border   h-full p-2 border-gray-400 rounded-lg shadow bg-red-600/90 text-white"
                onClick={closeMenu}
              >
                x
              </div>
            </div>
          </>
        )}
        {alreadyExiststate && <FieldError message="já existente" />}
        {error && (
          <FieldError message="o nome precisa ter ao menos 3 caracteres" />
        )}
        {filtered?.map((item) => (
          <div
            onClick={() => onSelect(item)}

            className="text-left w-full p-2 border border-gray-500 mb-2 rounded-lg bg-gray-100 text-gray-600"
            key={getKey(item)}
          >
            {getLabel(item)}
          </div>
        ))}
      </div>
    </div>
  )
}
