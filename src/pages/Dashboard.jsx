/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api';
import Modal from '../components/Modal';

// Configuración de los menús laterales según el rol
const menus = {
  admin: [
    { icon: 'bi-grid-1x2-fill', text: 'Panel de Control' },
    { icon: 'bi-people-fill', text: 'Directorio Residentes' },
    { icon: 'bi-shield-lock-fill', text: 'Gestión de Seguridad' },
    { icon: 'bi-person-badge-fill', text: 'Registro de Visitas' },
    { icon: 'bi-megaphone-fill', text: 'Comunicados' },
    { icon: 'bi-building-fill-gear', text: 'Gestión de Áreas' },
    { icon: 'bi-tools', text: 'Mantenimiento' },
    { icon: 'bi-clipboard2-check', text: 'Votaciones' },
    { icon: 'bi-gear-fill', text: 'Configuraciones' },
  ],
  residente: [
    { icon: 'bi-house-door-fill', text: 'Mi Domicilio' },
    { icon: 'bi-person-badge-fill', text: 'Control de Visitas' },
    { icon: 'bi-calendar-event', text: 'Reservar Áreas' },
    { icon: 'bi-p-circle-fill', text: 'Estacionamiento y Carritos' },
    { icon: 'bi-megaphone-fill', text: 'Comunicados' },
    { icon: 'bi-bar-chart-steps', text: 'Asambleas y Votaciones' },
    { icon: 'bi-exclamation-triangle', text: 'Reportar Incidencia' },
  ],
  seguridad: [
    { icon: 'bi-shield-shaded', text: 'Monitor Principal' },
    { icon: 'bi-person-bounding-box', text: 'Control de Accesos' },
    { icon: 'bi-camera-video-fill', text: 'Cámaras (CCTV)' },
    { icon: 'bi-journal-text', text: 'Bitácora Digital' },
  ]
};

  /* --- COMPONENTES INTERNOS DE CADA ROL --- */
  
const AdminPanelControl = ({ onOpenModal, tickets, residents }) => {
  const visitasHoy = (residents || []).filter(r => r.status === 'ACTIVO').length;
  
  const incidenciasAbiertas = (tickets || []).filter(t => t.status === 'Pendiente' || t.status === 'En Proceso');
  const incidenciasCount = incidenciasAbiertas.length;
  const primeraIncidencia = incidenciasAbiertas[0]?.title || 'Sin incidencias';

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-md-4">
        <div className="service-card-elite p-4 h-100">
          <div className="text-success mb-2"><i className="bi bi-door-open fs-4"></i></div>
          <h6 className="text-white-50 text-uppercase small fw-bold">Residentes Activos</h6>
          <h2 className="text-white fw-bold mb-0">{visitasHoy}</h2>
          <small className="text-white-50">Usuarios en el sistema</small>
        </div>
      </div>
      <div className="col-md-4">
        <div className="service-card-elite p-4 h-100" style={{ borderColor: incidenciasCount > 0 ? 'rgba(255, 95, 86, 0.4)' : 'rgba(25, 135, 84, 0.4)' }}>
          <div className={`text-${incidenciasCount > 0 ? 'danger' : 'success'} mb-2`}><i className="bi bi-tools fs-4"></i></div>
          <h6 className="text-white-50 text-uppercase small fw-bold">Incidencias</h6>
          <h2 className="text-white fw-bold mb-0">{incidenciasCount > 0 ? `${incidenciasCount} Abierta${incidenciasCount > 1 ? 's' : ''}` : '0 Abiertas'}</h2>
          <small className={`text-${incidenciasCount > 0 ? 'danger' : 'success'}`}>{incidenciasCount > 0 ? primeraIncidencia : 'Todo al día ✓'}</small>
        </div>
      </div>
      <div className="col-md-4">
        <div className="service-card-elite p-4 h-100">
          <div className="text-info mb-2"><i className="bi bi-people fs-4"></i></div>
          <h6 className="text-white-50 text-uppercase small fw-bold">Total Residentes</h6>
          <h2 className="text-white fw-bold mb-0">{(residents || []).length}</h2>
          <small className="text-white-50">Registrados en el sistema</small>
        </div>
      </div>
    </div>
  );
};

