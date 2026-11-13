import Image from 'next/image'
export function Cart() {
  return (
    <Image
      src={`/assets/cart/cart-icon-white.png`}
      alt="Logo"
      className="w-6 h-auto border-zinc-400   "
      style={{ cursor: 'pointer' }}
      width={20}
      height={20}
    />
  )
}
