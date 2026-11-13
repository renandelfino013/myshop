import { useState } from 'react'
import { AddForm } from './addForm/addForm.component'
export function AddProduct() {
  const [open, setOpen] = useState(false)

  function openMenu() {
    setOpen(true)
  }

  function closeMenu() {
    setOpen(false)
  }
  return (
    <>
      <div
        className="text-white bg-gradient-to-b  from-blue-500 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
        onClick={openMenu}
      >
        +
      </div>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={closeMenu} />
      )}
      {open && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full h-full    overflow-auto">
          <AddForm />
        </div>
      )}
    </>
  )
}
