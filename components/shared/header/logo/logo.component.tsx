import Link from 'next/link'
import Image from 'next/image'
export function Logo() {
  return (
    <Link href="/homepage" className="text-white text-lg font-bold min-w-8.75">
      <Image
        src="/assets/logo.png"
        alt="Logo"
        className="w-auto h-8"
        onClick={() => {}}
        style={{ cursor: 'pointer' }}
        width={20}
        height={20}
      />
    </Link>
  )
}
