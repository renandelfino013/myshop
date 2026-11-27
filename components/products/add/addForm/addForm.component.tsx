import { useRouter } from 'next/router'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { AddhookProduct } from 'hooks/products/products.hooks'
import z from 'zod'
import { FieldError } from 'components/errors/form-errors/field-error'
import { ListAllBrands, NewBrand } from 'hooks/brands/brands.hooks'
import { Myselect } from 'components/shared/select/select.component'
import { useEffect, useState } from 'react'
import type { Brand } from 'shared/types/api/brand/Brand.type'
import { ListAllCategorys, NewCategory } from 'hooks/categorys/categorys.hooks'
import type { Category } from 'shared/types/api/Category/Category.type'
import { schemaPostBrand } from 'shared/schemas/brands/brand.schema'
import { makeCheck } from 'schemas/validator/front-validation/front-validation'
import { schemaPostCategory } from 'schemas/categorys/category.schema'
import { formProductsSchema } from 'schemas/files/front/files.chemas-extended'
import { verifyFile } from 'front-services/files/front-files.services'
type ProductFormInput = z.input<typeof formProductsSchema>
type ProductFormOutput = z.output<typeof formProductsSchema>

export function AddForm() {
  const [openbrands, setOpenbrands] = useState(false)
  const [opencategorys, setOpencategorys] = useState(false)
  const [selectedbrand, setSelectedbrand] = useState<Brand | null>(null)
  const [selectedcategory, setSelectedcategory] = useState<Brand | null>(null)
  const [isvalidFile, setIsvalidFile] = useState(true)
  const [image, setImage] = useState<File | null>(null)
  type prop = 'mark' | 'category'
  const { data: brands, isError } = ListAllBrands()
  const { data: categorys, isError: CategoryIsError } = ListAllCategorys()
  const { mutateAsync: createbrand } = NewBrand()
  const { mutateAsync: createcategory } = NewCategory()
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    if (!image) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(image)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [image])
  function openMenu(prop: prop) {
    if (prop === 'mark') setOpenbrands(true)
    else setOpencategorys(true)
  }

  function closeMenu(prop: prop) {
    if (prop === 'mark') setOpenbrands(false)
    else setOpencategorys(false)
  }
  function handleSelect(item: Category | Brand, kind: 'mark' | 'category') {
    setValue(`${kind}Id`, item.id, {
      shouldValidate: true,
    })

    closeMenu(kind)
  }

  function handleBrandSelect(item: Brand) {
    setSelectedbrand(item)
    handleSelect(item, 'mark')
  }

  function handleCategorySelect(item: Category) {
    setSelectedcategory(item)
    handleSelect(item, 'category')
  }
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    setValue,
  } = useForm<ProductFormInput, undefined, ProductFormOutput>({
    resolver: zodResolver(formProductsSchema),
    defaultValues: { price: 0 },
  })

  return (
    <>
      <div className="w-full h-full  justify-center bg-white text-black p-1  z-60 overflow-auto scrollbar-none relative rounded-lg">
        {openbrands && !isError && brands.success && (
          <div
            onClick={() => closeMenu('mark')}
            className="fixed inset-0 top-0  left-0 bg-black/50 z-10 flex justify-center  items-center "
          >
            <Myselect
              items={brands?.data}
              getKey={(b) => b.id}
              title="Marcas"
              getLabel={(b) => b.nome}
              onSelect={handleBrandSelect}
              addItem={(name) => createbrand(name)}
              checkfn={makeCheck(schemaPostBrand)}
            />
          </div>
        )}
        {opencategorys && !CategoryIsError && categorys.success && (
          <div
            onClick={() => closeMenu('category')}
            className="fixed inset-0 top-0  left-0 bg-black/50 z-10 flex justify-center  items-center "
          >
            <Myselect
              items={categorys?.data}
              getKey={(c) => c.id}
              title="Categorias"
              getLabel={(c) => c.nome}
              onSelect={handleCategorySelect}
              addItem={(name) => createcategory(name)}
              checkfn={makeCheck(schemaPostCategory)}
            />
          </div>
        )}
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

        <section className="flex flex-col gap-2 w-full h-full justify-center items-center  ">
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
                  className="flex flex-row  items-center max-w-1/4 border border-gray-300 rounded-lg 
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
                        className="outline-none focus:outline-none focus:ring-0 w-full p-1"
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

                <div className="flex flex-row gap-2 w-full text-black items-center ">
                  <label
                    className="font-semibold text-zinc-500 w-fit"
                    htmlFor="marcas"
                  >
                    Marca:
                  </label>
                  <div
                    className="text-[12px] border border-gray-300 rounded-lg w-full h-full  pt-2 pb-2 pl-1  text-gray-400 truncate"
                    onClick={() => openMenu('mark')}
                  >
                    {selectedbrand?.nome ?? 'selecionar marca ↓'}
                  </div>
                </div>
              </div>
              {errors.price && <FieldError message="preço minimo 1" />}
            </section>
            {/* 
            
            categorias , aqui vai um get pra api pra buscar as categorias*/}
            <div className="flex flex-row gap-2 w-full text-black items-center ">
              <label
                className="font-semibold text-zinc-500 w-fit"
                htmlFor="categoria"
              >
                Categoria:
              </label>
              <div
                className="text-[12px] border border-gray-300 rounded-lg w-full h-full  pt-2 pb-2 pl-1  text-gray-400 truncate"
                onClick={() => openMenu('category')}
              >
                {selectedcategory?.nome ?? 'selecionar categoria ↓'}
              </div>
            </div>
            <div>
              <span className="font-semibold text-zinc-500 w-fit">
                Descrição:
              </span>
              <textarea
                className="border border-gray-300 rounded-lg p-1 w-full focus:outline-none"
                name="descricao"
                id="descricao"
                {...register('desc')}
                cols={30}
                rows={5}
                placeholder="Digite a descrição do produto"
              ></textarea>
            </div>
            <label
              htmlFor="image"
              className="border-2 border-dashed border-spacing-4 border-black rounded-lg w-full h-[90%] flex text-center flex-col items-center justify-center hover:bg-gray-100 hover:transition-all active:bg-gray-100  active:transition-all"
            >
              <Image
                alt="Imagem do produto"
                src={preview ?? '/assets/addimageICon/image.png'}
                width={100}
                height={100}
                unoptimized={!!preview}
                className="object-contain"
              />
              <p className="font-medium">
                {image ? image.name : 'adicionar imagem do produto'}
              </p>
              <p className="font-normal text-gray-400">
                {image ? 'trocar imagem' : 'Png ou Jpeg'}
              </p>

              <input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) setImage(file)
                  setValue('namefile', file.name, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                  setValue('filesize', file.size, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                  setValue('mimetype', file.type, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                  const verify = await verifyFile(file)
                  if (!verify) setIsvalidFile(false)
                  else setIsvalidFile(true)
                }}
              />
            </label>
            {!isvalidFile && <FieldError message="arquivo invalido" />}
            {errors.filesize && <FieldError message="o tamanho maximo é 5mb" />}
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
