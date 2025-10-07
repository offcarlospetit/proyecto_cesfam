import React, { memo } from "react";
import { cx } from "../utils/cx";

/**
 * columns: Array<{ key: string, header: string, className?: string, renderCell?: (row)=>JSX, renderExport?: (row)=>any }>
 * data: any[]
 * emptyText?: string
 * rowKey?: (row, idx) => string
 * rowActions?: (row) => JSX
 * headerClassName?: string
 * bodyClassName?: string
 */
function Table({
    columns,
    data,
    emptyText = "Sin resultados",
    rowKey = (_row, i) => String(i),
    rowActions,
    headerClassName = "",
    bodyClassName = "",
}) {
    return (
        <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
            <table className="table">
                <thead className={cx("thead", headerClassName)}>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={cx("th", col.className)}>
                                {col.header}
                            </th>
                        ))}
                        {rowActions && <th className="th">Acciones</th>}
                    </tr>
                </thead>
                <tbody className={bodyClassName}>
                    {(!data || data.length === 0) && (
                        <tr>
                            <td
                                className="td"
                                colSpan={columns.length + (rowActions ? 1 : 0)}
                            >
                                {emptyText}
                            </td>
                        </tr>
                    )}
                    {data?.map((row, i) => (
                        <tr key={rowKey(row, i)} className="hover:bg-slate-50">
                            {columns.map((col) => (
                                <td key={col.key} className={cx("td", col.className)}>
                                    {col.renderCell ? col.renderCell(row) : row[col.key]}
                                </td>
                            ))}
                            {rowActions && <td className="td">{rowActions(row)}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Default + named export (cubre ambos estilos de import)
const TableMemo = memo(Table);
export default TableMemo;
export { TableMemo as Table };
