export function formatItemLabel(row: Record<string, unknown>) {
  const code = String(row.item_code ?? "").trim();
  const name = String(row.item_name ?? "").trim();
  if (code && name) {
    return `${code} - ${name}`;
  }
  return code || name || String(row.name ?? "");
}

export function formatWarehouseLabel(row: Record<string, unknown>) {
  const display = String(row.warehouse_name ?? "").trim();
  const key = String(row.name ?? "").trim();
  if (display && key && display !== key) {
    return `${display} - ${key}`;
  }
  return display || key;
}

export function formatSupplierLabel(row: Record<string, unknown>) {
  const name = String(row.supplier_name ?? "").trim();
  return name || String(row.name ?? "").trim();
}

export function formatCompanyLabel(row: Record<string, unknown>) {
  const title = String(row.company_name ?? "").trim();
  return title || String(row.name ?? "").trim();
}

export function formatTaxTemplateLabel(row: Record<string, unknown>) {
  const title = String(row.title ?? "").trim();
  return title || String(row.name ?? "").trim();
}
