import { ListAllproducts } from 'hooks/products/products.hooks'
import { AddProduct } from 'components/products/add/addProducts.component'
import Image from 'next/image'
export function Listproducts() {
  const { data: products } = ListAllproducts()

  return (
    <>
      <AddProduct />
      {products?.data.length == 0 && (
        <div className="font-bold text-center text-2xl m-1 ">
          nenhum produto encontrado
        </div>
      )}

      {products?.data.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-2   p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          {products?.data.map((product) => (
            <div
              key={product.id}
              className="flex  items-center justify-center gap-2  p-2 rounded-lg shadow-md border border-zinc-300 hover:shadow-lg transition-shadow duration-300 w-full bg-zinc-100"
            >
              <div className="shrink-0 h-full max-w-[100px] w-full bg-zinc-300 rounded-lg">
                <Image
                  src={`${product.image}`}
                  alt="user"
                  className="w-full h-full object-cover  border-zinc-400 border shadow-2xl rounded-lg  "
                  style={{ cursor: 'pointer' }}
                  width={50}
                  height={50}
                  quality={90}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <h3 className="font-bold">{product.nome}</h3>
                <h3 className="text-xs text-zinc-500 font-medium">
                  {product.categoria.nome}
                </h3>
                <h3 className="text-xs text-zinc-500 font-medium">
                  {product.marca.nome}
                </h3>
                <div className="font-semibold">R$ {product.preco}</div>
                <div className="font-semibold">ID: {product.id}</div>
                <div className="font-medium bg-green-300 w-fit p-1 rounded-2xl">
                  🟢 Estoque: {product.estoque}
                </div>
              </div>
              <div className="h-full w-11 flex flex-col items-center justify-center gap-2">
                <div className="h-full w-full bg-zinc-300 rounded-xl">
                  <Image
                    src="/assets/products/edit/pencil.png"
                    alt="edit"
                    className="w-full border h-full object-cover  border-zinc-400 p-1.5 shadow-2xl rounded-xl   "
                    style={{ cursor: 'pointer' }}
                    width={40}
                    height={40}
                    quality={90}
                  />
                </div>
                <div className="h-full w-full bg-red-600 rounded-xl">
                  <Image
                    src="/assets/products/trash/trash-bin.png"
                    alt="delete"
                    className="w-full h-full object-cover 
                border border-zinc-500 p-1.5 shadow-2xl rounded-xl  "
                    style={{ cursor: 'pointer' }}
                    width={40}
                    height={40}
                    quality={90}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
