export function Searchbar() {
  return (
    <div className="flex w-full items-center gap-2 border-b border-white focus-within:border-b-0">
      <input
        type="text"
        className="w-full bg-transparent p-1 text-xs text-white placeholder:text-gray-300 focus:bg-white focus:text-black focus:shadow focus:placeholder:text-gray-500  focus:outline-none rounded-xs transition-all "
        placeholder="Search..."
      />
    </div>
  )
}
