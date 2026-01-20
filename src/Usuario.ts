// ============================================
// ARCHIVO 4: Usuario.ts
// MODELO DE DATOS - REPRESENTA UN USUARIO
// ============================================

/**
 * Clase que representa un USUARIO de la biblioteca
 * 
 * RESPONSABILIDADES:
 * - Almacenar información del usuario (id, nombre)
 * - Serialización/Deserialización (guardar/cargar del JSON)
 * 
 * Nota: Esta clase es simple porque no gestiona
 * el estado (los préstamos se manejan en la clase Prestamo)
 */
class Usuario {
  /**
   * Constructor del Usuario
   * 
   * @param id - Identificador único del usuario (no puede cambiar)
   * @param nombre - Nombre del usuario
   */
  constructor(
    public readonly id: number,    // readonly = no se puede cambiar después
    public nombre: string
  ) {}

  /**
   * Serializa el usuario a un objeto JSON
   * Se usa cuando queremos guardar el usuario en el archivo JSON
   * 
   * @returns Objeto con los datos del usuario
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre
    };
  }

  /**
   * Deserializa un objeto JSON a una instancia de Usuario
   * Se usa cuando cargamos datos del archivo JSON
   * 
   * @param obj - Objeto con los datos del JSON
   * @returns Una nueva instancia de Usuario con los datos cargados
   */
  static fromJSON(obj: any): Usuario {
    return new Usuario(obj.id, obj.nombre);
  }
}

export { Usuario };