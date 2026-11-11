import { useRouter } from 'next/router'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { AddhookProduct } from 'hooks/products/products.hooks'
import { productSchema } from 'shared/schemas/products/products.schema'
import z from 'zod'
import { FieldError } from 'components/errors/form-errors/field-error'

type ProductFormInput = z.input<typeof productSchema>
type ProductFormOutput = z.output<typeof productSchema>
export function AddForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<ProductFormInput, undefined, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: { price: 0 },
  })

  return (
    <>
      <div className="w-full h-full  justify-center bg-white text-black p-1  z-60 overflow-auto scrollbar-none">
        <div
          onClick={useRouter().reload}
          className="bg-blue-500 hover:bg-blue-300 text-zinc-200 font-bold py-2 px-4 border-b-4 rounded-2xl flex flex-row items-center w-fit gap-2"
        >
          <Image
            src="/assets/products/arrow/left-arrow-white.png"
            alt="back arrow"
            className="w-4 h-4 shadow-2xl rounded-lg"
            style={{ cursor: 'pointer' }}
            width={20}
            height={20}
            quality={90}
          />
          <button>Voltar</button>
        </div>

        <section className="flex flex-col gap-2 w-full h-full justify-center items-center ">
          <span className="font-bold text-3xl">Cadastro de produto</span>
          <form
            onSubmit={handleSubmit(AddhookProduct)}
            method="POST"
            className="flex flex-col gap-6 w-full h-full  border border-gray-300 rounded-lg p-4 shadow-lg text-[1.2rem]"
          >
            {/* nome*/}
            <section>
              <div className="flex flex-row gap-2 w-full text-black items-center ">
                <label className="font-semibold text-zinc-500" htmlFor="nome">
                  Nome:
                </label>
                <input
                  className="border border-gray-300 rounded-lg p-1 w-full focus:outline-none  "
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Digite o nome do produto"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <FieldError
                  message="O nome deve ter no mínimo 5 caracteres e não pode conter
                  símbolos especiais."
                />
              )}
            </section>

            {/* preço*/}
            <section>
              <div className="flex flex-row gap-2 w-full text-black items-center ">
                <label className="font-semibold text-zinc-500" htmlFor="price">
                  Preço:
                </label>
                <div
                  className="flex flex-row  items-center max-w-1/3 border border-gray-300 rounded-lg 
              "
                >
                  <span className="font-semibold  bg-zinc-500 text-white rounded-l-lg p-1 w-fit border border-r-0 border-gray-400">
                    R$
                  </span>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        inputMode="numeric"
                        className="outline-none focus:outline-none focus:ring-0 w-full"
                        value={Number(field.value).toFixed(2)}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '')
                          field.onChange(Number(digits) / 100)
                        }}
                      />
                    )}
                  />
                </div>

                {/* marca , aqui vai um get pra api pra buscar as marcas*/}

                <div className="flex flex-row gap-2 w-2/4 text-black items-center ">
                  <label
                    className="font-semibold text-zinc-500 w-fit"
                    htmlFor="marcas"
                  >
                    Marca:
                  </label>
                  <select
                    name="marcas"
                    id="marcas"
                    className="border border-gray-300 rounded-lg p-1 w-full focus:outline-none"
                  >
                    <option value="marca1">Marca 1</option>
                    <option value="marca2">Marca 2</option>
                    <option value="marca3">Marca 3</option>
                  </select>
                </div>
              </div>
              {errors.price && <FieldError message="preço minimo 1" />}
            </section>
            {/* categorias , aqui vai um get pra api pra buscar as categorias*/}
            <div className="flex flex-row gap-2 w-full text-black items-center ">
              <label
                className="font-semibold text-zinc-500 w-fit"
                htmlFor="categoria"
              >
                Categoria:
              </label>
              <select
                name="categoria"
                id="categoria"
                className="border border-gray-300 rounded-lg p-1 w-full focus:outline-none"
              >
                <option value="categoria1">Categoria 1</option>
                <option value="categoria2">Categoria 2</option>
                <option value="categoria3">Categoria 3</option>
              </select>
            </div>
            <div>
              <span className="font-semibold text-zinc-500 w-fit">
                Descrição:
              </span>
              <textarea
                className="border border-gray-300 rounded-lg p-1 w-full focus:outline-none"
                name="descricao"
                id="descricao"
                cols={30}
                rows={5}
                placeholder="Digite a descrição do produto"
              ></textarea>
            </div>
            <div className="border-2 border-dashed border-spacing-4 border-black rounded-lg w-full h-[90%]"></div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-white bg-gradient-to-b  from-blue-500 to-blue-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5"
            >
              enviar
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
