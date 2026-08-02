'use client'
import { Loader2, Edit, Trash2, Image } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import NodeApi from "@/utils/NodeApi";
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 5
  const router = useRouter()

  const FetchProducts = async () => {
    try {
      setLoading(true)
      const response = await NodeApi.get('/product/get_products')

      if (response?.data?.success) {
        setProducts(response?.data?.products || [])
      }
    } catch (error) {
      console.error('error : ', error)
      toast.error(error || "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    FetchProducts()
  }, [])

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase().trim()
    if (!q) return products
    return products.filter((p) => (p.product_name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q))
  }, [products, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [totalPages])

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  return loading ? (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">Dashboard</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Products list</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div className="w-full sm:w-1/3">
              <Input placeholder="Search Product..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} />
            </div>
            <div className="text-sm text-zinc-500">Showing {filtered.length} products</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-zinc-200 text-left">
                      <th className="w-20 py-3 px-4">Image</th>
                      <th className="w-[35%] py-3 px-4">Product</th>
                      <th className="w-[20%] py-3 px-4 text-center">Category</th>
                      <th className="w-[15%] py-3 px-4 text-center">Price</th>
                      <th className="w-[15%] py-3 px-4 text-center">Stock</th>
                      <th className="w-[15%] py-3 px-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-sm text-zinc-500">No products found.</td>
                      </tr>
                    ) : (
                      paged.map((p, idx) => (
                        <tr key={p._id || idx} className="border-b last:border-b-0">
                          <td className="py-3">
                            <div className="w-12 h-12 rounded-md bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center">
                              {p.product_images && p.product_images[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.product_images[0]} alt={p.product_name} className="w-full h-full object-cover" />
                              ) : (
                                <Image className="text-zinc-400" />
                              )}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="font-medium text-zinc-900 dark:text-zinc-50">{p.product_name}</div>
                            <div className="text-xs text-zinc-500">{p.description ? p.description.slice(0, 60) : ''}</div>
                          </td>
                          <td className="py-3 text-center">{p.category ?? '-'}</td>
                          <td className="py-3 text-center">₹{p.price}</td>
                          <td className="text-center">{p.stock ?? '-'}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/update_product/${p._id}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(p._id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {paged.length === 0 ? (
                  <div className="text-center py-10 text-sm text-zinc-500">
                    No products found.
                  </div>
                ) : (
                  paged.map((p, idx) => (
                    <div
                      key={p._id || idx}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950 shadow-sm"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                          {p.product_images?.[0] ? (
                            <img
                              src={p.product_images[0]}
                              alt={p.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-8 h-8 text-zinc-400" />
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold truncate">
                            {p.product_name}
                          </h3>

                          <p className="text-sm text-zinc-500 mt-1">
                            {p.category}
                          </p>

                          <p className="text-lg font-bold mt-3">
                            ₹{p.price}
                          </p>

                          <p className="text-sm text-zinc-500">
                            Stock : {p.stock}
                          </p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="grid grid-cols-2 gap-3 mt-5">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(p._id)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 rounded-md ${page === i + 1
                        ? "bg-black text-white"
                        : "border border-zinc-200 dark:border-zinc-800"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
