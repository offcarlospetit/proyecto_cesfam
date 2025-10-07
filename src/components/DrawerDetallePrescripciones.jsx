import { useEffect, useRef } from "react";
import { formatFecha } from "../utils/dates";


/** ======== Componentes ======== */
export const DrawerDetallePrescripciones = ({ open, onClose, presc }) => {
  const closeBtnRef = useRef(null);

  // cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && open) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // foco inicial en botón cerrar
  useEffect(() => { if (open && closeBtnRef.current) closeBtnRef.current.focus(); }, [open]);

  return (
    <div className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="sheet" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="sheet-header">
          <h3 id="drawer-title">Detalle de prescripción</h3>
          <button ref={closeBtnRef} className="icon-btn" onClick={onClose} aria-label="Cerrar panel">×</button>
        </header>

        <div className="sheet-body">
          {presc && (
            <>
              <div className="meta-grid">
                <div><span className="meta-label">ID</span><strong className="mono">{presc.id}</strong></div>
                <div><span className="meta-label">Folio</span><strong className="mono">{presc.folio}</strong></div>
                <div><span className="meta-label">Fecha</span><strong>{formatFecha(presc.fecha)}</strong></div>
                <div><span className="meta-label">Paciente</span><strong>{presc.paciente?.nombre}</strong></div>
                <div><span className="meta-label">Médico</span><strong>{presc.medico?.nombre}</strong></div>
                <div><span className="meta-label">Estado</span><span className="chip" data-estado={presc.estado}>{presc.estado}</span></div>
              </div>

              <div className="panel subpanel">
                <div className="panel-header"><h4>Líneas de la prescripción</h4></div>
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Artículo</th><th>Solicitado</th><th>Entregado</th></tr></thead>
                    <tbody>
                      {(presc.items || []).map((it, i) => (
                        <tr key={i}>
                          <td>{it.nombre}</td>
                          <td>{it.solicitado}</td>
                          <td>{it.entregado ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="acciones-detalle">
          <button className="btn-primary" disabled>Preparar</button>
        </div>
      </aside>
    </div>
  );
}
