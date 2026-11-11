type FieldErrorProps = { message?: string }

export function FieldError({ message }: FieldErrorProps) {
  return (
    <p className="text-red-600  text-[13px] capitalize leading-4 p-1">
      ❌ {message}
    </p>
  )
}
