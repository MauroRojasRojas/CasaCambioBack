export function generateReserveCode(idReserva) {
    return `HG-${String(idReserva).padStart(8, "0")}`;
  }