const AdminDirectorio = ({ onOpenModal, residents, setResidents, onCreateResident, onEditResident, onDeleteResident, onApprove, onReject, isLoading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResidents = (residents || []).filter(r => 
    (r.role?.toUpperCase() === 'RESIDENTE') &&
    (r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (r.depto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingResidents = filteredResidents.filter(r => r.status === 'PENDIENTE');
  const activeResidents = filteredResidents.filter(r => r.status !== 'PENDIENTE');

  if (isLoading) {
    return (
      <div className="text-center py-5 vh-50 d-flex flex-column justify-content-center align-items-center">
        <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-white-50 mt-3 fs-5">Cargando directorio de usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger bg-transparent border-danger text-danger text-center p-4">
        <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i> 
        <strong className="me-2">Error al cargar datos:</strong> 
        {error}
        <p className="mt-2 small mb-0">Por favor, recargue la página o contacte a soporte si el problema persiste.</p>
      </div>
    );
  }

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">
        <h5 className="text-white mb-0">Directorio de Residentes</h5>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div className="input-group w-100" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar por nombre o dpto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-outline-info rounded-pill px-4 py-2 fw-bold w-100 w-sm-auto text-nowrap" onClick={() => onOpenModal('Registrar Nuevo Residente', 'form-residente', null, (newRes) => onCreateResident(newRes))}><i className="bi bi-person-plus me-2"></i> Nuevo Residente</button>
        </div>
      </div>

      {/* --- DIRECTORIO ACTIVO --- */}
      <div className="col-12 mt-2">
        <h6 className="text-info fw-bold mb-3"><i className="bi bi-people-fill me-2"></i>Residentes Activos ({activeResidents.length})</h6>
      </div>

      {activeResidents.length > 0 ? activeResidents.map((r) => (
        <div className="col-xl-4 col-md-6" key={r.id}>
          <div className="service-card-elite p-4 h-100 d-flex flex-column align-items-center text-center shadow-sm">
            <div className="avatar-circle mb-3 shadow-lg" style={{ width: '65px', height: '65px', fontSize: '1.6rem' }}>{r.name ? r.name.charAt(0) : '?'}</div>
            <h5 className="text-white fw-bold mb-1">{r.name}</h5>
            <span className="badge bg-secondary bg-opacity-25 text-white-50 rounded-pill mb-1 px-3">Dpto {r.depto || 'N/A'}</span>
            <small className="text-info mb-3">{r.email || 'Sin correo'}</small>
            <div className="mt-auto w-100">
              <div className="d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25 pt-3 mt-2 mb-3">
                <small className="text-white-50 hover-cyan"><i className="bi bi-telephone me-1"></i> {r.phone || 'No registrado'}</small>
                <span className={`badge bg-${r.color} bg-opacity-25 text-${r.color} border border-${r.color} border-opacity-50 rounded-pill`}>{r.status}</span>
              </div>
              {/* BOTONES CRUD: EDITAR Y BORRAR */}
              <div className="d-flex gap-2 w-100">
                <button className="btn btn-sm btn-outline-info flex-grow-1 rounded-pill fw-bold" onClick={() => onOpenModal('Editar Perfil', 'form-residente', r, (updatedRes) => onEditResident(updatedRes))}><i className="bi bi-pencil-square me-1"></i> Editar</button>
                <button className="btn btn-sm btn-outline-danger rounded-pill px-3" title="Eliminar Residente" onClick={() => onOpenModal('Eliminar Residente', 'confirm-delete', { item: r.name }, () => onDeleteResident(r.id))}><i className="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 mt-5 py-5">
          <i className="bi bi-search fs-1 d-block mb-3 opacity-50"></i>
          <p>No se encontraron residentes activos con ese criterio de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

const AdminSeguridad = ({ onOpenModal, residents, onCreate, onEdit, onDelete, onApprove, onReject }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = (residents || []).filter(r => 
    (r.role?.toUpperCase() === 'SEGURIDAD') &&
    ((r.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingStaff = filteredStaff.filter(r => r.status === 'PENDIENTE');
  const activeStaff = filteredStaff.filter(r => r.status !== 'PENDIENTE');

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-4 gap-3">
        <h5 className="text-white mb-0">Personal de Seguridad</h5>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div className="input-group w-100" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-premium-unique rounded-pill px-4 py-2 fw-bold shadow-lg text-nowrap w-100 w-sm-auto" onClick={() => onOpenModal('Registrar Personal de Seguridad', 'form-seguridad', null, onCreate)}>
            <i className="bi bi-shield-plus me-2"></i> Nuevo Oficial
          </button>
        </div>
      </div>

      {/* --- PERSONAL ACTIVO --- */}
      <div className="col-12 mt-2">
        <h6 className="text-info fw-bold mb-3"><i className="bi bi-shield-check me-2"></i>Personal Activo ({activeStaff.length})</h6>
      </div>

      {activeStaff.length > 0 ? activeStaff.map((s) => (
        <div className="col-xl-4 col-md-6" key={s.id}>
          <div className="service-card-elite p-4 h-100 d-flex flex-column align-items-center text-center shadow-sm">
            <div className="avatar-circle mb-3 shadow-lg bg-info bg-opacity-10 text-info" style={{ width: '65px', height: '65px', fontSize: '1.6rem' }}><i className="bi bi-shield-shaded"></i></div>
            <h5 className="text-white fw-bold mb-1">{s.name}</h5>
            <small className="text-info mb-3">{s.email}</small>
            <div className="mt-auto w-100">
              <div className="d-flex justify-content-between align-items-center border-top border-secondary border-opacity-25 pt-3 mt-2 mb-3">
                <small className="text-white-50"><i className="bi bi-telephone me-1"></i> {s.phone || 'No registrado'}</small>
                <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 rounded-pill">ACTIVO</span>
              </div>
              <div className="d-flex gap-2 w-100">
                <button className="btn btn-sm btn-outline-info flex-grow-1 rounded-pill fw-bold" onClick={() => onOpenModal('Editar Oficial', 'form-seguridad', s, onEdit)}><i className="bi bi-pencil-square me-1"></i> Editar</button>
                <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onOpenModal('Eliminar Acceso', 'confirm-delete', { item: s.name }, () => onDelete(s.id))}><i className="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 mt-5 py-5">
          <i className="bi bi-shield-slash fs-1 d-block mb-3 opacity-50"></i>
          <p>No se encontró personal de seguridad registrado.</p>
        </div>
      )}
    </div>
  );
};

const AdminComunicados = ({ onOpenModal, comunicados, onCreate, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredComunicados = (comunicados || []).filter(c => 
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.desc || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <h5 className="text-white mb-0">Tablón de Anuncios</h5>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div className="input-group w-100" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar por título o contenido..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg text-nowrap w-100 w-sm-auto" onClick={() => onOpenModal('Redactar Comunicado', 'form-comunicado', null, onCreate)}>
            <i className="bi bi-plus-circle me-2"></i> Redactar Comunicado
          </button>
        </div>
      </div>
      {filteredComunicados.length > 0 ? filteredComunicados.map((c) => {
        const priorityLabel = c.type === 'danger' ? '🔴 Muy Importante' : c.type === 'warning' ? '🟡 Importante' : '🔵 Informativo';
        return (
        <div className="col-lg-6" key={c.id}>
          <div className="service-card-elite p-4 h-100 d-flex flex-column position-relative">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="d-flex gap-2 flex-wrap">
                <span className={`badge bg-${c.type} bg-opacity-25 text-${c.type} border border-${c.type} border-opacity-50 rounded-pill px-3`}>{priorityLabel}</span>
                <span className="badge bg-secondary bg-opacity-25 text-white-50 rounded-pill px-3">{c.scope}</span>
              </div>
              <small className="text-white-50">{c.date || new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
            <h4 className="text-white fw-bold mb-3">{c.title}</h4>
            <p className="text-white-50 small flex-grow-1 lh-lg">{c.desc}</p>
            
            {/* BOTONES CRUD: EDITAR Y BORRAR */}
            <div className="d-flex gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
              <button className="btn btn-sm btn-outline-info flex-grow-1 rounded-pill fw-bold" onClick={() => onOpenModal('Editar Anuncio', 'form-comunicado', c, onEdit)}><i className="bi bi-pencil-square me-1"></i> Editar Anuncio</button>
              <button className="btn btn-sm btn-outline-danger rounded-pill px-4" onClick={() => onOpenModal('Eliminar Anuncio', 'confirm-delete', { item: c.title }, () => onDelete(c.id))}><i className="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
        );
      }) : (
        <div className="col-12 text-center text-white-50 mt-5 py-5">
          <i className="bi bi-search fs-1 d-block mb-3 opacity-50"></i>
          <p>No se encontraron comunicados con ese criterio de búsqueda.</p>
        </div>
      )}
    </div>
  );
};

const AdminAreas = ({ onOpenModal, areas, onCreate, onEdit, onDelete, onToggleStatus, reservations, onApproveReservation, onRejectReservation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAreas = (areas || []).filter(a => 
    (a.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingReservations = (reservations || []).filter(r => r.status === 'Pendiente');

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <h5 className="text-white mb-0">Zonas y Amenidades</h5>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div className="input-group w-100" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar área..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg text-nowrap w-100 w-sm-auto" onClick={() => onOpenModal('Registrar Nueva Área', 'form-area', null, onCreate)}>
            <i className="bi bi-plus-circle me-2"></i> Registrar Área
          </button>
        </div>
      </div>

      {/* --- SECCIÓN: RESERVAS PENDIENTES --- */}
      {pendingReservations.length > 0 && (
        <div className="col-12">
          <h6 className="text-warning fw-bold mb-3"><i className="bi bi-clock-history me-2"></i>Reservas Pendientes de Aprobación ({pendingReservations.length})</h6>
          <div className="service-card-elite p-0 overflow-auto mb-4">
            <table className="table table-dark table-hover mb-0 bg-transparent text-white-50 align-middle text-nowrap">
              <thead>
                <tr>
                  <th className="bg-transparent text-white border-bottom border-secondary py-3 px-4">Residente</th>
                  <th className="bg-transparent text-white border-bottom border-secondary py-3">Área</th>
                  <th className="bg-transparent text-white border-bottom border-secondary py-3">Fecha</th>
                  <th className="bg-transparent text-white border-bottom border-secondary py-3">Horario</th>
                  <th className="bg-transparent text-white border-bottom border-secondary py-3 text-end px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pendingReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="bg-transparent py-3 px-4">
                      <div>
                        <span className="text-white fw-medium">{r.user?.name || 'Residente'}</span>
                        <small className="d-block text-white-50">{r.user?.depto || ''}</small>
                      </div>
                    </td>
                    <td className="bg-transparent py-3">
                      <div className="d-flex align-items-center">
                        <i className={`bi ${r.area?.icon || 'bi-calendar-event'} me-2 text-${r.area?.color || 'info'}`}></i>
                        <span>{r.area?.name || 'Área'}</span>
                      </div>
                    </td>
                    <td className="bg-transparent py-3">{new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="bg-transparent py-3">{r.timeStart} - {r.timeEnd}</td>
                    <td className="bg-transparent py-3 text-end px-4">
                      <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm btn-success rounded-pill px-3 fw-bold" onClick={() => onOpenModal('Aprobar Reserva', 'confirm-approve', { item: `${r.user?.name} - ${r.area?.name}` }, () => onApproveReservation(r.id))}>
                          <i className="bi bi-check-circle me-1"></i> Aprobar
                        </button>
                        <button className="btn btn-sm btn-danger rounded-pill px-3 fw-bold" onClick={() => onOpenModal('Rechazar Reserva', 'confirm-reject', { item: `${r.user?.name} - ${r.area?.name}` }, () => onRejectReservation(r.id))}>
                          <i className="bi bi-x-circle me-1"></i> Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SECCIÓN: TARJETAS DE ÁREAS --- */}
      {filteredAreas.length > 0 ? filteredAreas.map((a) => (
        <div className="col-lg-4 col-md-6" key={a.id}>
          <div className="service-card-elite p-4 h-100 d-flex flex-column align-items-center text-center">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow" style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.05)', border: `1px solid var(--bs-${a.color})` }}>
              <i className={`bi ${a.icon} fs-2 text-${a.color}`}></i>
            </div>
            <h5 className="text-white fw-bold mb-1">{a.name}</h5>
            <p className="text-white-50 small mb-3">Aforo Máximo: {a.capacity}</p>
            <span className={`badge bg-${a.color} bg-opacity-25 text-${a.color} rounded-pill px-3 mb-4`}>{a.status}</span>
            
            {/* BOTONES CRUD: EDITAR, SUSPENDER Y BORRAR */}
            <div className="mt-auto w-100 d-flex gap-2">
              <button className="btn btn-sm btn-outline-info flex-grow-1 rounded-pill" title="Editar" onClick={() => onOpenModal('Editar Área', 'form-area', a, onEdit)}><i className="bi bi-pencil-square"></i></button>
              <button className="btn btn-sm btn-outline-warning flex-grow-1 rounded-pill" title={a.status === 'Mantenimiento' ? 'Reactivar Operación' : 'Pausar Operación'} onClick={() => onOpenModal(a.status === 'Mantenimiento' ? 'Reactivar Operación' : 'Pausar Operación', 'confirm-pause', { item: a.name }, () => onToggleStatus(a))}><i className={a.status === 'Mantenimiento' ? 'bi bi-play-circle' : 'bi bi-pause-circle'}></i></button>
              <button className="btn btn-sm btn-outline-danger flex-grow-1 rounded-pill" title="Eliminar" onClick={() => onOpenModal('Eliminar Área', 'confirm-delete', { item: a.name }, () => onDelete(a.id))}><i className="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 mt-5 py-5">
          <i className="bi bi-search fs-1 d-block mb-3 opacity-50"></i>
          <p>No se encontraron áreas con ese criterio de búsqueda.</p>
        </div>
      )}
      </div>
    );
};

const AdminVisitas = ({ onOpenModal, visitors, onUpdateStatus }) => {
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const statusOptions = ['Todos', 'Pendiente', 'Aprobado', 'Ingresó', 'Salió', 'Rechazado'];

  const visitasFiltradas = filtroStatus === 'Todos'
    ? (visitors || [])
    : (visitors || []).filter(v => v.status === filtroStatus);

  const getStatusBadge = (status) => {
    const map = {
      'Pendiente': { color: 'warning', icon: 'bi-clock' },
      'Aprobado': { color: 'info', icon: 'bi-check-circle' },
      'Ingresó': { color: 'success', icon: 'bi-box-arrow-in-right' },
      'Salió': { color: 'secondary', icon: 'bi-box-arrow-right' },
      'Rechazado': { color: 'danger', icon: 'bi-x-circle' }
    };
    return map[status] || { color: 'secondary', icon: 'bi-question' };
  };

  const pendingCount = (visitors || []).filter(v => v.status === 'Pendiente').length;

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <div>
          <h5 className="text-white mb-1">Registro de Visitas</h5>
          {pendingCount > 0 && <small className="text-warning"><i className="bi bi-clock me-1"></i>{pendingCount} pendiente{pendingCount > 1 ? 's' : ''} de aprobación</small>}
        </div>
        <div className="d-flex flex-wrap gap-2">
          {statusOptions.map(s => (
            <button key={s} className={`btn btn-sm rounded-pill px-3 fw-bold ${filtroStatus === s ? 'btn-info text-dark' : 'btn-outline-secondary text-white-50'}`} onClick={() => setFiltroStatus(s)}>
              {s} {s !== 'Todos' && <span className="ms-1 badge bg-dark">{(visitors || []).filter(v => v.status === s).length}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="col-12">
        <div className="service-card-elite p-0 overflow-auto">
          <table className="table table-dark table-hover mb-0 bg-transparent text-white-50 align-middle text-nowrap">
            <thead>
              <tr>
                <th className="bg-transparent text-white border-bottom border-secondary py-3 px-4">Visitante</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3">Tipo</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3">Residente</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3">Fecha Visita</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3">PIN</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3">Estado</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3 text-end px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visitasFiltradas.length > 0 ? visitasFiltradas.map(v => {
                const badge = getStatusBadge(v.status);
                return (
                  <tr key={v.id}>
                    <td className="bg-transparent py-3 px-4">
                      <div>
                        <span className="text-white fw-medium">{v.name}</span>
                        {v.dni && <small className="d-block text-white-50">DNI: {v.dni}</small>}
                      </div>
                    </td>
                    <td className="bg-transparent py-3">
                      <span className={`badge bg-${v.type === 'Familiar' ? 'info' : v.type === 'Proveedor' ? 'warning' : 'success'} bg-opacity-25 text-${v.type === 'Familiar' ? 'info' : v.type === 'Proveedor' ? 'warning' : 'success'} rounded-pill px-3`}>
                        {v.type}
                      </span>
                    </td>
                    <td className="bg-transparent py-3">
                      <div>
                        <span className="text-white">{v.user?.name || 'N/A'}</span>
                        <small className="d-block text-white-50">{v.user?.depto || ''}</small>
                      </div>
                    </td>
                    <td className="bg-transparent py-3">{new Date(v.fechaVisita).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="bg-transparent py-3"><span className="badge bg-dark border border-secondary text-white font-monospace fs-6">{v.pin}</span></td>
                    <td className="bg-transparent py-3">
                      <span className={`badge bg-${badge.color} bg-opacity-25 text-${badge.color} rounded-pill px-3`}>
                        <i className={`bi ${badge.icon} me-1`}></i>{v.status}
                      </span>
                    </td>
                    <td className="bg-transparent py-3 text-end px-4">
                      <div className="d-flex gap-2 justify-content-end">
                        {v.status === 'Pendiente' && (
                          <>
                            <button className="btn btn-sm btn-success rounded-pill px-3 fw-bold" onClick={() => onOpenModal('Aprobar Visita', 'confirm-approve', { item: v.name }, () => onUpdateStatus(v.id, 'Aprobado'))}>
                              <i className="bi bi-check-circle me-1"></i> Aprobar
                            </button>
                            <button className="btn btn-sm btn-danger rounded-pill px-3 fw-bold" onClick={() => onOpenModal('Rechazar Visita', 'confirm-reject', { item: v.name }, () => onUpdateStatus(v.id, 'Rechazado'))}>
                              <i className="bi bi-x-circle me-1"></i> Rechazar
                            </button>
                          </>
                        )}
                        {v.status === 'Aprobado' && (
                          <button className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold" onClick={() => onUpdateStatus(v.id, 'Ingresó')}>
                            <i className="bi bi-box-arrow-in-right me-1"></i> Ingreso
                          </button>
                        )}
                        {v.status === 'Ingresó' && (
                          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold" onClick={() => onUpdateStatus(v.id, 'Salió')}>
                            <i className="bi bi-box-arrow-right me-1"></i> Salida
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="bg-transparent text-center py-5 text-white-50">
                    <i className="bi bi-person-x fs-1 d-block mb-3 opacity-50"></i>
                    <p className="mb-0">{filtroStatus === 'Todos' ? 'No hay visitas registradas aún.' : `No hay visitas con estado "${filtroStatus}".`}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminMantenimiento = ({ onOpenModal, tickets, onCreate, onChangeStatus, onAssign, onAddNotes, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const allTickets = tickets || [];
  const pendientes = allTickets.filter(t => t.status === 'Pendiente' || t.status === 'En Proceso');
  const completados = allTickets.filter(t => t.status === 'Completado');

  const filteredPendientes = pendientes.filter(t => 
    (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.desc || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (p) => p === 'Alta' ? 'danger' : p === 'Media' ? 'warning' : 'info';

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <h5 className="text-white mb-0">Gestión de Tickets</h5>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div className="input-group w-100" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar ticket..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg text-nowrap w-100 w-sm-auto" onClick={() => onOpenModal('Nuevo Ticket (Preventivo)', 'form-ticket-admin', null, onCreate)}>
            <i className="bi bi-plus-lg me-2"></i> Crear Ticket
          </button>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 193, 7, 0.05)', border: '1px solid rgba(255, 193, 7, 0.2)' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="text-warning fw-bold mb-0"><i className="bi bi-tools me-2"></i> PENDIENTES ({filteredPendientes.length})</h6>
          </div>
          {filteredPendientes.length > 0 ? filteredPendientes.map(t => (
            <div className="card bg-transparent border-secondary border-opacity-50 p-4 mb-3 hover-cyan transition-all" key={t.id}>
              <div className="d-flex justify-content-between mb-2 align-items-center">
                <div className="d-flex gap-2">
                  <span className={`badge bg-${getPriorityColor(t.priority)} bg-opacity-25 text-${getPriorityColor(t.priority)} border border-${getPriorityColor(t.priority)} border-opacity-50 rounded-pill px-3`}>{t.priority}</span>
                  {t.status === 'En Proceso' && <span className="badge bg-info bg-opacity-25 text-info rounded-pill px-2"><i className="bi bi-gear me-1"></i>En Proceso</span>}
                </div>
                <small className="text-white-50"><i className="bi bi-calendar me-1"></i>{new Date(t.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</small>
              </div>
              <h5 className="text-white fw-bold mb-1">{t.title}</h5>
              <p className="text-white-50 small mb-2">{t.user?.name ? `Reportado por ${t.user.name} (${t.user.depto || 'N/A'})` : ''} {t.desc}</p>
              {t.assignedTo && <small className="text-info d-block mb-2"><i className="bi bi-person-gear me-1"></i>Técnico: {t.assignedTo}</small>}
              {t.notes && <small className="text-white-50 d-block mb-3 fst-italic"><i className="bi bi-sticky me-1"></i>{t.notes}</small>}
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-sm btn-outline-info rounded-pill flex-grow-1 fw-bold" onClick={() => onOpenModal('Asignar Técnico', 'form-asignar-tecnico', t, onAssign)}>Asignar Técnico</button>
                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => onOpenModal('Agregar Nota', 'form-nota-ticket', t, onAddNotes)}><i className="bi bi-sticky"></i></button>
                {t.status === 'Pendiente' && (
                  <button className="btn btn-sm btn-info rounded-pill px-3 text-dark fw-bold" onClick={() => onChangeStatus(t.id, 'En Proceso')}><i className="bi bi-play"></i></button>
                )}
                <button className="btn btn-sm btn-success rounded-pill px-3 shadow" title="Marcar completado" onClick={() => onOpenModal('Marcar como Completado', 'confirm-complete', { item: t.title }, () => onChangeStatus(t.id, 'Completado'))}><i className="bi bi-check2 fs-5"></i></button>
                <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onOpenModal('Eliminar Ticket', 'confirm-delete', { item: t.title }, () => onDelete(t.id))}><i className="bi bi-trash"></i></button>
              </div>
            </div>
          )) : (
            <div className="text-center text-white-50 mt-4 py-4">
              <i className="bi bi-clipboard-check fs-2 d-block mb-2 opacity-50"></i>
              <small>No hay tickets pendientes. ¡Todo al día!</small>
            </div>
          )}
        </div>
      </div>
      <div className="col-lg-6">
        <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(40, 167, 69, 0.05)', border: '1px solid rgba(40, 167, 69, 0.2)' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="text-success fw-bold mb-0"><i className="bi bi-check2-all me-2"></i> COMPLETADOS ({completados.length})</h6>
          </div>
          {completados.length > 0 ? completados.map(t => (
            <div className="card bg-transparent border-success border-opacity-25 p-4 mb-3 opacity-75" key={t.id}>
              <h5 className="text-white text-decoration-line-through mb-2">{t.title}</h5>
              <p className="text-white-50 small mb-1">{t.desc}</p>
              {t.assignedTo && <small className="text-success"><i className="bi bi-person-check me-1"></i>Completado por {t.assignedTo}</small>}
              {t.user?.name && <small className="text-white-50 d-block"><i className="bi bi-person me-1"></i>Solicitado por {t.user.name}</small>}
            </div>
          )) : (
            <div className="text-center text-white-50 mt-4 py-4">
              <i className="bi bi-hourglass fs-2 d-block mb-2 opacity-50"></i>
              <small>Aún no hay tickets completados.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminVotaciones = ({ onOpenModal }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/polls').then(res => { setPolls(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCreatePoll = async (data) => {
    try {
      const res = await api.post('/polls', data);
      // Recargar para obtener formato enriquecido
      const updated = await api.get('/polls');
      setPolls(updated.data);
    } catch (err) { alert(err.response?.data?.error || 'Error al crear votación'); }
  };

  const handleClosePoll = async (id) => {
    try {
      await api.put(`/polls/${id}/close`);
      setPolls(prev => prev.map(p => p.id === id ? { ...p, status: 'Cerrada' } : p));
    } catch (err) { alert(err.response?.data?.error || 'Error al cerrar votación'); }
  };

  const handleDeletePoll = async (id) => {
    try {
      await api.delete(`/polls/${id}`);
      setPolls(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Error al eliminar votación'); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-info"></div></div>;

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <h5 className="text-white mb-0">Gestión de Votaciones</h5>
        <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg text-nowrap" onClick={() => onOpenModal('Crear Votación', 'form-poll', null, handleCreatePoll)}>
          <i className="bi bi-plus-circle me-2"></i> Nueva Votación
        </button>
      </div>
      {polls.length > 0 ? polls.map(poll => (
        <div className="col-12" key={poll.id}>
          <div className="service-card-elite p-4">
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className={`badge bg-${poll.status === 'Activa' ? 'success' : 'secondary'} bg-opacity-25 text-${poll.status === 'Activa' ? 'success' : 'secondary'} rounded-pill px-3`}>{poll.status}</span>
                  <small className="text-white-50">{poll.totalVotes} voto{poll.totalVotes !== 1 ? 's' : ''}</small>
                </div>
                <h5 className="text-white fw-bold mb-1">{poll.title}</h5>
                <p className="text-white-50 small mb-3">{poll.description}</p>
                {poll.results.map((r, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="d-flex justify-content-between small text-white-50 mb-1"><span>{r.option}</span><span>{r.percentage}%</span></div>
                    <div className="progress rounded-pill" style={{ height: '6px', background: 'rgba(255,255,255,0.1)' }}>
                      <div className={`progress-bar bg-${idx === 0 ? 'info' : 'warning'}`} style={{ width: `${r.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex flex-lg-column gap-2 align-items-start">
                {poll.status === 'Activa' && (
                  <button className="btn btn-sm btn-outline-warning rounded-pill px-3" onClick={() => onOpenModal('Cerrar Votación', 'confirm-complete', { item: poll.title }, () => handleClosePoll(poll.id))}>
                    <i className="bi bi-lock me-1"></i> Cerrar
                  </button>
                )}
                <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onOpenModal('Eliminar Votación', 'confirm-delete', { item: poll.title }, () => handleDeletePoll(poll.id))}>
                  <i className="bi bi-trash me-1"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 py-5">
          <i className="bi bi-clipboard2-x fs-1 d-block mb-3 opacity-50"></i>
          <p>No hay votaciones creadas. Crea una para que los residentes puedan votar.</p>
        </div>
      )}
    </div>
  );
};

const AdminConfiguraciones = ({ onOpenModal, settings, setSettings, residents, onApprove, onReject, onCreateAdmin, onEditAdmin, onDeleteAdmin }) => {
  const [draft, setDraft] = useState(settings);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sincronizar el borrador si el state global cambia externamente

  const adminUsers = (residents || []).filter(r => r.role?.toUpperCase() === 'ADMIN');
  const pendingAdmins = adminUsers.filter(r => r.status === 'PENDIENTE');
  const activeAdmins = adminUsers.filter(r => r.status !== 'PENDIENTE');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(settings);
  }, [settings]);

  // Comprueba en tiempo real si el usuario modificó alguna configuración
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(settings);

  const handleSave = () => {
    onOpenModal('Guardar Configuración', 'confirm-save', null, () => {
      setSettings(draft);
      setShowSuccess(true);
      // Ocultar la notificación de éxito después de 3 segundos
      setTimeout(() => setShowSuccess(false), 3000);
    });
  };

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-white mb-0">Configuraciones del Sistema</h5>
        {showSuccess && (
          <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 px-3 py-2 rounded-pill shadow-sm" style={{ animation: 'fadeInDown 0.3s ease' }}>
            <i className="bi bi-check-circle-fill me-2"></i>Ajustes guardados con éxito
          </span>
        )}
      </div>

      <div className="col-lg-6">
        <div className="service-card-elite p-4 h-100">
          <div className="d-flex align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info me-3" style={{ width: '40px', height: '40px' }}><i className="bi bi-building fs-5"></i></div>
            <h5 className="text-white fw-bold mb-0">Perfil del Condominio</h5>
          </div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre Oficial</label>
            <input type="text" className="form-control bg-transparent text-white border-secondary shadow-none px-4 py-3 rounded-4" 
                   value={draft.condominioNombre} onChange={e => setDraft({...draft, condominioNombre: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Dirección Fiscal</label>
            <input type="text" className="form-control bg-transparent text-white border-secondary shadow-none px-4 py-3 rounded-4" 
                   value={draft.direccion} onChange={e => setDraft({...draft, direccion: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Moneda Principal</label>
            <select className="form-select bg-transparent text-white border-secondary shadow-none px-4 py-3 rounded-4"
                    value={draft.moneda} onChange={e => setDraft({...draft, moneda: e.target.value})}>
              <option value="USD" className="text-dark">Dólares (USD)</option>
              <option value="PEN" className="text-dark">Soles (PEN)</option>
              <option value="MXN" className="text-dark">Pesos (MXN)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="service-card-elite p-4 h-100">
          <div className="d-flex align-items-center mb-4 border-bottom border-secondary border-opacity-25 pb-3">
            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 text-warning me-3" style={{ width: '40px', height: '40px' }}><i className="bi bi-sliders fs-5"></i></div>
            <h5 className="text-white fw-bold mb-0">Preferencias Globales</h5>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-4 border border-secondary border-opacity-25 hover-cyan transition-all" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <h6 className="text-white mb-1"><i className="bi bi-whatsapp me-2 text-success"></i>Recordatorios Automáticos</h6>
              <small className="text-white-50">Enviar WhatsApp a morosos los días 5 de cada mes.</small>
            </div>
            <div className="form-check form-switch fs-4 m-0">
              <input className={`form-check-input border-0 shadow-none ${draft.recordatorios ? 'bg-info' : 'bg-secondary'}`} style={{ cursor: 'pointer' }} type="checkbox" checked={draft.recordatorios} onChange={e => setDraft({...draft, recordatorios: e.target.checked})} />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-4 border border-secondary border-opacity-25 hover-cyan transition-all" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <h6 className="text-white mb-1"><i className="bi bi-calendar-check me-2 text-info"></i>Reservas de Áreas Comunes</h6>
              <small className="text-white-50">Permitir a los residentes reservar desde la App Móvil.</small>
            </div>
            <div className="form-check form-switch fs-4 m-0">
              <input className={`form-check-input border-0 shadow-none ${draft.reservas ? 'bg-info' : 'bg-secondary'}`} style={{ cursor: 'pointer' }} type="checkbox" checked={draft.reservas} onChange={e => setDraft({...draft, reservas: e.target.checked})} />
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-4 border border-secondary border-opacity-25 hover-cyan transition-all" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <h6 className="text-white mb-1"><i className="bi bi-qr-code-scan me-2 text-white"></i>Aprobación de Visitas Automática</h6>
              <small className="text-white-50">Los códigos QR no requieren revisión en portería.</small>
            </div>
            <div className="form-check form-switch fs-4 m-0">
              <input className={`form-check-input border-0 shadow-none ${draft.visitasAuto ? 'bg-info' : 'bg-secondary'}`} style={{ cursor: 'pointer' }} type="checkbox" checked={draft.visitasAuto} onChange={e => setDraft({...draft, visitasAuto: e.target.checked})} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 mt-4">
        <div className="service-card-elite p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 pb-3 border-bottom border-secondary border-opacity-25 gap-3">
            <div className="d-flex align-items-center">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger me-3" style={{ width: '40px', height: '40px' }}><i className="bi bi-shield-lock fs-5"></i></div>
              <h5 className="text-white fw-bold mb-0">Cuentas Administrativas</h5>
            </div>
            <button className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold w-100 w-md-auto hover-cyan" onClick={() => onOpenModal('Registrar Administrador', 'form-admin', null, onCreateAdmin)}>
              <i className="bi bi-person-plus-fill me-2"></i>Añadir Administrador
            </button>
          </div>
          
          {/* --- ACTIVE ADMINS --- */}
          <div>
            <h6 className="text-info fw-bold mb-3"><i className="bi bi-shield-check me-2"></i>Administradores Activos ({activeAdmins.length})</h6>
            <div className="row g-4">
              {activeAdmins.map((a) => (
                <div className="col-xl-4 col-md-6" key={a.id}>
                  <div className="service-card-elite p-4 h-100 d-flex flex-column align-items-center text-center shadow-sm">
                    <div className="avatar-circle mb-3 shadow-lg bg-danger bg-opacity-10 text-danger" style={{ width: '65px', height: '65px', fontSize: '1.6rem' }}><i className="bi bi-shield-lock-fill"></i></div>
                    <h5 className="text-white fw-bold mb-1">{a.name}</h5>
                    <small className="text-info mb-3">{a.email}</small>
                    <div className="mt-auto w-100">
                      <div className="d-flex gap-2 w-100 mt-3 pt-3 border-top border-secondary border-opacity-25">
                        <button className="btn btn-sm btn-outline-info flex-grow-1 rounded-pill fw-bold" onClick={() => onOpenModal('Editar Administrador', 'form-admin', a, onEditAdmin)}><i className="bi bi-pencil-square me-1"></i> Editar</button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onOpenModal('Eliminar Admin', 'confirm-delete', { item: a.name }, () => onDeleteAdmin(a.id))}><i className="bi bi-trash"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      <div className="col-12 mt-2">
        <div className="d-flex flex-column flex-md-row justify-content-end align-items-center gap-3 p-4 rounded-4" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {hasChanges && <span className="text-warning small fw-bold me-auto animate-pulse"><i className="bi bi-info-circle-fill me-1"></i> Tienes cambios sin guardar</span>}
          <button className={`btn btn-outline-light w-100 w-md-auto rounded-pill px-4 fw-bold ${hasChanges ? '' : 'opacity-50'}`} disabled={!hasChanges} onClick={() => setDraft(settings)}>Descartar Cambios</button>
          <button className={`btn btn-premium-unique w-100 w-md-auto rounded-pill px-5 py-2 fw-bold text-white shadow-lg ${hasChanges ? '' : 'opacity-50'}`} disabled={!hasChanges} onClick={handleSave}><i className="bi bi-save-fill me-2"></i>Guardar Configuración</button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ activeTab, onOpenModal, residents, setResidents, comunicados, setComunicados, areas, setAreas, tickets, setTickets, isLoadingUsers }) => {
  const [settings, setSettings] = useState({
    condominioNombre: "Residencial Los Pinos",
    direccion: "Av. Principal 123, Ciudad Central",
    moneda: "USD",
    recordatorios: true,
    reservas: true,
    visitasAuto: false
  });
  const [morosos, setMorosos] = useState([
    { id: 1, residente: 'Carlos Mendoza', iniciales: 'CM', unidad: 'Dpto 801', deuda: '$300.00' },
    { id: 2, residente: 'Ana Ríos', iniciales: 'AR', unidad: 'Dpto 305', deuda: '$150.00' }
  ]);
  const usersError = '';
  const [createdUser, setCreatedUser] = useState(null);

  const refreshUsers = async () => {
    try {
      const res = await api.get('/users');
      const adapted = res.data.map(user => {
        const dbStatus = user.status ? user.status.toUpperCase() : null;
        const safeStatus = dbStatus || (user.name === 'Usuario Pendiente' ? 'PENDIENTE' : 'ACTIVO');
        return {
          id: user.id, name: user.name, email: user.email, depto: user.depto,
          phone: user.phone, role: user.role, status: safeStatus,
          color: safeStatus === 'PENDIENTE' ? 'warning' : 'success'
        };
      });
      setResidents(adapted);
    } catch (err) {
      console.error('Error al recargar usuarios:', err);
    }
  };

  // --- FUNCIONES CRUD PARA EL BACKEND ---
  const showPasswordAlert = (name, email, password) => {
    setCreatedUser({ name, email, password });
  };

  const handleCreateResident = async (formData) => {
    try {
      const res = await api.post('/users', { ...formData, role: 'RESIDENTE', status: 'ACTIVO' });
      const u = res.data;
      setResidents(prev => [{ ...u, status: (u.status || 'ACTIVO').toUpperCase(), color: 'success' }, ...prev]);
      showPasswordAlert(u.name, u.email, u.generatedPassword);
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo crear el residente. Verifica la conexión con el servidor.');
      throw err;
    }
  };

  const handleCreateSecurity = async (formData) => {
    try {
      const res = await api.post('/users', { ...formData, role: 'SEGURIDAD', status: 'ACTIVO' });
      const u = res.data;
      setResidents(prev => [{ ...u, status: (u.status || 'ACTIVO').toUpperCase(), color: 'success' }, ...prev]);
      showPasswordAlert(u.name, u.email, u.generatedPassword);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar oficial.');
      throw err;
    }
  };

  const handleCreateAdmin = async (formData) => {
    try {
      const res = await api.post('/users', { ...formData, role: 'ADMIN', status: 'ACTIVO', depto: 'Administración' });
      const u = res.data;
      setResidents(prev => [{ ...u, status: (u.status || 'ACTIVO').toUpperCase(), color: 'success' }, ...prev]);
      showPasswordAlert(u.name, u.email, u.generatedPassword);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrar administrador.');
      throw err;
    }
  };

  const handleApproveResident = async (user) => {
    try {
      console.log(`[Frontend] Enviando petición para aprobar ID: ${user.id}`);
      const response = await api.put(`/users/${user.id}/approve`);
      setResidents(prev => prev.map(res => res.id === user.id ? { ...res, status: 'ACTIVO', color: 'success' } : res));
      
      // Si el backend avisa que falló el correo (pero sí se guardó en BD), lo mostramos:
      if (response.data.message && response.data.message.includes('correo no se pudo enviar')) {
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Error al aprobar:", err);
      if (err.response?.status === 404) {
        alert("Error 404: Ruta no encontrada. Esto significa que tu backend sigue ejecutando una versión antigua en memoria. ¡Ve a la terminal del backend, presiona Ctrl+C y vuelve a ejecutar 'npm run dev'!");
      } else {
        alert(err.response?.data?.message || "Error de conexión: El servidor no responde.");
      }
    }
  };

  const handleRejectResident = async (userId) => {
    try {
      console.log(`[Frontend] Enviando petición para rechazar ID: ${userId}`);
      await api.put(`/users/${userId}/reject`);
      setResidents(prev => prev.filter(r => r.id !== userId));
    } catch (err) {
      console.error("Error al rechazar:", err);
      if (err.response?.status === 404) {
        alert("Error 404: Ruta no encontrada. ¡Por favor, reinicia tu servidor backend (npm run dev) para aplicar los cambios de código!");
      } else {
        alert(err.response?.data?.message || err.response?.data?.error || err.message || "Error crítico al rechazar al residente.");
      }
    }
  };

  const handleEditResident = async (updatedRes) => {
    try {
      await api.put(`/users/${updatedRes.id}`, updatedRes);
      setResidents(prev => prev.map(res => res.id === updatedRes.id ? updatedRes : res));
    } catch (err) {
      alert(err.response?.data?.message || "Error al actualizar el residente");
    }
  };

  const handleDeleteResident = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setResidents(prev => prev.filter(r => r.id !== userId));
    } catch (err) {
      alert("No se pudo eliminar al usuario.");
    }
  };

  // --- CRUD COMUNICADOS ---
  const handleCreateComunicado = async (data) => {
    try {
      const res = await api.post('/announcements', data);
      res.data.date = new Date(res.data.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      setComunicados(prev => [res.data, ...prev]);
    } catch (err) { alert('Error al crear comunicado'); }
  };
  const handleEditComunicado = async (data) => {
    try {
      const res = await api.put(`/announcements/${data.id}`, data);
      res.data.date = new Date(res.data.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      setComunicados(prev => prev.map(c => c.id === data.id ? res.data : c));
    } catch (err) { alert('Error al editar comunicado'); }
  };
  const handleDeleteComunicado = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setComunicados(prev => prev.filter(c => c.id !== id));
    } catch (err) { alert('Error al eliminar comunicado'); }
  };

  // --- CRUD ÁREAS ---
  const [reservations, setReservations] = useState([]);

  // --- VISITAS ---
  const [visitors, setVisitors] = useState([]);

  // Cargar reservas pendientes y visitas para el admin
  useEffect(() => {
    api.get('/reservations').then(res => setReservations(res.data)).catch(() => {});
    api.get('/visitors').then(res => setVisitors(res.data)).catch(() => {});
  }, []);

  const handleApproveReservation = async (id) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'Aprobada' });
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Error al aprobar reserva'); }
  };

  const handleRejectReservation = async (id) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'Rechazada' });
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Error al rechazar reserva'); }
  };

  // --- VISITAS HANDLERS ---
  const handleUpdateVisitorStatus = async (id, status) => {
    try {
      const res = await api.patch(`/visitors/${id}/status`, { status });
      setVisitors(prev => prev.map(v => v.id === id ? res.data : v));
    } catch (err) { alert(err.response?.data?.error || 'Error al actualizar visita'); }
  };

  const handleCreateArea = async (data) => {
    try {
      const res = await api.post('/areas', data);
      setAreas(prev => [...prev, res.data]);
    } catch (err) { alert('Error al registrar área'); }
  };
  const handleEditArea = async (data) => {
    try {
      const res = await api.put(`/areas/${data.id}`, data);
      setAreas(prev => prev.map(a => a.id === data.id ? res.data : a));
    } catch (err) { alert('Error al editar área'); }
  };
  const handleDeleteArea = async (id) => {
    try {
      await api.delete(`/areas/${id}`);
      setAreas(prev => prev.filter(a => a.id !== id));
    } catch (err) { alert('Error al eliminar área'); }
  };
  const handleToggleAreaStatus = async (area) => {
    try {
      const newStatus = area.status === 'Mantenimiento' ? 'Activa' : 'Mantenimiento';
      const newColor = newStatus === 'Mantenimiento' ? 'warning' : 'success';
      const res = await api.put(`/areas/${area.id}`, { ...area, status: newStatus, color: newColor });
      setAreas(prev => prev.map(a => a.id === area.id ? res.data : a));
    } catch (err) { alert('Error al cambiar el estado del área'); }
  };

  // --- CRUD TICKETS ---
  const handleCreateTicket = async (data) => {
    try {
      const res = await api.post('/tickets', data);
      setTickets(prev => [res.data, ...prev]);
    } catch (err) { alert(err.response?.data?.error || 'Error al crear ticket'); }
  };
  const handleChangeTicketStatus = async (id, status) => {
    try {
      const res = await api.put(`/tickets/${id}/status`, { status });
      setTickets(prev => prev.map(t => t.id === id ? res.data : t));
    } catch (err) { alert(err.response?.data?.error || 'Error al cambiar estado'); }
  };
  const handleAssignTicket = async (data) => {
    try {
      const res = await api.put(`/tickets/${data.id}/assign`, { assignedTo: data.assignedTo });
      setTickets(prev => prev.map(t => t.id === data.id ? res.data : t));
    } catch (err) { alert(err.response?.data?.error || 'Error al asignar técnico'); }
  };
  const handleAddTicketNotes = async (data) => {
    try {
      const res = await api.put(`/tickets/${data.id}/notes`, { notes: data.notes });
      setTickets(prev => prev.map(t => t.id === data.id ? res.data : t));
    } catch (err) { alert(err.response?.data?.error || 'Error al agregar nota'); }
  };
  const handleDeleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      setTickets(prev => prev.filter(t => t.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Error al eliminar ticket'); }
  };

  switch (activeTab) {
    case 'Directorio Residentes': return <AdminDirectorio onOpenModal={onOpenModal} residents={residents} setResidents={setResidents} onCreateResident={handleCreateResident} onEditResident={handleEditResident} onDeleteResident={handleDeleteResident} onApprove={handleApproveResident} onReject={handleRejectResident} isLoading={isLoadingUsers} error={usersError} />;
    case 'Gestión de Seguridad': return <AdminSeguridad onOpenModal={onOpenModal} residents={residents} onCreate={handleCreateSecurity} onEdit={handleEditResident} onDelete={handleDeleteResident} onApprove={handleApproveResident} onReject={handleRejectResident} />;
    case 'Registro de Visitas': return <AdminVisitas onOpenModal={onOpenModal} visitors={visitors} onUpdateStatus={handleUpdateVisitorStatus} />;
    case 'Comunicados': return <AdminComunicados onOpenModal={onOpenModal} comunicados={comunicados} onCreate={handleCreateComunicado} onEdit={handleEditComunicado} onDelete={handleDeleteComunicado} />;
    case 'Gestión de Áreas': return <AdminAreas onOpenModal={onOpenModal} areas={areas} onCreate={handleCreateArea} onEdit={handleEditArea} onDelete={handleDeleteArea} onToggleStatus={handleToggleAreaStatus} reservations={reservations} onApproveReservation={handleApproveReservation} onRejectReservation={handleRejectReservation} />;
    case 'Mantenimiento': return <AdminMantenimiento onOpenModal={onOpenModal} tickets={tickets} onCreate={handleCreateTicket} onChangeStatus={handleChangeTicketStatus} onAssign={handleAssignTicket} onAddNotes={handleAddTicketNotes} onDelete={handleDeleteTicket} />;
    case 'Votaciones': return <AdminVotaciones onOpenModal={onOpenModal} />;
    case 'Configuraciones': return <AdminConfiguraciones onOpenModal={onOpenModal} settings={settings} setSettings={setSettings} residents={residents} onApprove={handleApproveResident} onReject={handleRejectResident} onCreateAdmin={handleCreateAdmin} onEditAdmin={handleEditResident} onDeleteAdmin={handleDeleteResident} /> ;
    default: return <AdminPanelControl onOpenModal={onOpenModal} tickets={tickets} residents={residents} />;
  }
};

const ResidenteMiDomicilio = ({ userName, userEmail, userDepto, onOpenModal, integrantes, setIntegrantes, setVisitas, setReservas, onCreateReserva, onCreateVisita, onCreateIncidencia, onAddIntegrante, onDeleteIntegrante }) => {
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'JP';

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
    <div className="col-lg-4">
      <div className="service-card-elite p-4 h-100 position-relative overflow-hidden">
        <div className="position-absolute top-0 end-0 p-3 opacity-25"><i className="bi bi-house-heart display-1"></i></div>
        <div className="d-flex align-items-center mb-4 relative" style={{ zIndex: 1 }}>
          <div className="avatar-circle shadow-lg me-3" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>{initials}</div>
          <div>
            <h4 className="text-white fw-bold mb-1">{userName || 'Juan Pérez'}</h4>
            <span className="badge bg-primary bg-opacity-25 text-info rounded-pill px-3">Titular • {userDepto && userDepto !== 'N/A' ? `Dpto ${userDepto}` : userEmail}</span>
          </div>
        </div>
        <div className="row g-3 relative" style={{ zIndex: 1 }}>
          <div className="col-12 col-sm-6"><button className="btn btn-outline-success w-100 rounded-4 py-3 hover-cyan" onClick={() => onOpenModal('Autorizar Nueva Visita', 'form-visita', null, onCreateVisita)}><i className="bi bi-person-check fs-4 d-block mb-1"></i> Nueva Visita</button></div>
          <div className="col-12 col-sm-6"><button className="btn btn-outline-warning w-100 rounded-4 py-3 hover-cyan" onClick={() => onOpenModal('Nueva Reserva', 'form-reserva', null, onCreateReserva)}><i className="bi bi-calendar-star fs-4 d-block mb-1"></i> Reservar</button></div>
          <div className="col-12 col-sm-6"><button className="btn btn-outline-danger w-100 rounded-4 py-3 hover-cyan" onClick={() => onOpenModal('Reportar Problema', 'form-incidencia', null, onCreateIncidencia)}><i className="bi bi-exclamation-octagon fs-4 d-block mb-1"></i> Reportar</button></div>
        </div>
      </div>
    </div>
    <div className="col-lg-8">
      <div className="row g-4">
        <div className="col-sm-6">
          <div className="service-card-elite p-4 h-100 d-flex flex-column justify-content-center">
            <h6 className="text-white-50 text-uppercase small fw-bold mb-3"><i className="bi bi-car-front-fill me-2"></i>Vehículo Registrado</h6>
            <div className="d-flex align-items-center">
              <div className="bg-dark rounded-3 p-2 px-3 border border-secondary me-3"><span className="fw-bold text-white fs-5">ABC-123</span></div>
              <div><h6 className="text-white fw-bold mb-0">Toyota Yaris</h6><small className="text-white-50">Estacionamiento #45</small></div>
            </div>
          </div>
        </div>
        
        <div className="col-12 mt-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
            <h5 className="text-white mb-0 text-center text-sm-start">Integrantes del Departamento</h5>
            <button className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold w-100 w-sm-auto" onClick={() => onOpenModal('Agregar Integrante', 'form-integrante', null, onAddIntegrante)}><i className="bi bi-person-plus me-1"></i> Agregar</button>
          </div>
          <div className="service-card-elite p-0 overflow-auto">
            <table className="table table-dark table-hover mb-0 bg-transparent text-white-50 align-middle text-nowrap">
              <tbody>
                {integrantes.map((int) => (
                  <tr key={int.id}>
                    <td className="bg-transparent py-3 px-4"><div className="d-flex align-items-center"><div className="avatar-circle me-3 shadow-sm" style={{ width: '35px', height: '35px', fontSize: '0.9rem', background: int.color || '' }}>{int.iniciales}</div><span className="text-white fw-medium">{int.nombre}</span></div></td>
                    <td className="bg-transparent py-3">{int.rol}</td>
                    <td className="bg-transparent py-3 text-end px-4">
                      <button className="btn btn-sm btn-link text-danger p-0" onClick={() => onOpenModal('Eliminar Integrante', 'confirm-delete', { item: int.nombre }, () => onDeleteIntegrante(int.id))}><i className="bi bi-trash fs-5"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

const ResidenteVisitas = ({ onOpenModal, visitas, setVisitas, onCreateVisita, onDeleteVisita }) => (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <h5 className="text-white mb-0">Control de Visitas</h5>
        <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg w-100 w-md-auto" onClick={() => onOpenModal('Autorizar Ingreso', 'form-visita', null, onCreateVisita)}>
          <i className="bi bi-person-check me-2"></i> Autorizar Visita
        </button>
      </div>
      {visitas.length > 0 ? visitas.map((v) => (
        <div className="col-lg-6" key={v.id}>
          <div className="service-card-elite p-4 h-100 d-flex position-relative align-items-center">
            <div className={`d-flex align-items-center justify-content-center rounded-4 me-4 bg-${v.color} bg-opacity-10 text-${v.color} border border-${v.color} border-opacity-25 shadow-sm`} style={{ width: '70px', height: '70px' }}>
              <i className={`bi ${v.icon} fs-1`}></i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className="text-white fw-bold mb-0">{v.name}</h5>
                <span className="badge bg-secondary bg-opacity-25 text-white-50 rounded-pill">{v.type}</span>
              </div>
              <p className="text-white-50 small mb-1"><i className="bi bi-clock me-1"></i> {v.date}</p>
              <span className={`badge bg-${v.status === 'Pendiente' ? 'warning' : v.status === 'Aprobado' ? 'info' : v.status === 'Ingresó' ? 'success' : 'secondary'} bg-opacity-25 text-${v.status === 'Pendiente' ? 'warning' : v.status === 'Aprobado' ? 'info' : v.status === 'Ingresó' ? 'success' : 'secondary'} rounded-pill px-2`} style={{ fontSize: '0.7rem' }}>{v.status}</span>
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2">
                  <small className="text-white-50 text-uppercase tracking-widest" style={{ fontSize: '0.7rem' }}>PIN DE ACCESO:</small>
                  <span className="badge bg-light text-dark fs-6 font-monospace">{v.pin}</span>
                </div>
                {v.status === 'Pendiente' && (
                  <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onOpenModal('Cancelar Visita', 'confirm-delete', { item: v.name }, () => onDeleteVisita(v.id))}><i className="bi bi-x-circle"></i></button>
                )}
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 mt-5 py-5">
          <i className="bi bi-person-x fs-1 d-block mb-3 opacity-50"></i>
          <p>No tienes visitas registradas. ¡Autoriza una visita!</p>
        </div>
      )}
    </div>
  );

const ResidenteReservas = ({ onOpenModal, reservas, setReservas, onCreateReserva, onDeleteReserva }) => (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <h5 className="text-white mb-0">Mis Reservas</h5>
        <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg w-100 w-md-auto" onClick={() => onOpenModal('Nueva Reserva', 'form-reserva', null, onCreateReserva)}>
          <i className="bi bi-calendar-plus me-2"></i> Reservar Área
        </button>
      </div>
      <div className="col-12 mt-2">
        <div className="service-card-elite p-0 overflow-auto">
          <table className="table table-dark table-hover mb-0 bg-transparent text-white-50 align-middle text-nowrap">
            <tbody>
              {reservas.length > 0 ? reservas.map((r) => (
                <tr key={r.id}>
                  <td className="bg-transparent py-3 px-4"><div className="d-flex align-items-center"><i className={`bi ${r.icon} fs-4 me-3 text-${r.color === 'secondary' ? 'info' : r.color}`}></i><span className="text-white fw-medium">{r.area}</span></div></td>
                  <td className="bg-transparent py-3">{r.date} <small className="d-block opacity-50">{r.time}</small></td>
                  <td className="bg-transparent py-3"><span className={`badge bg-${r.color} bg-opacity-25 text-${r.color === 'secondary' ? 'white-50' : r.color} rounded-pill px-3`}>{r.status}</span></td>
                  <td className="bg-transparent py-3 text-end px-4">
                    {r.status === 'Pendiente' && (
                      <button className="btn btn-sm btn-link text-danger p-0" onClick={() => onOpenModal('Cancelar Reserva', 'confirm-delete', { item: r.area }, () => onDeleteReserva(r.id))}><i className="bi bi-trash fs-5"></i></button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="bg-transparent text-center py-5 text-white-50">No tienes reservas aún. ¡Reserva un área común!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

const ResidenteComunicados = ({ comunicados }) => {
  const getPriorityLabel = (type) => {
    if (type === 'danger') return { text: 'Muy Importante', color: 'danger', icon: 'bi-exclamation-triangle-fill' };
    if (type === 'warning') return { text: 'Importante', color: 'warning', icon: 'bi-exclamation-circle-fill' };
    return { text: 'Informativo', color: 'info', icon: 'bi-info-circle-fill' };
  };

  return (
  <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
    <div className="col-12 mb-2">
      <h5 className="text-white mb-0">Avisos de Administración</h5>
    </div>
    {comunicados.length > 0 ? comunicados.map((c) => {
      const priority = getPriorityLabel(c.type);
      return (
      <div className="col-12" key={c.id}>
        <div className="service-card-elite p-4 p-md-5 d-flex flex-column position-relative border-start border-4 border-bottom-0 border-top-0 border-end-0" style={{ borderLeftColor: `var(--bs-${c.type || 'info'}) !important` }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <div className="d-flex align-items-center gap-3">
              <div className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-${c.type || 'info'} bg-opacity-25 text-${c.type || 'info'}`} style={{ width: '50px', height: '50px' }}><i className={`bi ${priority.icon} fs-4`}></i></div>
              <div>
                <h4 className="text-white fw-bold mb-0">{c.title}</h4>
                <small className="text-white-50"><i className="bi bi-person me-1"></i> Administración Central</small>
              </div>
            </div>
            <div className="d-flex flex-column align-items-md-end gap-1">
              <span className={`badge bg-${priority.color} bg-opacity-25 text-${priority.color} border border-${priority.color} border-opacity-50 rounded-pill px-3 py-1`}>
                <i className={`bi ${priority.icon} me-1`}></i>{priority.text}
              </span>
              <span className="badge bg-dark border border-secondary text-white-50 py-2 px-3 rounded-pill"><i className="bi bi-calendar-event me-2"></i>{c.date || new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <p className="text-white opacity-75 fs-5 lh-lg mb-0">{c.desc}</p>
        </div>
      </div>
      );
    }) : (
      <div className="col-12 text-center text-white-50 mt-5 py-5">
        <i className="bi bi-bell-slash fs-1 d-block mb-3 opacity-50"></i>
        <p>No hay comunicados recientes.</p>
      </div>
    )}
  </div>
  );
};

const ResidenteAsambleas = ({ onOpenModal }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/polls').then(res => { setPolls(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleVote = async (pollId, option) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { option });
      // Recargar polls para actualizar porcentajes
      const res = await api.get('/polls');
      setPolls(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al votar');
    }
  };

  const getDaysLeft = (closesAt) => {
    const diff = Math.ceil((new Date(closesAt) - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `Cierra en ${diff} día${diff > 1 ? 's' : ''}` : 'Cerrada';
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-info"></div></div>;

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 mb-2">
        <h5 className="text-white mb-0">Decisiones Comunitarias</h5>
      </div>
      {polls.length > 0 ? polls.map(poll => (
        <div className="col-12" key={poll.id}>
          <div className="service-card-elite p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className={`badge bg-${poll.status === 'Activa' ? 'danger' : 'secondary'} bg-opacity-25 text-${poll.status === 'Activa' ? 'danger' : 'secondary'} border border-${poll.status === 'Activa' ? 'danger' : 'secondary'} border-opacity-50 rounded-pill px-3 py-2`}>
                <i className={`bi ${poll.status === 'Activa' ? 'bi-record-circle' : 'bi-lock'} me-2`}></i>{poll.status === 'Activa' ? 'Votación Activa' : 'Votación Cerrada'}
              </span>
              <small className="text-white-50">{getDaysLeft(poll.closesAt)}</small>
            </div>
            <h3 className="text-white fw-bold mb-3">{poll.title}</h3>
            <p className="text-white-50 mb-4">{poll.description}</p>
            
            {/* Resultados */}
            <div className="mb-4">
              {poll.results.map((r, idx) => (
                <div key={idx} className="mb-3">
                  <div className="d-flex justify-content-between text-white-50 small mb-1">
                    <span>{r.option}</span>
                    <span>{r.percentage}% ({r.count} voto{r.count !== 1 ? 's' : ''})</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: '10px', background: 'rgba(255,255,255,0.1)' }}>
                    <div className={`progress-bar bg-${idx === 0 ? 'info' : 'warning'}`} style={{ width: `${r.percentage}%` }}></div>
                  </div>
                </div>
              ))}
              <small className="text-white-50 mt-2 d-block">{poll.totalVotes} voto{poll.totalVotes !== 1 ? 's' : ''} total{poll.totalVotes !== 1 ? 'es' : ''}</small>
            </div>
            
            {/* Botón de votar */}
            {poll.status === 'Activa' && !poll.userVoted && (
              <div className="text-center text-sm-end mt-4 border-top border-secondary border-opacity-25 pt-4">
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end">
                  {poll.options.map((opt, idx) => (
                    <button key={idx} className={`btn btn-${idx === 0 ? 'info' : 'outline-warning'} rounded-pill px-4 py-2 fw-bold`} onClick={() => handleVote(poll.id, opt)}>
                      <i className="bi bi-check2-square me-2"></i>{opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {poll.userVoted && (
              <div className="text-center text-sm-end mt-4 border-top border-secondary border-opacity-25 pt-4">
                <button className="btn btn-success rounded-pill px-5 py-3 fw-bold text-white shadow-lg w-100 w-sm-auto" disabled>
                  <i className="bi bi-check-all me-2"></i> Voto Registrado ({poll.userChoice})
                </button>
              </div>
            )}
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 py-5">
          <i className="bi bi-clipboard2-x fs-1 d-block mb-3 opacity-50"></i>
          <p>No hay votaciones activas en este momento.</p>
        </div>
      )}
    </div>
  );
};

const ResidenteIncidencias = ({ onOpenModal, incidencias, onCreate, onDelete }) => (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-3">
        <h5 className="text-white mb-0">Historial de Reportes</h5>
        <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg w-100 w-md-auto" onClick={() => onOpenModal('Reportar Problema', 'form-incidencia', null, onCreate)}>
          <i className="bi bi-exclamation-triangle me-2"></i> Nueva Incidencia
        </button>
      </div>
      <div className="col-12">
        <div className="service-card-elite p-0 overflow-auto">
          <table className="table table-dark table-hover mb-0 bg-transparent text-white-50 align-middle text-nowrap">
            <thead>
              <tr>
                <th className="bg-transparent text-white border-bottom border-secondary py-3 px-4">Asunto</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3">Fecha</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3">Estado</th>
                <th className="bg-transparent text-white border-bottom border-secondary py-3 text-end px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map(i => (
                <tr key={i.id}>
                  <td className={`bg-transparent py-3 px-4 text-white fw-medium ${i.priority === 'Resuelto' ? 'text-decoration-line-through opacity-50' : ''}`}>{i.title}</td>
                  <td className={`bg-transparent py-3 ${i.priority === 'Resuelto' ? 'opacity-50' : ''}`}>{i.date || (i.createdAt ? new Date(i.createdAt).toLocaleDateString() : '')}</td>
                  <td className="bg-transparent py-3"><span className={`badge bg-${i.color || 'warning'} bg-opacity-25 text-${i.color || 'warning'} border border-${i.color || 'warning'} border-opacity-50 rounded-pill ${i.priority === 'Resuelto' ? 'opacity-75' : ''}`}>{i.priority || 'En Revisión'}</span></td>
                  <td className="bg-transparent py-3 text-end px-4">
                    <button className={`btn btn-sm btn-outline-${i.priority === 'Resuelto' ? 'secondary' : 'danger'} rounded-pill px-3`} disabled={i.priority === 'Resuelto'} onClick={() => onOpenModal('Eliminar Reporte', 'confirm-delete', { item: i.title }, () => onDelete(i.id))}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

const ResidenteEstacionamiento = ({ onOpenModal, solicitudes, setSolicitudes }) => {
  const [espacios, setEspacios] = useState(4);
  const [carritos, setCarritos] = useState(3);

  const handleReservarEstacionamiento = (sol) => {
    setSolicitudes(prev => [sol, ...prev]);
    setEspacios(prev => Math.max(0, prev - 1));
  };

  const handlePedirCarrito = (sol) => {
    setSolicitudes(prev => [sol, ...prev]);
    setCarritos(prev => Math.max(0, prev - 1));
  };

  const handleCancelarSolicitud = (sol) => {
    setSolicitudes(prev => prev.filter(s => s.id !== sol.id));
    if (sol.tipo?.includes('Reserva') || sol.tipo?.includes('Estacionamiento')) {
      setEspacios(prev => prev + 1);
    }
    if (sol.tipo?.includes('Carrito')) {
      setCarritos(prev => prev + 1);
    }
  };

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 mb-2">
        <h5 className="text-white mb-0">Gestión de Vehículos y Carga</h5>
      </div>
      <div className="col-lg-6">
        <div className="service-card-elite p-4 h-100 d-flex flex-column">
          <h6 className="text-white-50 text-uppercase small fw-bold mb-4"><i className="bi bi-car-front me-2"></i>Estacionamiento de Visitas</h6>
          <div className="d-flex align-items-center mb-4">
            <div className={`bg-dark rounded-circle p-3 border border-${espacios > 0 ? 'success' : 'danger'} me-3 shadow-sm text-${espacios > 0 ? 'success' : 'danger'}`}><i className="bi bi-p-circle fs-2"></i></div>
            <div><h4 className="text-white fw-bold mb-1">{espacios} Espacio{espacios !== 1 ? 's' : ''}</h4><small className="text-white-50">{espacios > 0 ? 'Disponibles ahora mismo' : 'No hay espacios disponibles'}</small></div>
          </div>
          <button className="btn btn-outline-info rounded-pill py-3 w-100 fw-bold mb-3 hover-cyan mt-auto" disabled={espacios === 0} onClick={() => onOpenModal('Reservar Estacionamiento', 'form-reserva-estacionamiento', null, handleReservarEstacionamiento)}>
            <i className="bi bi-calendar-plus me-2"></i> Reservar para Visita
          </button>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="service-card-elite p-4 h-100 d-flex flex-column" style={{ border: '1px solid rgba(255, 193, 7, 0.2)' }}>
          <h6 className="text-warning text-uppercase small fw-bold mb-4"><i className="bi bi-arrow-left-right me-2"></i>Préstamo entre Vecinos</h6>
          <p className="text-white-50 mb-4 lh-lg">¿Tienes más de una visita o los espacios comunes están llenos? Solicita permiso a un vecino para usar su estacionamiento temporalmente.</p>
          <button className="btn btn-outline-warning rounded-pill py-3 w-100 fw-bold mt-auto hover-cyan" onClick={() => onOpenModal('Solicitar Estacionamiento a Vecino', 'form-permiso-estacionamiento', null, (sol) => setSolicitudes(prev => [sol, ...prev]))}>
            <i className="bi bi-send-plus me-2"></i> Solicitar Permiso
          </button>
        </div>
      </div>
      <div className="col-12 mt-4">
        <div className="service-card-elite p-4 p-md-5 d-flex flex-column flex-lg-row align-items-center justify-content-between text-center text-lg-start gap-4" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(0,86,179,0.1))' }}>
          <div className="d-flex flex-column flex-sm-row align-items-center gap-4">
            <div className="position-relative"><div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-25 text-info" style={{ width: '80px', height: '80px' }}><i className="bi bi-cart4 display-5"></i></div><span className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-${carritos > 0 ? 'success' : 'danger'} border border-dark`}>{carritos} Libre{carritos !== 1 ? 's' : ''}</span></div>
            <div><h3 className="text-white fw-bold mb-1">Carritos de Carga</h3><p className="text-white-50 mb-0">Facilita el traslado de tus compras o equipaje desde el sótano hasta tu departamento.</p></div>
          </div>
          <button className="btn btn-premium-unique rounded-pill px-5 py-3 fw-bold text-white shadow-lg text-nowrap w-100 w-lg-auto" disabled={carritos === 0} onClick={() => onOpenModal('Solicitar Carrito de Carga', 'form-carrito', null, handlePedirCarrito)}>
            <i className="bi bi-cart-plus me-2"></i> Pedir Carrito
          </button>
        </div>
      </div>
      {solicitudes.length > 0 && (
        <div className="col-12 mt-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
          <h6 className="text-white-50 text-uppercase small fw-bold mb-3">Historial de Solicitudes</h6>
          <div className="service-card-elite p-0 overflow-auto">
            <table className="table table-dark table-hover mb-0 bg-transparent text-white-50 align-middle text-nowrap">
              <tbody>
                {solicitudes.map(s => (
                  <tr key={s.id}>
                    <td className="bg-transparent py-3 px-4"><span className="text-white fw-medium">{s.tipo}</span></td>
                    <td className="bg-transparent py-3">{s.detalle}</td>
                    <td className="bg-transparent py-3"><span className={`badge bg-${s.color} bg-opacity-25 text-${s.color} rounded-pill px-3`}>{s.estado}</span></td>
                    <td className="bg-transparent py-3 text-end px-4">
                      <button className="btn btn-sm btn-link text-danger p-0" onClick={() => onOpenModal('Cancelar Solicitud', 'confirm-delete', { item: s.tipo }, () => handleCancelarSolicitud(s))}><i className="bi bi-trash fs-5"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal show={!!createdUser} onClose={() => setCreatedUser(null)} title="Usuario creado exitosamente">
        {createdUser && (
          <div className="text-center py-2">
            <div className="mb-4">
              <i className="bi bi-person-check-fill text-info" style={{ fontSize: '3rem' }}></i>
            </div>
            <div className="d-flex flex-column gap-3 text-start mb-4">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <i className="bi bi-person-fill text-info fs-5"></i>
                <div>
                  <div className="text-white-50 small">Nombre</div>
                  <div className="text-white fw-semibold">{createdUser.name}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <i className="bi bi-envelope-fill text-info fs-5"></i>
                <div>
                  <div className="text-white-50 small">Correo</div>
                  <div className="text-white fw-semibold">{createdUser.email}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <i className="bi bi-key-fill text-info fs-5"></i>
                <div>
                  <div className="text-white-50 small">Contraseña temporal</div>
                  <div className="fw-bold fs-5 font-monospace" style={{ color: '#00d4ff', letterSpacing: '4px' }}>{createdUser.password}</div>
                </div>
              </div>
            </div>
            <p className="text-white-50 small mb-4">Se envió un correo de bienvenida con estas credenciales. Se recomienda cambiar la contraseña al iniciar sesión.</p>
            <button className="btn btn-info rounded-pill px-4 fw-bold" onClick={() => setCreatedUser(null)}>Aceptar</button>
          </div>
        )}
      </Modal>

    </div>
  );
};

const ResidenteDashboard = ({ userName, userEmail, userDepto, activeTab, onOpenModal, comunicados, tickets, setTickets }) => {
  const [integrantes, setIntegrantes] = useState([]);

  // Cargar integrantes del departamento desde la API
  useEffect(() => {
    api.get('/family').then(res => {
      const adapted = res.data.map(m => ({
        id: m.id,
        nombre: m.name,
        rol: m.relation,
        telefono: m.phone || '',
        iniciales: m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        color: '#6c757d'
      }));
      setIntegrantes(adapted);
    }).catch(() => {});
  }, []);
  const [visitas, setVisitas] = useState([]);

  // Cargar visitas del residente desde la API
  useEffect(() => {
    api.get('/visitors').then(res => {
      const adapted = res.data.map(v => ({
        id: v.id,
        name: v.name,
        type: v.type,
        date: new Date(v.fechaVisita).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        pin: v.pin,
        status: v.status,
        icon: v.type === 'Familiar' ? 'bi-person-heart' : v.type === 'Proveedor' ? 'bi-tools' : 'bi-box-seam',
        color: v.type === 'Familiar' ? 'info' : v.type === 'Proveedor' ? 'warning' : 'success'
      }));
      setVisitas(adapted);
    }).catch(() => {});
  }, []);
  const [reservas, setReservas] = useState([]);

  // Cargar reservas del residente desde la API
  useEffect(() => {
    api.get('/reservations').then(res => {
      const adapted = res.data.map(r => ({
        id: r.id,
        area: r.area?.name || 'Área',
        date: new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: `${r.timeStart} - ${r.timeEnd}`,
        status: r.status,
        color: r.status === 'Aprobada' ? 'success' : r.status === 'Pendiente' ? 'warning' : r.status === 'Rechazada' ? 'danger' : 'secondary',
        icon: r.area?.icon || 'bi-calendar-event',
        areaId: r.areaId
      }));
      setReservas(adapted);
    }).catch(() => {});
  }, []);
  const [solicitudes, setSolicitudes] = useState([
    { id: 1, tipo: "Reserva de Visita", detalle: "Placa: ABC-123 • Hoy (14:00 a 18:00)", estado: "Aprobada", color: "success" },
    { id: 2, tipo: "Carrito de Compras (Estándar)", detalle: "Por 1 Hora", estado: "En uso", color: "info" }
  ]);
  const [voted, setVoted] = useState(false);

  const handleCreateIncidencia = async (data) => {
    try {
      const res = await api.post('/tickets', {
        title: data.asunto,
        desc: data.desc || data.tipo || 'Sin descripción',
        priority: 'Alta'
      });
      setTickets(prev => [res.data, ...prev]);
    } catch(err) { 
      alert(err.response?.data?.error || 'Error al crear incidencia');
    }
  };

  const handleDeleteIncidencia = async (id) => {
     try {
       await api.put(`/tickets/${id}/cancel`);
       setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Cancelado' } : t));
     } catch(err) { 
       alert(err.response?.data?.error || 'Error al cancelar incidencia');
     }
  };

  const handleCreateReserva = async (data) => {
    try {
      const res = await api.post('/reservations', {
        areaId: data.areaId,
        date: data.rawDate,
        timeStart: data.rawTimeStart,
        timeEnd: data.rawTimeEnd
      });

      const newReserva = {
        id: res.data.id,
        area: res.data.area?.name || 'Área',
        date: new Date(res.data.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: `${res.data.timeStart} - ${res.data.timeEnd}`,
        status: res.data.status,
        color: 'warning',
        icon: res.data.area?.icon || 'bi-calendar-event',
        areaId: res.data.areaId
      };
      setReservas(prev => [newReserva, ...prev]);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al crear la reserva');
    }
  };

  const handleDeleteReserva = async (id) => {
    try {
      await api.delete(`/reservations/${id}`);
      setReservas(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar la reserva');
    }
  };

  const handleAddIntegrante = async (data) => {
    try {
      const res = await api.post('/family', { name: data.nombre, relation: data.rol, phone: data.telefono });
      const m = res.data;
      setIntegrantes(prev => [...prev, {
        id: m.id,
        nombre: m.name,
        rol: m.relation,
        telefono: m.phone || '',
        iniciales: m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        color: '#6c757d'
      }]);
    } catch (err) { alert(err.response?.data?.error || 'Error al agregar integrante'); }
  };

  const handleDeleteIntegrante = async (id) => {
    try {
      await api.delete(`/family/${id}`);
      setIntegrantes(prev => prev.filter(i => i.id !== id));
    } catch (err) { alert(err.response?.data?.error || 'Error al eliminar integrante'); }
  };

  const handleCreateVisita = async (data) => {
    try {
      const res = await api.post('/visitors', {
        name: data.name,
        dni: data.dni || null,
        type: data.type === 'Familiar' ? 'Familiar' : data.type === 'Proveedor' ? 'Proveedor' : 'Delivery',
        fechaVisita: data.rawDate + 'T' + (data.rawTime || '10:00') + ':00'
      });
      const v = res.data;
      const newVisita = {
        id: v.id,
        name: v.name,
        type: v.type,
        date: new Date(v.fechaVisita).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        pin: v.pin,
        status: v.status,
        icon: v.type === 'Familiar' ? 'bi-person-heart' : v.type === 'Proveedor' ? 'bi-tools' : 'bi-box-seam',
        color: v.type === 'Familiar' ? 'info' : v.type === 'Proveedor' ? 'warning' : 'success'
      };
      setVisitas(prev => [newVisita, ...prev]);
    } catch (err) {
      alert(err.response?.data?.error || 'Error al registrar la visita');
    }
  };

  const handleDeleteVisita = async (id) => {
    try {
      await api.delete(`/visitors/${id}`);
      setVisitas(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Error al cancelar la visita');
    }
  };

  switch (activeTab) {
    case 'Control de Visitas': return <ResidenteVisitas onOpenModal={onOpenModal} visitas={visitas} setVisitas={setVisitas} onCreateVisita={handleCreateVisita} onDeleteVisita={handleDeleteVisita} />;
    case 'Reservar Áreas': return <ResidenteReservas onOpenModal={onOpenModal} reservas={reservas} setReservas={setReservas} onCreateReserva={handleCreateReserva} onDeleteReserva={handleDeleteReserva} />;
    case 'Estacionamiento y Carritos': return <ResidenteEstacionamiento onOpenModal={onOpenModal} solicitudes={solicitudes} setSolicitudes={setSolicitudes} />;
    case 'Comunicados': return <ResidenteComunicados comunicados={comunicados} />;
    case 'Asambleas y Votaciones': return <ResidenteAsambleas onOpenModal={onOpenModal} />;
    case 'Reportar Incidencia': return <ResidenteIncidencias onOpenModal={onOpenModal} incidencias={tickets} onCreate={handleCreateIncidencia} onDelete={handleDeleteIncidencia} />;
    default: return <ResidenteMiDomicilio userName={userName} userEmail={userEmail} userDepto={userDepto} onOpenModal={onOpenModal} integrantes={integrantes} setIntegrantes={setIntegrantes} setVisitas={setVisitas} setReservas={setReservas} onCreateReserva={handleCreateReserva} onCreateVisita={handleCreateVisita} onCreateIncidencia={handleCreateIncidencia} onAddIntegrante={handleAddIntegrante} onDeleteIntegrante={handleDeleteIntegrante} />;
  }
};

const SeguridadMonitor = ({ panicoActivo, onTogglePanico, visitors, camaras, residents, onReportIncident, onOpenModal }) => {
  const camarasActivas = camaras.filter(c => c.status === 'Grabando').length;
  const activeResidents = residents ? residents.filter(r => r.status === 'ACTIVO').length : 0;
  
  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 mb-2">
        <div className={`alert ${panicoActivo ? 'alert-danger' : 'alert-dark'} bg-transparent ${panicoActivo ? 'border-danger text-danger' : 'border-secondary text-white-50'} d-flex flex-column flex-md-row align-items-center rounded-4 p-4 shadow-lg text-center text-md-start`} style={{ transition: 'all 0.3s ease', animation: panicoActivo ? 'pulse-blue 1.5s infinite' : 'none' }}>
          <i className={`bi ${panicoActivo ? 'bi-shield-fill-exclamation' : 'bi-shield-check'} fs-1 me-md-4 mb-3 mb-md-0`}></i>
          <div className="flex-grow-1 mb-3 mb-md-0">
            <h5 className="fw-bold mb-1">{panicoActivo ? '¡ALERTA DE PÁNICO ACTIVADA!' : 'Sistema Operativo y Seguro'}</h5>
            <span className="small">{panicoActivo ? 'La policía y administración han sido notificadas.' : 'Usa esta función únicamente en caso de emergencia real.'}</span>
          </div>
          <button className={`btn ${panicoActivo ? 'btn-outline-danger' : 'btn-danger'} w-100 w-md-auto rounded-pill px-4 py-2 fw-bold shadow`} onClick={onTogglePanico}>
            {panicoActivo ? 'DESACTIVAR ALARMA' : 'ACTIVAR PÁNICO'}
          </button>
        </div>
      </div>
      <div className="col-md-4">
        <div className="service-card-elite p-4 h-100">
          <div className="text-info mb-2"><i className="bi bi-people fs-4"></i></div>
          <h6 className="text-white-50 text-uppercase small fw-bold">Residentes Activos</h6>
          <h2 className="text-white fw-bold mb-0">{activeResidents} Registrados</h2>
        </div>
      </div>
      <div className="col-md-4">
        <div className="service-card-elite p-4 h-100">
          <div className="text-success mb-2"><i className="bi bi-camera-video fs-4"></i></div>
          <h6 className="text-white-50 text-uppercase small fw-bold">Cámaras Activas</h6>
          <h2 className="text-white fw-bold mb-0">{camarasActivas} / {camaras.length} En línea</h2>
        </div>
      </div>
      <div className="col-md-4">
        <div className="service-card-elite p-4 h-100">
          <div className="text-warning mb-2"><i className="bi bi-journal-text fs-4"></i></div>
          <h6 className="text-white-50 text-uppercase small fw-bold">Novedades Turno</h6>
          <h2 className="text-white fw-bold mb-0">Sin alertas</h2>
        </div>
      </div>
      <div className="col-12 mt-4">
        <h5 className="text-white mb-3">Vista Previa - Monitoreo Rápido</h5>
        <div className="row g-4">
          {camaras.slice(0, 2).map((c, i) => (
            <div className="col-lg-6" key={c.id}>
              <div className="service-card-elite p-2 position-relative h-100">
                {c.status === 'Grabando' && <div className="position-absolute top-0 start-0 m-4 badge bg-danger rounded-pill" style={{ zIndex: 10, animation: 'pulse-blue 2s infinite' }}>EN VIVO</div>}
                <div className="rounded-4 w-100 bg-dark d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '250px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {c.status === 'Grabando' ? (
                    <img src={i === 0 ? "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800" : "https://images.unsplash.com/photo-1621245051978-0c62ba384638?q=80&w=800"} alt="Cámara" className="img-fluid w-100 h-100" style={{ objectFit: 'cover', filter: 'grayscale(30%) contrast(120%)' }} />
                  ) : (
                    <div className="text-center text-white-50"><i className="bi bi-camera-video-off fs-1 d-block mb-2"></i><small>Señal Perdida</small></div>
                  )}
                </div>
                <div className="mt-3 px-3 d-flex justify-content-between align-items-center pb-2">
                  <span className="text-white fw-bold">{c.name}</span>
                  <span className={`text-${c.color}`}><i className="bi bi-record-circle"></i> {c.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SeguridadAccesos = ({ onOpenModal, visitors, onMarkVisitor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtro, setFiltro] = useState('Aprobado');
  
  const filtered = (visitors || []).filter(v => {
    const matchSearch = (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (v.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filtro === 'Todos' ? true : v.status === filtro;
    return matchSearch && matchStatus;
  });

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <h5 className="text-white mb-0">Control de Accesos</h5>
        <div className="d-flex flex-wrap gap-2">
          {['Aprobado', 'Ingresó', 'Salió', 'Todos'].map(s => (
            <button key={s} className={`btn btn-sm rounded-pill px-3 fw-bold ${filtro === s ? 'btn-info text-dark' : 'btn-outline-secondary text-white-50'}`} onClick={() => setFiltro(s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="col-12">
        <div className="input-group mb-3" style={{ maxWidth: '400px' }}>
          <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
          <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar visitante..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      {filtered.length > 0 ? filtered.map(v => (
        <div className="col-lg-6" key={v.id}>
          <div className="service-card-elite p-4 d-flex align-items-center gap-3">
            <div className={`d-flex align-items-center justify-content-center rounded-circle bg-${v.status === 'Ingresó' ? 'success' : v.status === 'Salió' ? 'secondary' : 'info'} bg-opacity-25`} style={{ width: '50px', height: '50px', minWidth: '50px' }}>
              <i className={`bi ${v.status === 'Ingresó' ? 'bi-box-arrow-in-right' : v.status === 'Salió' ? 'bi-box-arrow-right' : 'bi-person-check'} text-${v.status === 'Ingresó' ? 'success' : v.status === 'Salió' ? 'secondary' : 'info'} fs-4`}></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{v.name}</h6>
              <small className="text-white-50">{v.type} • {v.user?.name || 'N/A'} ({v.user?.depto || ''})</small>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="badge bg-dark text-white font-monospace">{v.pin}</span>
                <small className="text-white-50">{new Date(v.fechaVisita).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</small>
              </div>
            </div>
            <div className="d-flex flex-column gap-1">
              {v.status === 'Aprobado' && (
                <button className="btn btn-sm btn-success rounded-pill px-3" onClick={() => onMarkVisitor(v.id, 'Ingresó')}><i className="bi bi-box-arrow-in-right me-1"></i>Ingreso</button>
              )}
              {v.status === 'Ingresó' && (
                <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => onMarkVisitor(v.id, 'Salió')}><i className="bi bi-box-arrow-right me-1"></i>Salida</button>
              )}
              {v.status === 'Salió' && (
                <span className="badge bg-secondary bg-opacity-25 text-secondary rounded-pill">Completado</span>
              )}
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 py-5">
          <i className="bi bi-person-x fs-1 d-block mb-3 opacity-50"></i>
          <p>No hay visitantes con estado "{filtro}"</p>
        </div>
      )}
    </div>
  );
};

const SeguridadCamaras = ({ onOpenModal, camaras }) => {
  const [localCamaras, setLocalCamaras] = useState(camaras || []);
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = (localCamaras || []).filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <h5 className="text-white mb-0">Cámaras (CCTV)</h5>
        <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3">
          <div className="input-group w-100" style={{ maxWidth: '400px' }}>
            <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
            <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar cámara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg text-nowrap w-100 w-sm-auto" onClick={() => onOpenModal('Añadir Cámara', 'form-camara', null, (nueva) => setLocalCamaras(prev => [...prev, nueva]))}>
            <i className="bi bi-camera-video me-1"></i> Nueva Cámara
          </button>
        </div>
      </div>
      {filtered.length > 0 ? filtered.map((c) => (
        <div className="col-xl-4 col-md-6" key={c.id}>
          <div className="service-card-elite p-4 h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className={`d-flex align-items-center justify-content-center rounded-3 bg-${c.color} bg-opacity-25 text-${c.color} me-3 shadow-sm`} style={{ width: '50px', height: '50px' }}><i className={`bi ${c.status === 'Grabando' ? 'bi-camera-video' : 'bi-camera-video-off'} fs-4`}></i></div>
              <span className={`badge bg-${c.color} bg-opacity-25 text-${c.color} border border-${c.color} border-opacity-50 rounded-pill px-3`}>{c.status}</span>
            </div>
            <h5 className="text-white fw-bold mb-1">{c.name}</h5>
            <p className="text-white-50 small mb-4"><i className="bi bi-geo-alt me-1"></i> {c.location}</p>
            <div className="d-flex gap-2 mt-auto pt-3 border-top border-secondary border-opacity-25">
              <button className="btn btn-sm btn-outline-info flex-grow-1 rounded-pill" onClick={() => onOpenModal('Configurar Cámara', 'form-camara', c, (updated) => setLocalCamaras(prev => prev.map(cam => cam.id === c.id ? updated : cam)))}><i className="bi bi-gear-fill me-1"></i> Configurar</button>
              <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => onOpenModal('Eliminar Cámara', 'confirm-delete', { item: c.name }, () => setLocalCamaras(prev => prev.filter(cam => cam.id !== c.id)))}><i className="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      )) : <div className="col-12 text-center text-white-50 mt-5 py-5"><i className="bi bi-search fs-1 d-block mb-3 opacity-50"></i><p>No se encontraron cámaras.</p></div>}
    </div>
  );
};

const SeguridadBitacora = ({ onOpenModal, bitacora, onCreate, onReportIncident }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = (bitacora || []).filter(b => (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || (b.type || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="row g-4" style={{ animation: 'fadeInDown 0.5s ease' }}>
      <div className="col-12 d-flex flex-column flex-lg-row justify-content-between align-items-lg-center mb-3 gap-3">
        <h5 className="text-white mb-0">Bitácora Digital</h5>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-premium-unique rounded-pill text-white px-4 py-2 fw-bold shadow-lg text-nowrap" onClick={() => onOpenModal('Nueva Entrada', 'form-bitacora', null, onCreate)}>
            <i className="bi bi-journal-plus me-1"></i> Añadir Registro
          </button>
          <button className="btn btn-danger rounded-pill text-white px-4 py-2 fw-bold shadow-lg text-nowrap" onClick={() => onOpenModal('Reportar Incidente', 'form-incidente-seguridad', null, onReportIncident)}>
            <i className="bi bi-exclamation-triangle me-1"></i> Reportar Incidente
          </button>
        </div>
      </div>
      <div className="col-12">
        <div className="input-group mb-3" style={{ maxWidth: '400px' }}>
          <span className="input-group-text bg-transparent border-secondary border-opacity-25 text-white-50"><i className="bi bi-search"></i></span>
          <input type="text" className="form-control bg-transparent border-secondary border-opacity-25 text-white shadow-none" placeholder="Buscar novedades..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>
      {filtered.length > 0 ? filtered.map(b => (
        <div className="col-12" key={b.id}>
          <div className="service-card-elite p-4 d-flex align-items-start gap-3">
            <div className={`d-flex align-items-center justify-content-center rounded-circle bg-${b.type === 'Incidente' ? 'danger' : b.type === 'Emergencia' ? 'warning' : 'info'} bg-opacity-25`} style={{ width: '45px', height: '45px', minWidth: '45px' }}>
              <i className={`bi ${b.type === 'Incidente' ? 'bi-exclamation-triangle' : b.type === 'Emergencia' ? 'bi-lightning' : 'bi-shield-check'} text-${b.type === 'Incidente' ? 'danger' : b.type === 'Emergencia' ? 'warning' : 'info'}`}></i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="text-white fw-bold mb-0">{b.title}</h6>
                <div className="d-flex gap-2">
                  <span className={`badge bg-${b.type === 'Incidente' ? 'danger' : b.type === 'Emergencia' ? 'warning' : 'info'} bg-opacity-25 text-${b.type === 'Incidente' ? 'danger' : b.type === 'Emergencia' ? 'warning' : 'info'} rounded-pill`}>{b.type}</span>
                  <span className="badge bg-dark text-white-50 rounded-pill">{b.shift}</span>
                </div>
              </div>
              <p className="text-white-50 small mb-1">{b.desc}</p>
              <small className="text-white-50"><i className="bi bi-clock me-1"></i>{new Date(b.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center text-white-50 py-5">
          <i className="bi bi-journal-x fs-1 d-block mb-3 opacity-50"></i>
          <p>No hay registros en la bitácora.</p>
        </div>
      )}
    </div>
  );
};

const SeguridadDashboard = ({ activeTab, onOpenModal, residents }) => {
  const [visitors, setVisitors] = useState([]);
  const [bitacora, setBitacora] = useState([]);
  const [camaras] = useState([
    { id: 1, name: "Cam 01: Ingreso Principal", location: "Lobby Frontal", status: "Grabando", color: "success" },
    { id: 2, name: "Cam 02: Estacionamiento Norte", location: "Sótano 1", status: "Grabando", color: "success" },
    { id: 3, name: "Cam 03: Ascensores", location: "Planta Baja", status: "Grabando", color: "success" },
    { id: 4, name: "Cam 04: Área de Piscina", location: "Piso 1", status: "Grabando", color: "success" }
  ]);
  const [panicoActivo, setPanicoActivo] = useState(false);

  // Activar/desactivar pánico y notificar al admin
  const handlePanico = async () => {
    const newState = !panicoActivo;
    setPanicoActivo(newState);
    if (newState) {
      try {
        // Enviar notificación de emergencia usando endpoint dedicado
        await api.post('/notifications/panic');
      } catch (err) { console.error('Error notificando:', err); }
    }
  };

  // Cargar visitas aprobadas (para control de accesos)
  useEffect(() => {
    api.get('/visitors').then(res => setVisitors(res.data)).catch(() => {});
    api.get('/logentries').then(res => setBitacora(res.data)).catch(() => {});
  }, []);

  // Marcar ingreso/salida de visitante
  const handleMarkVisitor = async (id, status) => {
    try {
      const res = await api.put(`/visitors/${id}/status`, { status });
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
  };

  // Crear entrada en bitácora
  const handleCreateLog = async (data) => {
    try {
      const res = await api.post('/logentries', data);
      setBitacora(prev => [res.data, ...prev]);
    } catch (err) { alert(err.response?.data?.error || 'Error al registrar'); }
  };

  // Reportar incidente (crea ticket para el admin)
  const handleReportIncident = async (data) => {
    try {
      await api.post('/tickets', { title: data.title, desc: data.desc, priority: 'Alta' });
      alert('✅ Incidente reportado al administrador');
    } catch (err) { alert(err.response?.data?.error || 'Error al reportar'); }
  };

  const accesosAdapted = visitors.filter(v => v.status === 'Aprobado' || v.status === 'Ingresó').map(v => ({
    ...v,
    icon: v.status === 'Ingresó' ? 'bi-box-arrow-in-right' : 'bi-person-check',
    color: v.status === 'Ingresó' ? 'success' : 'info'
  }));

  switch (activeTab) {
    case 'Control de Accesos': return <SeguridadAccesos onOpenModal={onOpenModal} visitors={visitors} onMarkVisitor={handleMarkVisitor} />;
    case 'Cámaras (CCTV)': return <SeguridadCamaras onOpenModal={onOpenModal} camaras={camaras} />;
    case 'Bitácora Digital': return <SeguridadBitacora onOpenModal={onOpenModal} bitacora={bitacora} onCreate={handleCreateLog} onReportIncident={handleReportIncident} />;
    default: return <SeguridadMonitor panicoActivo={panicoActivo} onTogglePanico={handlePanico} visitors={visitors} camaras={camaras} residents={residents} onReportIncident={handleReportIncident} onOpenModal={onOpenModal} />;
  }
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lógica mejorada para obtener el usuario, persistiendo en recargas de página
  const getInitialUser = () => {
    // Prioridad al state que viene de la navegación del Login
    if (location.state?.role) {
      return { role: location.state.role, email: location.state.userEmail, name: location.state.userName, depto: location.state.userDepto };
    }
    // Fallback a localStorage para recargas de página
    try {
      const storedUser = localStorage.getItem('domus_user');
      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        return { role: parsedUser.role, email: parsedUser.email, name: parsedUser.name, depto: parsedUser.depto };
      }
    } catch (err) {
      console.error('Error parseando usuario de localStorage:', err);
    }
    // Si no se encuentra nada, se devolverán nulos
    return { role: null, email: null, name: null, depto: null };
  };

  const { role: rawRole, userEmail, name: userName, depto: userDepto } = getInitialUser();
  
  // Estandarizamos el rol a minúsculas para evitar pantallas en blanco (Ej: "ADMIN" -> "admin")
  const role = rawRole ? rawRole.toLowerCase() : null;

  const activeMenu = menus[role] || menus.admin;
  
  const [activeTab, setActiveTab] = useState(activeMenu[0]?.text || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ESTADOS GLOBALES DE LA BASE DE DATOS (Elevados para compartirlos entre roles)
  const [residents, setResidents] = useState([]);
  const [comunicados, setComunicados] = useState([]);
  const [areas, setAreas] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadAllData = async () => {
    if (!role) return;
    setIsLoadingData(true);
    setLoadError(false);
    try {
      const [annRes, areasRes, ticketsRes, usersRes] = await Promise.all([
        api.get('/announcements'),
        api.get('/areas'),
        api.get('/tickets'),
        api.get('/users'),
      ]);
      setComunicados(annRes.data);
      setAreas(areasRes.data);
      setTickets(ticketsRes.data);
      const adaptedUsers = usersRes.data.map(user => {
        const dbStatus = user.status ? user.status.toUpperCase() : null;
        const safeStatus = dbStatus || (user.name === 'Usuario Pendiente' ? 'PENDIENTE' : 'ACTIVO');
        return {
          id: user.id, name: user.name, email: user.email, depto: user.depto,
          phone: user.phone, role: user.role, status: safeStatus,
          color: safeStatus === 'PENDIENTE' ? 'warning' : 'success'
        };
      });
      setResidents(adaptedUsers);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => { loadAllData(); }, [role]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cargar notificaciones
  useEffect(() => {
    if (!role) return;
    const loadNotifs = () => {
      api.get('/notifications').then(res => setNotifications(res.data)).catch(() => {});
      api.get('/notifications/count').then(res => setNotifCount(res.data.count)).catch(() => {});
    };
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000); // Polling cada 30s
    return () => clearInterval(interval);
  }, [role]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('domus_token');
    localStorage.removeItem('domus_user');
    navigate('/login');
  };

  // --- SISTEMA INTELIGENTE DE MODALES CRUD ---
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', type: '', data: null, onConfirm: null });
  const [fileName, setFileName] = useState(''); // Estado global para los archivos adjuntos
  
  const openModal = (title, type, data = null, onConfirm = null) => {
    setFileName(''); // Limpiar archivo al abrir
    setModalConfig({ isOpen: true, title, type, data, onConfirm });
  };
  
  const closeModal = () => {
    setFileName(''); // Limpiar archivo al cerrar
    setModalConfig({ isOpen: false, title: '', type: '', data: null, onConfirm: null });
  };

  // Si no hay rol, el componente ProtectedRoute ya debería haber redirigido.
  // Esto es un seguro extra por si algo falla.
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Estilo Premium para todos los inputs del modal
  const modalInputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    colorScheme: 'dark' // Fuerza al navegador a mostrar el menú de calendario en modo oscuro
  };

  const renderModalBody = () => {
    const today = new Date().toISOString().split('T')[0]; // Fecha actual para bloquear el pasado

    if (modalConfig.type.startsWith('confirm-')) {
      const getActionConfig = () => {
        if (modalConfig.type === 'confirm-delete') return { btn: 'danger', icon: 'bi-exclamation-triangle-fill', text: 'Sí, Eliminar' };
        if (modalConfig.type === 'confirm-pause') return { btn: 'warning', icon: 'bi-pause-circle-fill', text: modalConfig.title === 'Reactivar Operación' ? 'Sí, Reactivar' : 'Pausar Operación' };
        if (modalConfig.type === 'confirm-complete') return { btn: 'success', icon: 'bi-check-circle-fill', text: 'Marcar Completado' };
        if (modalConfig.type === 'confirm-whatsapp') return { btn: 'success', icon: 'bi-whatsapp', text: 'Enviar WhatsApp' };
        if (modalConfig.type === 'confirm-export') return { btn: 'info', icon: 'bi-file-earmark-pdf-fill', text: 'Descargar PDF' };
        if (modalConfig.type === 'confirm-save') return { btn: 'info', icon: 'bi-save-fill', text: 'Aplicar Cambios' };
        if (modalConfig.type === 'confirm-approve') return { btn: 'success', icon: 'bi-check-circle-fill', text: 'Aprobar y Notificar' };
        if (modalConfig.type === 'confirm-reject') return { btn: 'danger', icon: 'bi-x-circle-fill', text: 'Rechazar y Notificar' };
        return { btn: 'primary', icon: 'bi-info-circle-fill', text: 'Confirmar' };
      };
      const action = getActionConfig();
      
      // Extraemos colores exactos para crear los efectos de resplandor
      const rgbColor = action.btn === 'danger' ? '220,53,69' : action.btn === 'warning' ? '255,193,7' : action.btn === 'success' ? '25,135,84' : '0,212,255';
      const hexColor = action.btn === 'danger' ? '#dc3545' : action.btn === 'warning' ? '#ffc107' : action.btn === 'success' ? '#198754' : '#00d4ff';

      return (
        <div className="text-center pb-2">
          
          {/* Icono con efecto de anillos de radar (Glow) */}
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 position-relative" 
               style={{ 
                 width: '90px', height: '90px', 
                 background: `rgba(${rgbColor}, 0.1)`,
                 border: `1px solid rgba(${rgbColor}, 0.3)`,
                 boxShadow: `0 0 0 15px rgba(${rgbColor}, 0.05), 0 0 30px rgba(${rgbColor}, 0.2)`
               }}>
            <i className={`bi ${action.icon} display-5`} style={{ color: hexColor }}></i>
          </div>
          
          {/* Texto dinámico con mayor énfasis */}
          <div className="text-white-50 fs-5 mb-5 lh-lg px-3">
            {modalConfig.type === 'confirm-whatsapp' ? <p>¿Deseas redirigirte a WhatsApp para enviar un recordatorio automático a <strong className="text-white fs-4 d-block mt-2">{modalConfig.data?.item}</strong>?</p> :
             modalConfig.type === 'confirm-export' ? <p>Se generará y descargará un documento PDF con los registros actuales.</p> :
             modalConfig.type === 'confirm-save' ? <p>¿Estás seguro de que deseas aplicar estas configuraciones al sistema de Domus?</p> :
             modalConfig.type === 'confirm-approve' ? <p>¿Deseas aprobar la solicitud de <strong className="text-white">{modalConfig.data?.item}</strong>? Se generará una contraseña y se le enviará por correo.</p> :
             modalConfig.type === 'confirm-reject' ? <p>¿Deseas rechazar la solicitud de <strong className="text-white">{modalConfig.data?.item}</strong>? Se le enviará un correo informando la decisión.</p> :
             <p>
               ¿Estás seguro de que deseas {action.text.toLowerCase()} <strong className="text-white">{modalConfig.data?.item ? `"${modalConfig.data.item}"` : 'este elemento'}</strong>? 
               {modalConfig.type === 'confirm-delete' && (
                 <span className="d-block mt-3 p-3 rounded-3" style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.2)', color: '#ff6b6b', fontSize: '0.9rem', lineHeight: '1.4' }}>
                   <i className="bi bi-exclamation-triangle-fill me-2"></i>Esta acción es irreversible y los datos se perderán para siempre.
                 </span>
               )}
             </p>
            }
          </div>
          
          {/* Botones simétricos más altos y proporcionales */}
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button className="btn btn-outline-secondary w-100 rounded-pill py-3 fw-bold text-white hover-cyan transition-all flex-grow-1" onClick={closeModal} style={{ background: 'rgba(255,255,255,0.05)' }}>Cancelar</button>
            <button className={`btn btn-${action.btn} w-100 rounded-pill py-3 fw-bold shadow-lg flex-grow-1 text-${(action.btn === 'info' || action.btn === 'warning') ? 'dark' : 'white'}`} onClick={() => { if (modalConfig.onConfirm) modalConfig.onConfirm(); closeModal(); }} style={{ boxShadow: `0 10px 20px rgba(${rgbColor}, 0.2)` }}>{action.text}</button>
          </div>
        </div>
      );
    }

    if (modalConfig.type === 'form-integrante') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const nombre = formData.get('nombre');
          const rol = formData.get('rol');
          const telefono = formData.get('telefono');
          if (nombre && rol && modalConfig.onConfirm) {
            const iniciales = nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            modalConfig.onConfirm({ id: modalConfig.data?.id || Date.now(), nombre, rol, telefono: telefono || '', iniciales, color: modalConfig.data?.color || '#00d4ff' });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre Completo</label><input type="text" name="nombre" required maxLength={50} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.nombre || ''} placeholder="Ej. Camila Mendoza" onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').slice(0, 50); }} /></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Parentesco</label><input type="text" name="rol" required maxLength={20} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.rol || ''} placeholder="Ej. Hija" onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '').slice(0, 20); }} /></div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Teléfono (Opcional)</label><input type="text" name="telefono" maxLength={15} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.telefono || ''} placeholder="+51 999888777" onInput={(e) => { e.target.value = e.target.value.replace(/[^\d+\s]/g, '').slice(0, 15); }} /></div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Integrante</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-visita') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const dni = formData.get('dni');
          const typeCode = formData.get('type');
          const date = formData.get('date');
          const time = formData.get('time');

          if (name && date && time && modalConfig.onConfirm) {
            // Configurar diseño dependiendo del tipo
            let typeStr = "Familiar"; let icon = "bi-person-heart"; let color = "info";
            if (typeCode === 'prov') { typeStr = "Proveedor"; icon = "bi-tools"; color = "warning"; }
            if (typeCode === 'del') { typeStr = "Delivery"; icon = "bi-box-seam"; color = "success"; }
            
            // Generar un PIN aleatorio de 4 dígitos
            const pin = modalConfig.data?.pin || Math.floor(1000 + Math.random() * 9000).toString();
            
            const dateObj = new Date(date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            
            modalConfig.onConfirm({
              id: modalConfig.data?.id || Date.now() + Math.random(), // Added random to ensure unique key for Date.now() collisions
              name,
              dni: dni || '',
              type: typeStr, // This is the string representation of the type (e.g., "Familiar")
              typeCode,
              date: `${formattedDate} • ${time}`, // This is the formatted date string for display
              rawDate: date,
              rawTime: time,
              pin,
              icon,
              color
            });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre o Empresa del Visitante</label><input type="text" name="name" required maxLength={50} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.]+" title="Solo letras, máximo 50 caracteres" className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.name || ''} placeholder="Ej. Roberto Sánchez" onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.]/g, '').slice(0, 50); }} /></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>DNI / Pasaporte</label><input type="text" name="dni" maxLength={8} pattern="\d{8}" title="Exactamente 8 dígitos numéricos" className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.dni || ''} placeholder="12345678" onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 8); }} /></div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Tipo de Visita</label>
              <select name="type" className="form-select shadow-none py-2" style={modalInputStyle} defaultValue={modalConfig.data?.typeCode || 'fam'}>
                <option value="fam">Familiar / Amigo</option>
                <option value="prov">Proveedor / Técnico</option>
                <option value="del">Delivery</option>
              </select>
            </div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Fecha</label>
              <div className="position-relative">
                <i className="bi bi-calendar-event position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="date" name="date" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} defaultValue={modalConfig.data?.rawDate || ''} min={today} />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Hora Estimada</label>
              <div className="position-relative">
                <i className="bi bi-clock position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="time" name="time" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} defaultValue={modalConfig.data?.rawTime || ''} />
              </div>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg"><i className="bi bi-person-check-fill me-2"></i>Autorizar Ingreso</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-reserva') {
      const activeAreas = (areas || []).filter(a => a.status !== 'Mantenimiento');
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const areaIdStr = formData.get('areaId');
          const date = formData.get('date');
          const timeStart = formData.get('timeStart');
          const timeEnd = formData.get('timeEnd');
          if (areaIdStr && date && timeStart && timeEnd && modalConfig.onConfirm) {
            await modalConfig.onConfirm({ 
              areaId: parseInt(areaIdStr),
              rawDate: date,
              rawTimeStart: timeStart,
              rawTimeEnd: timeEnd
            });
          }
          closeModal();
        }}>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>Seleccionar Área Común</label>
            <div className="d-flex flex-column gap-2">
              {activeAreas.length > 0 ? activeAreas.map((a, idx) => (
                <label key={a.id} className="d-flex align-items-center p-3 rounded-4 border border-secondary border-opacity-50 transition-all hover-cyan shadow-sm" style={{ background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                  <input type="radio" name="areaId" value={a.id} className="form-check-input mt-0 me-4 shadow-none fs-4" defaultChecked={idx === 0} />
                  <div className={`d-flex align-items-center justify-content-center rounded-circle bg-${a.color || 'info'} bg-opacity-25 text-${a.color || 'info'} me-3 shadow-sm`} style={{ width: '45px', height: '45px' }}><i className={`bi ${a.icon || 'bi-building'} fs-5`}></i></div>
                  <div>
                    <span className="text-white fw-bold d-block">{a.name}</span>
                    <small className="text-white-50">Aforo: {a.capacity}</small>
                  </div>
                </label>
              )) : (
                <p className="text-white-50 text-center py-3">No hay áreas activas disponibles para reservar.</p>
              )}
            </div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Fecha de Reserva</label>
              <div className="position-relative">
                <i className="bi bi-calendar-check position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="date" name="date" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} min={today} />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Hora Inicio</label>
              <div className="position-relative">
                <i className="bi bi-clock position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="time" name="timeStart" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Hora Fin</label>
              <div className="position-relative">
                <i className="bi bi-clock-history position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="time" name="timeEnd" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} />
              </div>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg" disabled={activeAreas.length === 0}>Confirmar Reserva</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-incidencia') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const asunto = formData.get('asunto');
          const tipo = formData.get('tipo');
          const desc = formData.get('desc');
          if (asunto && modalConfig.onConfirm) {
            const today = modalConfig.data?.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            modalConfig.onConfirm({ id: modalConfig.data?.id || Date.now(), asunto, tipo, desc, date: today, status: modalConfig.data?.status || "En Revisión", color: modalConfig.data?.color || "warning" });
            closeModal();
          }
        }}>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Tipo de Problema</label>
              <select name="tipo" className="form-select shadow-none py-2" style={modalInputStyle} defaultValue={modalConfig.data?.tipo || 'Plomería / Agua'}>
                <option value="Plomería / Agua">Plomería / Agua</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Áreas Comunes">Áreas Comunes</option>
                <option value="Seguridad">Seguridad</option>
              </select>
            </div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Asunto Breve</label><input type="text" name="asunto" required maxLength={100} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.asunto || ''} placeholder="Ej. Fuga en lavadero" onInput={(e) => { e.target.value = e.target.value.slice(0, 100); }} /></div>
          </div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Descripción detallada</label><textarea name="desc" rows="3" maxLength={500} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.desc || ''} placeholder="Explica el problema... (máx. 500 caracteres)"></textarea></div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase d-block" style={{ letterSpacing: '1px' }}>Adjuntar Foto (Opcional)</label>
            <label className="border border-secondary border-opacity-50 rounded-3 p-4 text-center text-white-50 d-block transition-all hover-cyan shadow-sm" style={{ background: fileName ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255,255,255,0.02)', borderStyle: fileName ? 'solid' : 'dashed', cursor: 'pointer', borderColor: fileName ? 'var(--accent-cyan)' : '' }}>
              <input type="file" name="foto" className="d-none" accept="image/*" onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
              {fileName ? (
                <>
                  <i className="bi bi-image fs-2 d-block mb-2 text-info"></i>
                  <span className="text-info fw-bold d-block text-truncate px-3">{fileName}</span>
                  <small className="d-block mt-1 text-white-50">Haz clic para cambiar la imagen</small>
                </>
              ) : (
                <>
                  <i className="bi bi-camera fs-2 d-block mb-2"></i>
                  <span className="d-block fw-medium mb-1">Haz clic para subir imagen</span>
                  <small className="text-white-50">Formatos: JPG, PNG (Max 5MB)</small>
                </>
              )}
            </label>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-danger w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg"><i className="bi bi-send-exclamation me-2"></i>Enviar Reporte</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-bitacora') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const title = formData.get('title');
          const desc = formData.get('desc');
          const type = formData.get('type');
          const shift = formData.get('shift');
          if (title && type && modalConfig.onConfirm) {
            modalConfig.onConfirm({ title, desc: desc || '', type, shift: shift || 'Día' });
            closeModal();
          }
        }}>
          <div className="mb-3"><label className="text-info small fw-bold mb-2 text-uppercase">Título / Asunto</label><input type="text" name="title" required maxLength={100} className="form-control shadow-none" style={modalInputStyle} placeholder="Ej. Ronda sin novedades" /></div>
          <div className="mb-3"><label className="text-info small fw-bold mb-2 text-uppercase">Descripción</label><textarea name="desc" rows="3" maxLength={500} className="form-control shadow-none" style={modalInputStyle} placeholder="Detalle de la novedad..."></textarea></div>
          <div className="row g-3 mb-4">
            <div className="col-6"><label className="text-info small fw-bold mb-2 text-uppercase">Tipo</label>
              <select name="type" className="form-select shadow-none" style={modalInputStyle}>
                <option value="Rutina">Rutina</option>
                <option value="Incidente">Incidente</option>
                <option value="Emergencia">Emergencia</option>
              </select>
            </div>
            <div className="col-6"><label className="text-info small fw-bold mb-2 text-uppercase">Turno</label>
              <select name="shift" className="form-select shadow-none" style={modalInputStyle}>
                <option value="Día">Día</option>
                <option value="Noche">Noche</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Registrar</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-incidente-seguridad') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const title = formData.get('title');
          const desc = formData.get('desc');
          if (title && desc && modalConfig.onConfirm) {
            modalConfig.onConfirm({ title, desc });
            closeModal();
          }
        }}>
          <div className="alert alert-danger bg-transparent border-danger text-danger small mb-4"><i className="bi bi-exclamation-triangle-fill me-2"></i>Este reporte será enviado directamente al administrador como ticket de alta prioridad.</div>
          <div className="mb-3"><label className="text-info small fw-bold mb-2 text-uppercase">Título del Incidente</label><input type="text" name="title" required maxLength={100} className="form-control shadow-none" style={modalInputStyle} placeholder="Ej. Persona sospechosa en estacionamiento" /></div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase">Descripción Detallada</label><textarea name="desc" required rows="4" maxLength={500} className="form-control shadow-none" style={modalInputStyle} placeholder="Describe el incidente con el mayor detalle posible..."></textarea></div>
          <div className="d-flex justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-danger text-white rounded-pill px-4 py-2 fw-bold shadow-lg"><i className="bi bi-exclamation-triangle me-2"></i>Reportar al Admin</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-poll') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const title = formData.get('title');
          const description = formData.get('description');
          const option1 = formData.get('option1');
          const option2 = formData.get('option2');
          const closesAt = formData.get('closesAt');
          if (title && description && option1 && option2 && closesAt && modalConfig.onConfirm) {
            modalConfig.onConfirm({ title, description, options: [option1, option2], closesAt });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Título de la Votación</label><input type="text" name="title" required maxLength={100} className="form-control shadow-none" style={modalInputStyle} placeholder="Ej. Aprobación para cambio de empresa" onInput={(e) => { e.target.value = e.target.value.slice(0, 100); }} /></div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Descripción</label><textarea name="description" required rows="3" maxLength={500} className="form-control shadow-none" style={modalInputStyle} placeholder="Explica la propuesta a votar... (máx. 500 caracteres)"></textarea></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Opción 1</label><input type="text" name="option1" required className="form-control shadow-none" style={modalInputStyle} defaultValue="Sí, a favor" /></div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Opción 2</label><input type="text" name="option2" required className="form-control shadow-none" style={modalInputStyle} defaultValue="No, en contra" /></div>
          </div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Fecha de Cierre</label>
            <input type="date" name="closesAt" required className="form-control shadow-none" style={modalInputStyle} min={today} />
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Crear Votación</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-asignar-tecnico') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const assignedTo = new FormData(e.target).get('assignedTo');
          if (assignedTo && modalConfig.onConfirm) {
            modalConfig.onConfirm({ id: modalConfig.data?.id, assignedTo });
            closeModal();
          }
        }}>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre del Técnico / Responsable</label>
            <input type="text" name="assignedTo" required maxLength={50} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.assignedTo || ''} placeholder="Ej. Juan Técnico, Empresa AquaClean" onInput={(e) => { e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.,]/g, '').slice(0, 50); }} />
          </div>
          <p className="text-white-50 small mb-4">Ticket: <strong className="text-white">{modalConfig.data?.title}</strong></p>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Asignar</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-nota-ticket') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const notes = new FormData(e.target).get('notes');
          if (modalConfig.onConfirm) {
            modalConfig.onConfirm({ id: modalConfig.data?.id, notes: notes || '' });
            closeModal();
          }
        }}>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nota de Seguimiento</label>
            <textarea name="notes" rows="3" className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.notes || ''} placeholder="Ej. Se contactó al proveedor, llegará mañana a las 10am..."></textarea>
          </div>
          <p className="text-white-50 small mb-4">Ticket: <strong className="text-white">{modalConfig.data?.title}</strong></p>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Nota</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-ticket-admin') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const title = formData.get('title');
          const desc = formData.get('desc');
          const priority = formData.get('priority');
          if (title && desc && modalConfig.onConfirm) {
            modalConfig.onConfirm({ title, desc, priority });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Título</label><input type="text" name="title" required maxLength={100} className="form-control shadow-none" style={modalInputStyle} placeholder="Ej. Limpieza de cisternas" onInput={(e) => { e.target.value = e.target.value.slice(0, 100); }} /></div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Descripción</label><textarea name="desc" required rows="3" maxLength={500} className="form-control shadow-none" style={modalInputStyle} placeholder="Detalle del mantenimiento... (máx. 500 caracteres)"></textarea></div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Prioridad</label>
            <select name="priority" className="form-select shadow-none" style={modalInputStyle} defaultValue="Media">
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Crear Ticket</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-admin') {
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const btn = e.currentTarget.querySelector('button[type="submit"]');
          if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Guardando...'; }
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const email = formData.get('email');
          if (name && email && modalConfig.onConfirm) {
            try {
              await modalConfig.onConfirm({ ...modalConfig.data, id: modalConfig.data?.id, name, email });
              closeModal();
            } catch { if (btn) { btn.disabled = false; btn.innerHTML = 'Guardar Administrador'; } }
          } else if (btn) { btn.disabled = false; btn.innerHTML = 'Guardar Administrador'; }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre del Administrador</label><input type="text" name="name" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.name || ''} placeholder="Ej. Admin Secundario" /></div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Correo Electrónico (Acceso)</label><input type="email" name="email" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.email || ''} placeholder="admin2@domus.com" /></div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Administrador</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-seguridad') {
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const btn = e.currentTarget.querySelector('button[type="submit"]');
          if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Guardando...'; }
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const email = formData.get('email');
          if (name && email && modalConfig.onConfirm) {
            try {
              await modalConfig.onConfirm({ ...modalConfig.data, id: modalConfig.data?.id, name, email, status: modalConfig.data?.status || 'ACTIVO', color: modalConfig.data?.color || 'success' });
              closeModal();
            } catch { if (btn) { btn.disabled = false; btn.innerHTML = 'Guardar Oficial'; } }
          } else if (btn) { btn.disabled = false; btn.innerHTML = 'Guardar Oficial'; }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre del Oficial</label><input type="text" name="name" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.name || ''} placeholder="Ej. Seguridad 1" /></div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Correo Electrónico</label><input type="email" name="email" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.email || ''} placeholder="correo@ejemplo.com" /></div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Oficial</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-residente') {
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const btn = e.currentTarget.querySelector('button[type="submit"]');
          if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Guardando...'; }
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const email = formData.get('email');
          const depto = formData.get('depto');
          const phone = formData.get('phone');
          if (name && email && modalConfig.onConfirm) {
            try {
              await modalConfig.onConfirm({
                id: modalConfig.data?.id,
                name,
                email,
                depto: depto || 'N/A',
                phone: phone || '',
                status: modalConfig.data?.status || 'ACTIVO',
                color: modalConfig.data?.color || 'success'
              });
              closeModal();
            } catch { if (btn) { btn.disabled = false; btn.innerHTML = 'Guardar Perfil'; } }
          } else if (btn) { btn.disabled = false; btn.innerHTML = 'Guardar Perfil'; }
        }}>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre Completo</label><input type="text" name="name" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.name || ''} placeholder="Ej. Juan Pérez" /></div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Correo Electrónico</label><input type="email" name="email" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.email || ''} placeholder="correo@ejemplo.com" /></div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Departamento</label><input type="text" name="depto" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.depto || ''} placeholder="Ej. 402" /></div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Teléfono</label><input type="text" name="phone" className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.phone || ''} placeholder="+51 999 888 777" /></div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Perfil</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-comunicado') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const title = formData.get('title');
          const scope = formData.get('scope');
          const desc = formData.get('desc');
          const priority = formData.get('priority');
          if (title && desc && modalConfig.onConfirm) {
            modalConfig.onConfirm({ 
              id: modalConfig.data?.id, 
              title, 
              scope: scope === 'todos' ? 'Todos' : (scope === 'torrea' ? 'Torre A' : 'Torre B'), 
              type: priority || 'info', 
              desc 
            });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Título del Anuncio</label><input type="text" name="title" required maxLength={100} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.title || ''} placeholder="Ej. Mantenimiento Preventivo" onInput={(e) => { e.target.value = e.target.value.slice(0, 100); }} /></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Prioridad</label>
              <select name="priority" className="form-select shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.type || 'info'}>
                <option value="danger">🔴 Muy Importante</option>
                <option value="warning">🟡 Importante</option>
                <option value="info">🔵 Informativo</option>
              </select>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Alcance</label>
              <select name="scope" className="form-select shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.scope === 'Torre A' ? 'torrea' : modalConfig.data?.scope === 'Torre B' ? 'torreb' : 'todos'}>
                <option value="todos">Todos</option>
                <option value="torrea">Torre A</option>
                <option value="torreb">Torre B</option>
              </select>
            </div>
          </div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Descripción / Mensaje</label><textarea name="desc" required rows="3" maxLength={500} className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.desc || ''} placeholder="Escribe el mensaje aquí... (máx. 500 caracteres)"></textarea></div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase d-block" style={{ letterSpacing: '1px' }}>Adjuntar Archivo / Imagen (Opcional)</label>
            <label className="border border-secondary border-opacity-50 rounded-3 p-4 text-center text-white-50 d-block transition-all hover-cyan shadow-sm" style={{ background: fileName ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255,255,255,0.02)', borderStyle: fileName ? 'solid' : 'dashed', cursor: 'pointer', borderColor: fileName ? 'var(--accent-cyan)' : '' }}>
              <input type="file" name="adjunto" className="d-none" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
              {fileName ? (
                <>
                  <i className="bi bi-file-earmark-check fs-2 d-block mb-2 text-info"></i>
                  <span className="text-info fw-bold d-block text-truncate px-3">{fileName}</span>
                  <small className="d-block mt-1 text-white-50">Haz clic para cambiar el archivo</small>
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-up fs-2 d-block mb-2"></i>
                  <span className="d-block fw-medium mb-1">Haz clic para subir archivo</span>
                  <small className="text-white-50">Soporta: PDF, Word, JPG, PNG</small>
                </>
              )}
            </label>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Publicar Anuncio</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-area') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const capacity = formData.get('capacity');
          if (name && modalConfig.onConfirm) {
            modalConfig.onConfirm({ 
              id: modalConfig.data?.id, 
              name, 
              capacity: capacity || "10 personas", 
              status: modalConfig.data?.status || "Activa", 
              color: modalConfig.data?.color || "success",
              icon: modalConfig.data?.icon || "bi-star"
            });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre del Área / Amenidad</label><input type="text" name="name" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.name || ''} placeholder="Ej. Zona de Parrillas" /></div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Aforo Máximo Permitido</label><input type="text" name="capacity" className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.capacity || ''} placeholder="Ej. 15 personas" /></div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Área</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-ticket' || modalConfig.type === 'form-asignar') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          if (modalConfig.type === 'form-ticket') {
            const asunto = formData.get('asunto');
            const especialidadNode = e.target.elements.especialidad;
            const especialidadName = especialidadNode ? especialidadNode.options[especialidadNode.selectedIndex].text : 'Técnico General';
            
            if (asunto && modalConfig.onConfirm) {
              modalConfig.onConfirm({ title: asunto, depto: "Dpto Interno", desc: `Asignado a: ${especialidadName}.`, priority: "Media", color: "warning", time: "Ahora" });
            }
          } else if (modalConfig.type === 'form-asignar') {
            if (modalConfig.onConfirm) modalConfig.onConfirm();
          }
          closeModal();
        }}>
          {modalConfig.type === 'form-asignar' && <div className="alert alert-info bg-transparent border-info text-info mb-4 small rounded-3"><i className="bi bi-info-circle me-2"></i>Asignando técnico para: <strong>{modalConfig.data?.item}</strong></div>}
          {modalConfig.type === 'form-ticket' && <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Asunto del Ticket</label><input type="text" name="asunto" required className="form-control shadow-none" style={modalInputStyle} placeholder="Ej. Filtración de agua" /></div>}
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Especialidad Requerida</label>
            <select name="especialidad" className="form-select shadow-none py-2" style={modalInputStyle}>
              <option value="tec1">Técnico General</option>
              <option value="tec2">Especialista en Plomería</option>
              <option value="tec3">Empresa Externa (Ascensores)</option>
            </select>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Confirmar Técnico</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-voto') {
      return (
        <form onSubmit={(e) => { e.preventDefault(); if (modalConfig.onConfirm) modalConfig.onConfirm(); closeModal(); }}>
          <h5 className="text-white mb-4">Aprobación para Cambio de Empresa de Seguridad</h5>
          <div className="mb-4">
            <label className="d-flex align-items-center p-3 rounded-4 mb-3 border border-secondary border-opacity-50 transition-all hover-cyan" style={{ background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
              <input type="radio" name="voto" className="form-check-input mt-0 me-3 shadow-none fs-4" />
              <span className="text-white fs-5">Sí, estoy a favor</span>
            </label>
            <label className="d-flex align-items-center p-3 rounded-4 border border-secondary border-opacity-50 transition-all hover-cyan" style={{ background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
              <input type="radio" name="voto" className="form-check-input mt-0 me-3 shadow-none fs-4" />
              <span className="text-white fs-5">No, estoy en contra</span>
            </label>
          </div>
          <p className="text-warning small mb-4"><i className="bi bi-info-circle me-1"></i> Recuerde que el voto es secreto y una vez emitido no puede ser modificado.</p>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg"><i className="bi bi-check2-square me-2"></i>Confirmar Voto</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-reserva-estacionamiento') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const placa = formData.get('placa');
          const fecha = formData.get('fecha');
          const horaLlegada = formData.get('horaLlegada');
          const horaSalida = formData.get('horaSalida');
          if (placa && fecha && modalConfig.onConfirm) {
            const dateObj = new Date(fecha + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            modalConfig.onConfirm({ id: Date.now(), tipo: "Reserva de Visita", detalle: `Placa: ${placa} • ${formattedDate} (${horaLlegada || '10:00'} a ${horaSalida || '12:00'})`, estado: "Aprobada", color: "success" });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Placa del Vehículo</label><input type="text" name="placa" required maxLength={7} className="form-control shadow-none" style={modalInputStyle} placeholder="Ej. ABC-123" onInput={(e) => { let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6); if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3); e.target.value = val; }} /></div>
          <div className="row g-3 mb-4">
            <div className="col-12">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Fecha</label>
              <div className="position-relative">
                <i className="bi bi-calendar-event position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="date" name="fecha" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} min={today} />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Hora Llegada</label>
              <div className="position-relative">
                <i className="bi bi-box-arrow-in-right position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="time" name="horaLlegada" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Hora Salida</label>
              <div className="position-relative">
                <i className="bi bi-box-arrow-right position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="time" name="horaSalida" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} />
              </div>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Confirmar Reserva</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-permiso-estacionamiento') {
      return (
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const neighborId = formData.get('neighborId');
          const placa = formData.get('placa');
          const horaInicio = formData.get('horaInicio');
          const horaFin = formData.get('horaFin');
          const mensaje = formData.get('mensaje');
          
          if (!neighborId) { alert('Selecciona un vecino'); return; }
          
          try {
            await api.post('/notifications', {
              toUserId: parseInt(neighborId),
              type: 'parking_request',
              title: '🅿️ Solicitud de Estacionamiento',
              message: mensaje || 'Hola vecino, ¿podría prestarme su espacio de estacionamiento?',
              metadata: { placa, horaInicio, horaFin }
            });
            if (modalConfig.onConfirm) {
              modalConfig.onConfirm({ id: Date.now(), tipo: 'Solicitud de Estacionamiento', detalle: `Placa: ${placa || 'N/A'} • De ${horaInicio || '10:00'} a ${horaFin || '12:00'}`, estado: "Pendiente", color: "warning" });
            }
            closeModal();
            alert('✅ Solicitud enviada. El vecino recibirá una notificación.');
          } catch (err) {
            alert(err.response?.data?.error || 'Error al enviar solicitud');
          }
        }}>
          <div className="alert alert-warning bg-transparent border-warning text-warning mb-4 d-flex align-items-center rounded-3 small"><i className="bi bi-info-circle-fill fs-4 me-3"></i>El vecino recibirá una notificación en su campanita para aprobar tu solicitud.</div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Buscar Vecino por Nombre</label>
            <input type="text" className="form-control shadow-none" style={modalInputStyle} placeholder="Escribe el nombre del vecino..." onChange={async (e) => {
              const q = e.target.value;
              if (q.length >= 2) {
                try {
                  const res = await api.get(`/notifications/search-users?q=${q}`);
                  const container = e.target.closest('form').querySelector('.neighbor-results');
                  if (container) {
                    container.innerHTML = res.data.map(u => `<div class="p-2 rounded-3 mb-1 d-flex justify-content-between align-items-center" style="background:rgba(255,255,255,0.05);cursor:pointer" onclick="this.closest('form').querySelector('[name=neighborId]').value='${u.id}';this.closest('form').querySelector('[name=neighborName]').value='${u.name} (${u.depto || 'N/A'})';this.closest('.neighbor-results').innerHTML=''"><span class="text-white">${u.name}</span><small class="text-white-50">${u.depto || 'N/A'}</small></div>`).join('');
                  }
                } catch(err) { /* silently ignore search errors */ }
              }
            }} />
            <input type="hidden" name="neighborId" />
            <input type="text" name="neighborName" readOnly className="form-control shadow-none mt-2 text-success" style={{...modalInputStyle, display: 'none'}} />
            <div className="neighbor-results mt-2"></div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Placa Vehículo</label><input type="text" name="placa" maxLength={7} className="form-control shadow-none" style={modalInputStyle} placeholder="Ej. XYZ-987" onInput={(e) => { let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6); if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3); e.target.value = val; }} /></div>
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Hora Inicio</label>
              <div className="position-relative">
                <i className="bi bi-clock position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="time" name="horaInicio" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} />
              </div>
            </div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Hora Fin</label>
              <div className="position-relative">
                <i className="bi bi-clock-history position-absolute top-50 start-0 translate-middle-y ms-3 text-info fs-5"></i>
                <input type="time" name="horaFin" required className="form-control shadow-none date-time-premium" style={{...modalInputStyle, paddingLeft: '45px'}} />
              </div>
            </div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Mensaje</label><input type="text" name="mensaje" className="form-control shadow-none" style={modalInputStyle} placeholder="Hola vecino, ¿podría prestarme su espacio?" /></div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-warning w-100 w-sm-auto text-dark rounded-pill px-4 py-2 fw-bold shadow-lg"><i className="bi bi-send-fill me-2"></i>Enviar Solicitud</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-carrito') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const tipo = new FormData(e.target).get('tipoCarrito');
          const tiempo = new FormData(e.target).get('tiempo');
          if (tipo && modalConfig.onConfirm) {
            modalConfig.onConfirm({ 
              id: Date.now(), 
              tipo, 
              detalle: `Por ${tiempo}`, 
              estado: "Aprobado", 
              color: "info" 
            });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Tipo de Carrito</label>
            <select name="tipoCarrito" className="form-select shadow-none py-2" style={modalInputStyle}>
              <option>Carrito de Compras (Estándar)</option>
              <option>Carrito Plataforma (Carga Pesada)</option>
            </select>
          </div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Tiempo Estimado</label>
            <select name="tiempo" className="form-select shadow-none py-2" style={modalInputStyle}>
              <option>15 Minutos</option>
              <option>30 Minutos</option>
              <option>1 Hora</option>
            </select>
          </div>
          <p className="text-white-50 small mb-4"><i className="bi bi-exclamation-triangle me-1"></i> Recuerde devolver el carrito en la zona designada en el sótano para evitar penalidades.</p>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-info w-100 w-sm-auto text-dark rounded-pill px-4 py-2 fw-bold shadow-lg"><i className="bi bi-check2-circle me-2"></i>Confirmar Préstamo</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-moroso') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const residente = formData.get('residente');
          const unidad = formData.get('unidad');
          const deudaValue = formData.get('deuda');
          if (residente && unidad && deudaValue && modalConfig.onConfirm) {
            const iniciales = residente.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const formattedDeuda = `$${parseFloat(deudaValue).toFixed(2)}`;
            modalConfig.onConfirm({ 
              id: modalConfig.data?.id || Date.now(), 
              residente, 
              iniciales,
              unidad, 
              deuda: formattedDeuda
            });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre del Residente</label><input type="text" name="residente" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.residente || ''} placeholder="Ej. Carlos Mendoza" /></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Unidad / Dpto</label><input type="text" name="unidad" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.unidad || ''} placeholder="Ej. Dpto 801" /></div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Deuda Pendiente ($)</label><input type="number" step="0.01" name="deuda" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.deuda ? modalConfig.data.deuda.replace(/[^0-9.]/g, '') : ''} placeholder="300.00" /></div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Registro</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-acceso') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const dptoPlaca = formData.get('dptoPlaca');
          const typeCode = formData.get('type');
          if (name && modalConfig.onConfirm) {
            let icon = 'bi-person-check-fill'; let color = 'success'; let action = 'Ingreso Peatonal';
            if (typeCode === 'vehiculo') { icon = 'bi-car-front-fill'; color = 'info'; action = 'Ingreso Vehicular'; }
            if (typeCode === 'salida') { icon = 'bi-person-x-fill'; color = 'warning'; action = 'Salida Registrada'; }
            modalConfig.onConfirm({ 
              id: modalConfig.data?.id || Date.now(), 
              name, 
              dptoPlaca: dptoPlaca || '',
              typeCode,
              action, 
              time: modalConfig.data?.time || 'Ahora mismo', 
              icon, color 
            });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre o Empresa</label><input type="text" name="name" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.name || ''} placeholder="Ej. Juan Pérez" /></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Dpto o Placa (Opcional)</label><input type="text" name="dptoPlaca" className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.dptoPlaca || ''} placeholder="Ej. Dpto 402" /></div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Tipo de Registro</label>
            <select name="type" className="form-select shadow-none py-2" style={modalInputStyle} defaultValue={modalConfig.data?.typeCode || 'peatonal'}>
              <option value="peatonal">Ingreso Peatonal</option>
              <option value="vehiculo">Ingreso Vehicular</option>
              <option value="salida">Registro de Salida</option>
            </select>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Registro</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-camara') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const name = formData.get('name');
          const location = formData.get('location');
          const status = formData.get('status');
          if (name && modalConfig.onConfirm) {
            let color = 'success';
            if (status === 'Offline') color = 'danger';
            if (status === 'Mantenimiento') color = 'warning';
            modalConfig.onConfirm({ id: modalConfig.data?.id || Date.now(), name, location, status, color });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Nombre / Etiqueta de la Cámara</label><input type="text" name="name" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.name || ''} placeholder="Ej. Cam 04: Pasillo Sur" /></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Ubicación Física</label><input type="text" name="location" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.location || ''} placeholder="Ej. Planta Baja" /></div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Estado Operativo</label>
              <select name="status" className="form-select shadow-none py-2" style={modalInputStyle} defaultValue={modalConfig.data?.status || 'Grabando'}>
                <option value="Grabando">Online / Grabando</option>
                <option value="Offline">Offline / Señal Perdida</option>
                <option value="Mantenimiento">En Mantenimiento</option>
              </select>
            </div>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Registrar</button>
          </div>
        </form>
      );
    }

    if (modalConfig.type === 'form-bitacora') {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const title = formData.get('title');
          const desc = formData.get('desc');
          const type = formData.get('type');
          const shift = formData.get('shift');
          if (title && modalConfig.onConfirm) {
            let color = 'info'; if (type === 'Incidente') color = 'warning'; if (type === 'Emergencia') color = 'danger';
            const currentTime = modalConfig.data?.time || new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' });
            modalConfig.onConfirm({ id: modalConfig.data?.id || Date.now(), title, desc, type, shift, time: currentTime, color });
            closeModal();
          }
        }}>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Asunto o Novedad</label><input type="text" name="title" required className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.title || ''} placeholder="Ej. Ronda sin novedades" /></div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Tipo de Reporte</label>
              <select name="type" className="form-select shadow-none py-2" style={modalInputStyle} defaultValue={modalConfig.data?.type || 'Rutina'}>
                <option value="Rutina">Ronda de Rutina</option>
                <option value="Incidente">Incidente Leve</option>
                <option value="Emergencia">Emergencia / Grave</option>
              </select>
            </div>
            <div className="col-12 col-sm-6"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Turno Asignado</label>
              <select name="shift" className="form-select shadow-none py-2" style={modalInputStyle} defaultValue={modalConfig.data?.shift || 'Día'}>
                <option value="Día">Turno Día</option>
                <option value="Noche">Turno Noche</option>
              </select>
            </div>
          </div>
          <div className="mb-4"><label className="text-info small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Descripción de los hechos</label><textarea name="desc" required rows="3" className="form-control shadow-none" style={modalInputStyle} defaultValue={modalConfig.data?.desc || ''} placeholder="Escribe el detalle aquí..."></textarea></div>
          <div className="mb-4">
            <label className="text-info small fw-bold mb-2 text-uppercase d-block" style={{ letterSpacing: '1px' }}>Adjuntar Foto / Evidencia (Opcional)</label>
            <label className="border border-secondary border-opacity-50 rounded-3 p-4 text-center text-white-50 d-block transition-all hover-cyan shadow-sm" style={{ background: fileName ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255,255,255,0.02)', borderStyle: fileName ? 'solid' : 'dashed', cursor: 'pointer', borderColor: fileName ? 'var(--accent-cyan)' : '' }}>
              <input type="file" name="foto" className="d-none" accept="image/*" onChange={(e) => setFileName(e.target.files[0]?.name || '')} />
              {fileName ? (
                <>
                  <i className="bi bi-image fs-2 d-block mb-2 text-info"></i>
                  <span className="text-info fw-bold d-block text-truncate px-3">{fileName}</span>
                  <small className="d-block mt-1 text-white-50">Haz clic para cambiar la imagen</small>
                </>
              ) : (
                <>
                  <i className="bi bi-camera fs-2 d-block mb-2"></i>
                  <span className="d-block fw-medium mb-1">Haz clic para adjuntar foto al reporte</span>
                  <small className="text-white-50">Formatos: JPG, PNG (Max 5MB)</small>
                </>
              )}
            </label>
          </div>
          <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-4 border-top border-secondary border-opacity-25">
            <button type="button" className="btn btn-outline-light w-100 w-sm-auto rounded-pill px-4 py-2 fw-bold" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-premium-unique w-100 w-sm-auto text-white rounded-pill px-4 py-2 fw-bold shadow-lg">Guardar Entrada</button>
          </div>
        </form>
      );
    }
    return null;
  };

  return (
    <div className="d-flex position-relative w-100">
      
      {/* Overlay Oscuro para Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark d-lg-none" style={{ zIndex: 1040, opacity: 0.7, backdropFilter: 'blur(3px)', transition: 'opacity 0.3s ease' }} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Menú Lateral Fijo (Sidebar) */}
      <aside className={`dashboard-sidebar p-4 d-flex flex-column ${isMobileMenuOpen ? 'show' : ''}`}>
        <div className="d-flex align-items-center mb-5">
          <div className="d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #0056b3, #00d4ff)', borderRadius: '12px', transform: 'rotate(45deg)' }}>
            <i className="bi bi-buildings-fill text-white" style={{ transform: 'rotate(-45deg)', fontSize: '1.2rem' }}></i>
          </div>
          <span className="fs-4 fw-bold text-white">DOMUS</span>
        </div>
        
        <div className="text-white-50 small fw-bold text-uppercase mb-3 px-2 tracking-widest">Menú de {role}</div>
        <nav className="flex-grow-1">
          {activeMenu.map((item, i) => (
            <button 
              className={`sidebar-link border-0 w-100 text-start bg-transparent ${activeTab === item.text ? 'active' : ''}`} 
              key={i}
              onClick={() => { setActiveTab(item.text); setIsMobileMenuOpen(false); }}
            >
              <i className={`bi ${item.icon} fs-5 me-3`}></i> {item.text}
            </button>
          ))}
        </nav>

        {/* Perfil Inferior y Cierre de Sesión */}
        <div className="mt-auto border-top border-secondary border-opacity-25 pt-4">
          <div className="d-flex align-items-center mb-4 px-2">
            <div className="rounded-circle bg-secondary me-3 d-flex align-items-center justify-content-center text-white fw-bold shadow" style={{ width: '40px', height: '40px' }}>
              {role?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
            <strong className="text-white d-block text-truncate">{userName || (role?.charAt(0).toUpperCase() + role?.slice(1))}</strong>
              <small className="text-white-50 text-truncate d-block" style={{ fontSize: '0.75rem' }}>{userEmail}</small>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline-danger w-100 rounded-pill fw-bold">
            <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="dashboard-main flex-grow-1 p-4 p-md-5">
        
        {/* Header Superior Móvil */}
        <div className="dash-mobile-nav align-items-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center">
            <i className="bi bi-buildings-fill text-info fs-3 me-2"></i>
            <span className="fw-bold text-white fs-5">DOMUS</span>
          </div>
          <button className="btn btn-link text-white-50 p-0 hover-cyan" onClick={() => setIsMobileMenuOpen(true)}>
            <i className="bi bi-list fs-1"></i>
          </button>
        </div>

        {/* Cabecera del Contenido */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="display-6 fw-bold text-white mb-2" style={{ animation: 'fadeInDown 0.3s ease' }}>
              {activeTab === activeMenu[0].text ? `¡Hola, ${userName || (role?.charAt(0).toUpperCase() + role?.slice(1))}!` : activeTab}
            </h2>
            <p className="text-white-50 fs-5 mb-0" style={{ animation: 'fadeInDown 0.3s ease' }}>
              {activeTab === activeMenu[0].text ? 'Bienvenido de vuelta a tu espacio.' : `Gestiona la sección de ${activeTab ? activeTab.toLowerCase() : ''}.`}
            </p>
          </div>
          <div className="d-none d-md-block position-relative">
            <button className="btn btn-outline-light rounded-circle p-2 position-relative border-0 shadow-none me-2 hover-cyan" onClick={() => setShowNotifications(!showNotifications)}>
              <i className="bi bi-bell fs-4"></i>
              {notifCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger mt-1 ms-n2">{notifCount}</span>}
            </button>
            {showNotifications && (
              <div className="position-absolute end-0 mt-2 shadow-lg rounded-4 p-0 overflow-hidden" style={{ width: '380px', background: '#1e293b', border: '1px solid rgba(0,212,255,0.2)', zIndex: 9999 }}>
                <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                  <h6 className="text-white fw-bold mb-0"><i className="bi bi-bell me-2"></i>Notificaciones</h6>
                  <button className="btn btn-sm btn-link text-white-50 p-0" onClick={() => setShowNotifications(false)}><i className="bi bi-x-lg"></i></button>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className="p-3 border-bottom border-secondary border-opacity-10 hover-cyan" style={{ background: n.status === 'Pendiente' ? 'rgba(0,212,255,0.03)' : 'transparent' }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <strong className="text-white small">{n.title}</strong>
                        <small className="text-white-50" style={{ fontSize: '0.7rem' }}>{new Date(n.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</small>
                      </div>
                      <p className="text-white-50 small mb-2">{n.message}</p>
                      {n.fromUser && <small className="text-info d-block mb-2">De: {n.fromUser.name} ({n.fromUser.depto || 'N/A'})</small>}
                      {n.type === 'parking_request' && n.status === 'Pendiente' && (
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success rounded-pill px-3 flex-grow-1" onClick={async () => { try { await api.put(`/notifications/${n.id}/respond`, { status: 'Aprobada' }); setNotifications(prev => prev.map(x => x.id === n.id ? {...x, status: 'Aprobada'} : x)); setNotifCount(prev => Math.max(0, prev - 1)); } catch(err) { alert('Error'); } }}><i className="bi bi-check-lg me-1"></i>Aprobar</button>
                          <button className="btn btn-sm btn-danger rounded-pill px-3 flex-grow-1" onClick={async () => { try { await api.put(`/notifications/${n.id}/respond`, { status: 'Rechazada' }); setNotifications(prev => prev.map(x => x.id === n.id ? {...x, status: 'Rechazada'} : x)); setNotifCount(prev => Math.max(0, prev - 1)); } catch(err) { alert('Error'); } }}><i className="bi bi-x-lg me-1"></i>Rechazar</button>
                        </div>
                      )}
                      {n.status !== 'Pendiente' && n.type !== 'parking_response' && (
                        <span className={`badge bg-${n.status === 'Aprobada' ? 'success' : n.status === 'Rechazada' ? 'danger' : 'secondary'} bg-opacity-25 text-${n.status === 'Aprobada' ? 'success' : n.status === 'Rechazada' ? 'danger' : 'secondary'} rounded-pill px-2`} style={{ fontSize: '0.7rem' }}>{n.status}</span>
                      )}
                    </div>
                  )) : (
                    <div className="p-4 text-center text-white-50">
                      <i className="bi bi-bell-slash fs-3 d-block mb-2 opacity-50"></i>
                      <small>No tienes notificaciones</small>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Renderizado inteligente según el rol que haya iniciado sesión */}
        {role === 'admin' && <AdminDashboard activeTab={activeTab} onOpenModal={openModal} residents={residents} setResidents={setResidents} comunicados={comunicados} setComunicados={setComunicados} areas={areas} setAreas={setAreas} tickets={tickets} setTickets={setTickets} isLoadingUsers={isLoadingData} />}
        {role === 'residente' && <ResidenteDashboard userName={userName} userEmail={userEmail} userDepto={userDepto} activeTab={activeTab} onOpenModal={openModal} comunicados={comunicados} tickets={tickets} setTickets={setTickets} />}
        {role === 'seguridad' && <SeguridadDashboard activeTab={activeTab} onOpenModal={openModal} residents={residents} />}
        
      </main>

      {/* MODAL INTELIGENTE GLOBAL */}
      {modalConfig.isOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ zIndex: 9999, background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="card border-0 p-0 shadow-lg position-relative d-flex flex-column overflow-hidden" style={{ background: '#0f172a', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '28px', width: '100%', maxWidth: '550px', maxHeight: '90vh', animation: 'fadeInDown 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            
            {/* Glow decorativo */}
            <div className="position-absolute top-0 start-50 translate-middle rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
            
            <div className="d-flex justify-content-between align-items-center p-4 p-md-5 pb-3 pb-md-4 border-bottom border-secondary border-opacity-25 flex-shrink-0" style={{ zIndex: 1 }}>
              <div className="d-flex align-items-center gap-3 overflow-hidden">
                <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <i className={`bi ${modalConfig.type.startsWith('confirm') ? 'bi-shield-exclamation' : 'bi-ui-checks'} text-info fs-5`}></i>
                </div>
                <h4 className="text-white fw-bold mb-0 text-truncate">{modalConfig.title}</h4>
              </div>
              <button className="btn btn-link text-white-50 p-0 hover-cyan transition-all flex-shrink-0 ms-2" onClick={closeModal} style={{ transform: 'scale(1.2)' }}><i className="bi bi-x"></i></button>
            </div>
              
            <div className="p-4 p-md-5 pt-4 overflow-auto flex-grow-1" style={{ zIndex: 1 }}>
              {renderModalBody()}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Dashboard;

// Resident search filter

// Export to PDF

// Dark mode toggle

// Notification panel

// Real-time indicators
