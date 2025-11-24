import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8090"

export const fetchPedidosUsuario = createAsyncThunk(
  "pedidos/fetchPedidosUsuario",
  async (token) => {
    const res = await axios.get(`${API_URL}/pedidos/usuario`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })

    if (Array.isArray(res.data)) {
      return res.data
    }

    console.warn("Respuesta inesperada de /pedidos/usuario:", res.data)
    return []
  },
)

export const confirmPedido = createAsyncThunk(
  "pedidos/confirmPedido",
  async ({ pedidoId, codigoDescuento, metodoDePago, token }) => {
    const res = await axios.put(
      `${API_URL}/pedidos/${pedidoId}/confirmar`,
      {
        codigoDescuento,
        metodoDePago,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
  },
})

export default pedidosSlice.reducer
