import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import requester from "./interceptor/axios"

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8090"

// crear pedido (POST al backend)
export const createPedido = createAsyncThunk(
  "pedidos/createPedido",
  async (payload) => {
    const res = await requester.post("/pedidos", payload)
    return res.data
  },
)


//pedidos de un usuario
export const fetchPedidosUsuario = createAsyncThunk(
  "pedidos/fetchPedidosUsuario",
  async () => {
    const res = await requester.get("/pedidos/usuario")
    console.log(res)
    if (Array.isArray(res.data)) {
      return res.data
    }

    console.warn("Respuesta inesperada de /pedidos/usuario:", res.data)
    return []
  },
)

//todos los pedidos utilizado para admin
export const fetchPedidosAdmin = createAsyncThunk(
  "pedidos/fetchPedidosAdmin",
  async () => {
    const res = await requester.get("/pedidos")

    const data = res.data

    if (Array.isArray(data)) return data
    if (Array.isArray(data?.content)) return data.content

    console.warn("Respuesta inesperada de /pedidos:", data)
    return []
  },
)

// confirmar pedido para cliente
export const confirmPedido = createAsyncThunk(
  "pedidos/confirmPedido",
  async ({ pedidoId, codigoDescuento, metodoDePago }) => {
    const res = await requester.put(
      `/pedidos/${pedidoId}/confirmar`,
      {
        codigoDescuento,
        metodoDePago,
      },
    )

    return res.data
  },
)

// enviar un pedido admin
export const enviarPedido = createAsyncThunk(
  "pedidos/enviarPedido",
  async ({ pedidoId }) => {
    const res = await requester.put(
      `/pedidos/${pedidoId}/enviar`,
      {},
    )

    return res.data
  },
)

const pedidosSlice = createSlice({
  name: "pedidos",
  initialState: {
    items: [],
    loading: false,
    error: null,
    confirming: false,
    confirmError: null,
    creating: false,
    createError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // crear pedido (POST)
      .addCase(createPedido.pending, (state) => {
        state.creating = true
        state.createError = null
      })
      .addCase(createPedido.fulfilled, (state, action) => {
        state.creating = false
        const created = action.payload
        if (created) {
          state.items.unshift(created)
        }
      })
      .addCase(createPedido.rejected, (state, action) => {
        state.creating = false
        state.createError = action.payload || { message: "Error al crear pedido" }
      })

        // listar pedidos para usuario
        .addCase(fetchPedidosUsuario.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchPedidosUsuario.fulfilled, (state, action) => {
          state.loading = false
          state.items = Array.isArray(action.payload) ? action.payload : []
        })
        .addCase(fetchPedidosUsuario.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload || { message: "Error al cargar pedidos" }
        })

        // listar pedidos para admin
        .addCase(fetchPedidosAdmin.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchPedidosAdmin.fulfilled, (state, action) => {
          state.loading = false
          state.items = Array.isArray(action.payload) ? action.payload : []
        })
        .addCase(fetchPedidosAdmin.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload || { message: "Error al cargar pedidos" }
        })

        // confirmar pedido
        .addCase(confirmPedido.pending, (state) => {
          state.confirming = true
          state.confirmError = null
        })
        .addCase(confirmPedido.fulfilled, (state, action) => {
          state.confirming = false
          const updated = action.payload
          if (!updated) return
          const idx = state.items.findIndex((p) => p.id === updated.id)
          if (idx !== -1) {
            state.items[idx] = updated
          }
        })
        .addCase(confirmPedido.rejected, (state, action) => {
          state.confirming = false
          state.confirmError = action.payload || { message: "Error al confirmar pedido" }
        })

        // enviar pedido
        .addCase(enviarPedido.pending, (state) => {
          state.confirming = true
          state.confirmError = null
        })
        .addCase(enviarPedido.fulfilled, (state, action) => {
          state.confirming = false
          const updated = action.payload
          if (!updated) return
          const idx = state.items.findIndex((p) => p.id === updated.id)
          if (idx !== -1) {
            state.items[idx] = updated
          }
        })
        .addCase(enviarPedido.rejected, (state, action) => {
          state.confirming = false
          state.confirmError = action.payload || { message: "Error al actualizar pedido" }
        })
  },
})

export default pedidosSlice.reducer
