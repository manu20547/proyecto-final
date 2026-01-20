"use strict";
// ============================================
// ARCHIVO 5: Prestamo.ts
// MODELO DE DATOS - REPRESENTA UN PRÉSTAMO
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestamo = void 0;
/**
 * Clase que representa un PRÉSTAMO en la biblioteca
 *
 * Un préstamo vincula:
 * - Un LIBRO (libroId)
 * - Un USUARIO (usuarioId)
 * - Una fecha de préstamo
 * - Una fecha de devolución (opcional, si aún está activo)
 *
 * RESPONSABILIDADES:
 * - Registrar la información del préstamo
 * - Gestionar el estado del préstamo (activo o devuelto)
 * - Serialización/Deserialización (guardar/cargar del JSON)
 */
class Prestamo {
    /**
     * Constructor del Préstamo
     *
     * @param id - Identificador único del préstamo (no puede cambiar)
     * @param libroId - ID del libro que se prestó
     * @param usuarioId - ID del usuario que tomó el préstamo
     * @param fechaPrestamo - Fecha en que se realizó el préstamo
     * @param fechaDevolucion - Fecha de devolución (undefined si aún no se devuelve)
     */
    constructor(id, libroId, usuarioId, fechaPrestamo, fechaDevolucion // ? = opcional
    ) {
        this.id = id;
        this.libroId = libroId;
        this.usuarioId = usuarioId;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaDevolucion = fechaDevolucion;
    }
    /**
     * Verifica si el préstamo está ACTIVO
     * Un préstamo está activo si no ha sido devuelto
     *
     * @returns true si el préstamo está activo
     * @returns false si ya fue devuelto
     *
     * LÓGICA:
     * - Si fechaDevolucion no existe (es undefined), el préstamo está activo
     * - Si fechaDevolucion existe, el préstamo ya fue devuelto
     */
    isActivo() {
        return !this.fechaDevolucion;
    }
    /**
     * Registra la DEVOLUCIÓN del préstamo
     *
     * @param fecha - Fecha de la devolución
     * @returns true si se devolvió correctamente
     * @returns false si el préstamo ya había sido devuelto
     *
     * PROCESO:
     * 1. Verifica que el préstamo esté activo
     * 2. Si no está activo, no se puede devolver dos veces
     * 3. Si está activo, registra la fecha de devolución
     */
    devolver(fecha) {
        // Si no está activo, ya fue devuelto
        if (!this.isActivo()) {
            console.warn(`⚠ El préstamo ${this.id} ya fue devuelto`);
            return false;
        }
        // Registra la fecha de devolución
        this.fechaDevolucion = fecha;
        console.log(`✓ Préstamo ${this.id} marcado como devuelto`);
        return true;
    }
    /**
     * Serializa el préstamo a un objeto JSON
     * Se usa cuando queremos guardar el préstamo en el archivo JSON
     *
     * @returns Objeto con todos los datos del préstamo
     */
    toJSON() {
        return {
            id: this.id,
            libroId: this.libroId,
            usuarioId: this.usuarioId,
            fechaPrestamo: this.fechaPrestamo,
            fechaDevolucion: this.fechaDevolucion
        };
    }
    /**
     * Deserializa un objeto JSON a una instancia de Préstamo
     * Se usa cuando cargamos datos del archivo JSON
     *
     * @param obj - Objeto con los datos del JSON
     * @returns Una nueva instancia de Préstamo con los datos cargados
     */
    static fromJSON(obj) {
        return new Prestamo(obj.id, obj.libroId, obj.usuarioId, obj.fechaPrestamo, obj.fechaDevolucion);
    }
}
exports.Prestamo = Prestamo;
