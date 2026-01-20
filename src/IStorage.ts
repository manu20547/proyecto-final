// ============================================
// ARCHIVO 1: IStorage.ts
// INTERFAZ PARA EL PATRÓN ADAPTER
// ============================================

/**
 * Interfaz que define el contrato para cualquier
 * sistema de almacenamiento de datos.
 * 
 * Usando esta interfaz, podemos cambiar fácilmente
 * entre diferentes formas de almacenar datos
 * (JSON, Base de Datos, API, etc.) sin modificar
 * el código de la Biblioteca.
 * 
 * Este es el PATRÓN ADAPTER: adaptamos diferentes
 * sistemas de almacenamiento a una interfaz común.
 */
interface IStorage {
  /**
   * Guarda un objeto en el almacenamiento
   * @param obj - Los datos a guardar
   */
  save(obj: unknown): void;

  /**
   * Carga los datos desde el almacenamiento
   * @returns Los datos cargados o null si no existen
   */
  load(): any | null;
}

export { IStorage };