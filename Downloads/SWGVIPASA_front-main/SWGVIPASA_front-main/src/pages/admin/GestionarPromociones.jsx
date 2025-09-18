// src/pages/admin/GestionarPromociones.jsx
import React, { useState, useEffect } from "react";
import { promocionesService } from "../../services/promocionesService";
import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaPlus, FaTrash, FaEdit, FaToggleOn, FaToggleOff } from "react-icons/fa";

export default function GestionarPromociones() {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [filters, setFilters] = useState({
    estado: "",
    busqueda: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const initialForm = {
    nombre: "",
    tipo: "",
    descuento: "",
    minCompra: "",
    codigo: "",
    productos: "",       // Este será transformado a productosAplicables
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    activa: true,
  };

  const [newPromo, setNewPromo] = useState(initialForm);
  const [editPromo, setEditPromo] = useState(null);

  // 🔹 Cargar promociones al inicio
  useEffect(() => {
    cargarPromociones();
  }, []);

  const cargarPromociones = async () => {
    try {
      const data = await promocionesService.getAll();
      setPromotions(data || []);
      setFilteredPromotions(data || []);
    } catch (err) {
      console.error("Error al cargar promociones:", err);
    }
  };

  // 🔹 Filtros
  useEffect(() => {
    let filtradas = promotions.slice();

    if (filters.estado) {
      filtradas = filtradas.filter(
        (p) =>
          (filters.estado === "activa" && p.activa) ||
          (filters.estado === "inactiva" && !p.activa)
      );
    }

    if (filters.busqueda) {
      filtradas = filtradas.filter(
        (p) => (p.nombre || "").toLowerCase().includes(filters.busqueda.toLowerCase())
      );
    }

    if (filters.fechaInicio) {
      filtradas = filtradas.filter(
        (p) => p.fechaInicio && new Date(p.fechaInicio) >= new Date(filters.fechaInicio)
      );
    }

    if (filters.fechaFin) {
      filtradas = filtradas.filter(
        (p) => p.fechaFin && new Date(p.fechaFin) <= new Date(filters.fechaFin)
      );
    }

    setFilteredPromotions(filtradas);
  }, [filters, promotions]);

  // 🔹 Reset formulario
  const resetForm = () => setNewPromo(initialForm);

  useEffect(() => {
    const modalEl = document.getElementById("addPromoModal");
    if (!modalEl) return;
    modalEl.addEventListener("hidden.bs.modal", resetForm);
    return () => modalEl.removeEventListener("hidden.bs.modal", resetForm);
  }, []);

  // 🔹 Inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPromo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditPromo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Reset filtros
  const resetFilters = () => {
    setFilters({ estado: "", busqueda: "", fechaInicio: "", fechaFin: "" });
  };

  /// 🔹 Crear promoción (VERSIÓN CORREGIDA)
const handleSubmit = async () => {
  const formEl = document.getElementById("promoForm");
  if (formEl && !formEl.reportValidity()) return;

  const promoToSend = {
    nombre: newPromo.nombre,
    tipo: newPromo.tipo,
    descuento: newPromo.descuento ? Number(newPromo.descuento) : 0,
    minCompra: newPromo.minCompra ? Number(newPromo.minCompra) : 0,
    descripcion: newPromo.descripcion?.trim() || "",
    productosAplicables: newPromo.productos
      ? newPromo.productos.split(",").map(p => p.trim()).filter(p => p !== "")
      : [],
    fechaInicio: newPromo.fechaInicio
      ? new Date(newPromo.fechaInicio).toISOString()
      : null,
    fechaFin: newPromo.fechaFin
      ? new Date(newPromo.fechaFin).toISOString()
      : null,
    activa: newPromo.activa
  };

  // 🔹 MANEJO DEL CÓDIGO CORREGIDO
  // Solo agregar código si no está vacío
  if (newPromo.codigo && newPromo.codigo.trim() !== "") {
    promoToSend.codigo = newPromo.codigo.trim();
  }
  // Si está vacío, NO agregamos la propiedad codigo (el backend lo generará)

  try {
    const created = await promocionesService.create(promoToSend);
    setPromotions((prev) => [created, ...prev]);
    const modalEl = document.getElementById("addPromoModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    alert("✅ Promoción creada correctamente");
  } catch (err) {
    console.error("Error creando promoción:", err);
    alert("❌ " + (err.response?.data?.error || "Error al crear"));
  }
};
  // 🔹 Editar promoción
  const handleEdit = (promo) => {
    setEditPromo({
      ...promo,
      productos: promo.productosAplicables ? promo.productosAplicables.join(", ") : "",
      fechaInicio: promo.fechaInicio ? promo.fechaInicio.split("T")[0] : "",
      fechaFin: promo.fechaFin ? promo.fechaFin.split("T")[0] : "",
    });
    const modalEl = document.getElementById("editPromoModal");
    new bootstrap.Modal(modalEl).show();
  };

  const handleUpdate = async () => {
  const formEl = document.getElementById("editPromoForm");
  if (formEl && !formEl.reportValidity()) return;

  const promoToUpdate = {
    ...editPromo,
    descuento: Number(editPromo.descuento || 0),
    minCompra: Number(editPromo.minCompra || 0),
    productosAplicables: editPromo.productos
      ? editPromo.productos.split(",").map((p) => p.trim()).filter(p => p !== "")
      : [],
    descripcion: editPromo.descripcion || "",
    fechaInicio: editPromo.fechaInicio ? new Date(editPromo.fechaInicio).toISOString() : null,
    fechaFin: editPromo.fechaFin ? new Date(editPromo.fechaFin).toISOString() : null,
  };

  // 🔹 CORRECCIÓN: Manejo adecuado del código
  // Si el código está vacío, lo eliminamos para que el backend no reciba null
  if (!promoToUpdate.codigo || promoToUpdate.codigo.trim() === "") {
    delete promoToUpdate.codigo;
  } else {
    // Si tiene valor, lo trimamos
    promoToUpdate.codigo = promoToUpdate.codigo.trim();
  }

  try {
    const updated = await promocionesService.update(editPromo._id, promoToUpdate);
    setPromotions((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    const modalEl = document.getElementById("editPromoModal");
    if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
    alert("✅ Promoción actualizada correctamente");
  } catch (err) {
    console.error("Error editando promoción:", err);
    alert("❌ " + (err.response?.data?.error || "Error al actualizar"));
  }
};

  // 🔹 Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta promoción?")) return;
    try {
      await promocionesService.delete(id);
      setPromotions((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("No se pudo eliminar la promoción");
    }
  };

  // 🔹 Activar/Desactivar
  const toggleEstado = async (promo) => {
    try {
      const updated = await promocionesService.update(promo._id, {
        ...promo,
        activa: !promo.activa,
      });
      setPromotions((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch {
      alert("Error al cambiar estado");
    }
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">Gestión de Promociones</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={resetFilters}>
            Reset filtros
          </button>
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addPromoModal">
            <FaPlus className="me-1" /> Nueva Promoción
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.estado}
                onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
              >
                <option value="">Todos los estados</option>
                <option value="activa">Activas</option>
                <option value="inactiva">Inactivas</option>
              </select>
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre"
                value={filters.busqueda}
                onChange={(e) => setFilters({ ...filters, busqueda: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filters.fechaInicio}
                onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                value={filters.fechaFin}
                onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="card-header py-3">
          <h6 className="m-0 fw-bold text-primary">Lista de Promociones</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Descuento</th>
                  <th>Mín. Compra</th>
                  <th>Código</th>
                  <th>Productos</th>
                  <th>Descripción</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((p) => (
                    <tr key={p._id}>
                      <td>{p.nombre}</td>
                      <td>{p.tipo || "General"}</td>
                      <td>{p.descuento ? `${p.descuento}%` : "-"}</td>
                      <td>{p.minCompra || "-"}</td>
                      <td className="font-monospace">{p.codigo || "Sin código"}</td>
                      <td>{p.productosAplicables && p.productosAplicables.length > 0 ? p.productosAplicables.join(", ") : "Sin productos"}</td>
                      <td>{p.descripcion || "Sin descripción"}</td>
                      <td>{p.fechaInicio ? new Date(p.fechaInicio).toLocaleDateString() : "-"}</td>
                      <td>{p.fechaFin ? new Date(p.fechaFin).toLocaleDateString() : "-"}</td>
                      <td>
                        {p.activa ? (
                          <span className="badge bg-success">Activa</span>
                        ) : (
                          <span className="badge bg-secondary">Inactiva</span>
                        )}
                      </td>
                      <td className="d-flex gap-2">
                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(p)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>
                          <FaTrash />
                        </button>
                        <button className="btn btn-sm btn-info" onClick={() => toggleEstado(p)}>
                          {p.activa ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center text-muted">
                      No hay promociones creadas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Crear */}
      <div className="modal fade" id="addPromoModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear Nueva Promoción</h5>
            </div>
            <div className="modal-body">
              <form id="promoForm" noValidate>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={newPromo.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Código *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="codigo"
                      value={newPromo.codigo}
                      onChange={(e) =>
                        setNewPromo({ ...newPromo, codigo: e.target.value.toUpperCase() })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Tipo *</label>
                    <select
                      className="form-select"
                      name="tipo"
                      value={newPromo.tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Descuento">Descuento porcentual</option>
                      <option value="Precio especial">Precio especial</option>
                      <option value="Bundle">Paquete</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Descuento (%) *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="descuento"
                      value={newPromo.descuento}
                      onChange={handleChange}
                      placeholder="Ej: 10"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Mínima compra</label>
                    <input
                      type="number"
                      className="form-control"
                      name="minCompra"
                      value={newPromo.minCompra}
                      onChange={handleChange}
                      placeholder="Ej: 100"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Productos (separados por coma)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="productos"
                      value={newPromo.productos}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Fecha Inicio</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fechaInicio"
                      value={newPromo.fechaInicio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fecha Fin</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fechaFin"
                      value={newPromo.fechaFin}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={newPromo.descripcion}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="activa"
                    checked={newPromo.activa}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Activar promoción inmediatamente</label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Editar */}
      <div className="modal fade" id="editPromoModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Promoción</h5>
            </div>
            <div className="modal-body">
              {editPromo && (
                <form id="editPromoForm" noValidate>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={editPromo.nombre}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Código *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="codigo"
                        value={editPromo.codigo}
                        onChange={(e) =>
                          setEditPromo({ ...editPromo, codigo: e.target.value.toUpperCase() })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Tipo *</label>
                      <select
                        className="form-select"
                        name="tipo"
                        value={editPromo.tipo}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="Descuento">Descuento porcentual</option>
                        <option value="Precio especial">Precio especial</option>
                        <option value="Bundle">Paquete</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Descuento (%) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="descuento"
                        value={editPromo.descuento}
                        onChange={handleEditChange}
                        placeholder="Ej: 15"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Mínima compra</label>
                      <input
                        type="number"
                        className="form-control"
                        name="minCompra"
                        value={editPromo.minCompra}
                        onChange={handleEditChange}
                        placeholder="Ej: 200"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Productos (separados por coma)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="productos"
                        value={editPromo.productos}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Fecha Inicio</label>
                      <input
                        type="date"
                        className="form-control"
                        name="fechaInicio"
                        value={editPromo.fechaInicio}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Fecha Fin</label>
                      <input
                        type="date"
                        className="form-control"
                        name="fechaFin"
                        value={editPromo.fechaFin}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={editPromo.descripcion}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="activa"
                      checked={editPromo.activa}
                      onChange={handleEditChange}
                    />
                    <label className="form-check-label">Promoción activa</label>
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
