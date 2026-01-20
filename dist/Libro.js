"use strict";
// ============================================
// ARCHIVO 3: Libro.ts
// MODELO DE DATOS - REPRESENTA UN LIBRO
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libro = void 0;
/**
 * Clase que representa un LIBRO en la biblioteca
 *
 * RESPONSABILIDADES:
 * - Almacenar información del libro (id, título, autor, año)
 * - Gestionar el estado del libro (disponible o prestado)
 * - Métodos para prestar y devolver
 * - Serialización/Deserialización (guardar/cargar del JSON)
 */
class Libro {
    /**
     * Constructor del Libro
     *
     * @param id - Identificador único del libro (no puede cambiar)
     * @param titulo - Título del libro
     * @param autor - Autor del libro
     * @param año - Año de publicación
     */
    constructor(id, // readonly = no se puede cambiar después
    titulo, autor, año) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.año = año;
        // Todo nuevo libro comienza como disponible
        this.disponible = true;
    }
    /**
     * Verifica si el libro está disponible para prestar
     *
     * @returns true si está disponible, false si está prestado
     */
    isDisponible() {
        return this.disponible;
    }
    /**
     * Marca el libro como PRESTADO
     *
     * @returns true si se prestó correctamente
     * @returns false si ya estaba prestado (no se puede prestar dos veces)
     *
     * LÓGICA:
     * - Si ya está prestado, retorna false (no lo puedo prestar)
     * - Si está disponible, lo marca como no disponible y retorna true
     */
    prestar() {
        if (!this.disponible) {
            console.warn(`⚠ El libro "${this.titulo}" ya está prestado`);
            return false;
        }
        this.disponible = false;
        console.log(`✓ Libro "${this.titulo}" prestado`);
        return true;
    }
    /**
     * Marca el libro como DEVUELTO
     *
     * @returns true si se devolvió correctamente
     * @returns false si ya estaba disponible (no se puede devolver lo que no se prestó)
     *
     * LÓGICA:
     * - Si ya está disponible, retorna false (no hay nada que devolver)
     * - Si está prestado, lo marca como disponible y retorna true
     */
    devolver() {
        if (this.disponible) {
            console.warn(`⚠ El libro "${this.titulo}" ya estaba disponible`);
            return false;
        }
        this.disponible = true;
        console.log(`✓ Libro "${this.titulo}" devuelto`);
        return true;
    }
    /**
     * Serializa el libro a un objeto JSON
     * Se usa cuando queremos guardar el libro en el archivo JSON
     *
     * @returns Objeto con todos los datos del libro
     */
    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            autor: this.autor,
            año: this.año,
            disponible: this.disponible
        };
    }
    /**
     * Deserializa un objeto JSON a una instancia de Libro
     * Se usa cuando cargamos datos del archivo JSON
     *
     * @param obj - Objeto con los datos del JSON
     * @returns Una nueva instancia de Libro con los datos cargados
     *
     * PROCESO:
     * 1. Crea un nuevo Libro con los datos básicos
     * 2. Si el libro estaba prestado en el JSON, lo marca como prestado
     * 3. Retorna el Libro completamente restaurado
     */
    static fromJSON(obj) {
        // Crea nuevo Libro con datos del JSON
        const libro = new Libro(obj.id, obj.titulo, obj.autor, obj.año);
        // Si en el JSON estaba marcado como no disponible, lo marca como prestado
        if (typeof obj.disponible === "boolean" && !obj.disponible) {
            libro.prestar();
        }
        return libro;
    }
}
exports.Libro = Libro;
