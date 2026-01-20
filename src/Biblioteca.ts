// ============================================
// ARCHIVO 6: Biblioteca.ts
// SERVICIO PRINCIPAL - GESTIONA TODA LA LÓGICA
// ============================================

import { IStorage } from "./IStorage";
import { JsonStorageAdapter } from "./JsonStorageAdapter";
import { Libro } from "./Libro";
import { Usuario } from "./Usuario";
import { Prestamo } from "./Prestamo";

/**
 * Define la estructura de la base de datos
 * Esto es lo que se guardará y cargará del JSON
 */
interface DBShape {
  libros: any[];
  usuarios: any[];
  prestamos: any[];
  nextIds: { libro: number; usuario: number; prestamo: number };
}

/**
 * Clase BIBLIOTECA - Servicio principal que gestiona toda la aplicación
 * 
 * ¿CÓMO FUNCIONA?
 * - Mantiene 3 Maps en memoria: libros, usuarios, prestamos
 * - Usa la interfaz IStorage para guardar/cargar datos
 * - El PATRÓN ADAPTER permite cambiar el sistema de almacenamiento
 *   sin modificar este código
 * 
 * VENTAJA: Si queremos cambiar de JSON a Base de Datos,
 * solo pasamos otro adapter al constructor, sin cambiar nada aquí.
 */
class Biblioteca {
  // Maps que almacenan los datos en memoria durante la ejecución
  private libros: Map<number, Libro> = new Map();
  private usuarios: Map<number, Usuario> = new Map();
  private prestamos: Map<number, Prestamo> = new Map();

  // Contadores para generar IDs únicos
  private nextIds = { libro: 1, usuario: 1, prestamo: 1 };

  // El sistema de almacenamiento (puede ser JSON, BD, API, etc.)
  private storage: IStorage;

  /**
   * Constructor de la Biblioteca
   * 
   * @param storage - PATRÓN ADAPTER: El sistema de almacenamiento a usar
   *                 Si no se proporciona, usa JsonStorageAdapter por defecto
   * 
   * INYECCIÓN DE DEPENDENCIAS:
   * - Permite pasar diferentes implementaciones de IStorage
   * - Facilita las pruebas (podemos pasar un storage fake)
   * - Desacopla el código: no depende de una implementación específica
   */
  constructor(storage?: IStorage) {
    // Si no se proporciona, usa el adapter de JSON
    this.storage = storage || new JsonStorageAdapter();
    
    // Carga los datos guardados anteriormente
    this.load();
    console.log("✓ Biblioteca inicializada");
  }

  /**
   * GUARDA todos los datos en el almacenamiento
   * 
   * PROCESO:
   * 1. Convierte los Maps a arrays
   * 2. Serializa cada elemento a JSON
   * 3. Crea un objeto con toda la información
   * 4. Usa this.storage.save() para guardarlo
   * 
   * VENTAJA DEL ADAPTER:
   * - No nos importa si usa JSON, BD, o API
   * - El storage se encarga de cómo guardar los datos
   */
  private save(): void {
    const db: DBShape = {
      // Convierte Map<numero, Libro> a array de objetos JSON
      libros: Array.from(this.libros.values()).map(l => l.toJSON()),
      // Convierte Map<numero, Usuario> a array de objetos JSON
      usuarios: Array.from(this.usuarios.values()).map(u => u.toJSON()),
      // Convierte Map<numero, Prestamo> a array de objetos JSON
      prestamos: Array.from(this.prestamos.values()).map(p => p.toJSON()),
      // Guarda los contadores
      nextIds: this.nextIds
    };
    
    // Usa el adapter para guardar (puede ser JSON, BD, etc.)
    this.storage.save(db);
  }

  /**
   * CARGA todos los datos desde el almacenamiento
   * 
   * PROCESO:
   * 1. Usa this.storage.load() para obtener los datos
   * 2. Si no hay datos, retorna (primera vez)
   * 3. Convierte cada objeto JSON a instancia de su clase
   * 4. Agrega cada instancia a su respectivo Map
   * 5. Restaura los contadores
   * 
   * RESTAURACIÓN:
   * - Cada Libro.fromJSON() crea una instancia completa con su estado
   * - Los Maps reciben las instancias con toda su funcionalidad
   */
  private load(): void {
    // Obtiene datos del storage (puede venir de JSON, BD, etc.)
    const data = this.storage.load();
    
    // Si no hay datos previos, retorna
    if (!data) return;

    // Restaura los LIBROS
    if (Array.isArray(data.libros)) {
      for (const lb of data.libros) {
        const libro = Libro.fromJSON(lb);
        this.libros.set(lb.id, libro);
      }
      console.log(`✓ ${data.libros.length} libros cargados`);
    }

    // Restaura los USUARIOS
    if (Array.isArray(data.usuarios)) {
      for (const us of data.usuarios) {
        const usuario = Usuario.fromJSON(us);
        this.usuarios.set(us.id, usuario);
      }
      console.log(`✓ ${data.usuarios.length} usuarios cargados`);
    }

    // Restaura los PRÉSTAMOS
    if (Array.isArray(data.prestamos)) {
      for (const pr of data.prestamos) {
        const prestamo = Prestamo.fromJSON(pr);
        this.prestamos.set(pr.id, prestamo);
      }
      console.log(`✓ ${data.prestamos.length} préstamos cargados`);
    }

    // Restaura los contadores
    if (data.nextIds) {
      this.nextIds = data.nextIds;
    }
  }

  /**
   * CREA un nuevo Libro en la biblioteca
   * 
   * @param titulo - Título del libro
   * @param autor - Autor del libro
   * @param año - Año de publicación
   * @returns El Libro creado
   * 
   * PROCESO:
   * 1. Genera un ID único usando nextIds.libro
   * 2. Crea una nueva instancia de Libro
   * 3. La agrega al Map de libros
   * 4. Guarda todos los datos
   * 5. Retorna el Libro
   */
  crearLibro(titulo: string, autor: string, año: number): Libro {
    const id = this.nextIds.libro++;
    const libro = new Libro(id, titulo, autor, año);
    this.libros.set(id, libro);
    this.save();
    return libro;
  }

  /**
   * OBTIENE la lista de todos los libros
   * 
   * @returns Array con todos los Libros en la biblioteca
   */
  listarLibros(): Libro[] {
    return Array.from(this.libros.values());
  }

  /**
   * CREA un nuevo Usuario en la biblioteca
   * 
   * @param nombre - Nombre del usuario
   * @returns El Usuario creado
   * 
   * PROCESO:
   * 1. Genera un ID único usando nextIds.usuario
   * 2. Crea una nueva instancia de Usuario
   * 3. La agrega al Map de usuarios
   * 4. Guarda todos los datos
   * 5. Retorna el Usuario
   */
  crearUsuario(nombre: string): Usuario {
    const id = this.nextIds.usuario++;
    const usuario = new Usuario(id, nombre);
    this.usuarios.set(id, usuario);
    this.save();
    return usuario;
  }

  /**
   * OBTIENE la lista de todos los usuarios
   * 
   * @returns Array con todos los Usuarios en la biblioteca
   */
  listarUsuarios(): Usuario[] {
    return Array.from(this.usuarios.values());
  }

  /**
   * REGISTRA un préstamo de un libro a un usuario
   * 
   * @param libroId - ID del libro a prestar
   * @param usuarioId - ID del usuario que toma el préstamo
   * @returns Objeto con { ok: boolean, mensaje: string, prestamo?: Prestamo }
   * 
   * VALIDACIONES:
   * 1. Verifica que el libro exista
   * 2. Verifica que el usuario exista
   * 3. Verifica que el libro esté disponible
   * 
   * PROCESO (si todo es válido):
   * 1. Genera un ID único para el préstamo
   * 2. Obtiene la fecha actual
   * 3. Crea un nuevo Préstamo
   * 4. Marca el Libro como no disponible (prestado)
   * 5. Agrega el Préstamo al Map
   * 6. Guarda todos los datos
   * 7. Retorna el Préstamo creado
   */
  prestarLibro(libroId: number, usuarioId: number) {
    // Busca el libro y usuario
    const libro = this.libros.get(libroId);
    const usuario = this.usuarios.get(usuarioId);

    // VALIDACIONES
    if (!libro) {
      console.error("❌ Libro no encontrado");
      return { ok: false, mensaje: "Libro no encontrado" };
    }
    if (!usuario) {
      console.error("❌ Usuario no encontrado");
      return { ok: false, mensaje: "Usuario no encontrado" };
    }
    if (!libro.isDisponible()) {
      console.error("❌ Libro no disponible");
      return { ok: false, mensaje: "Libro no disponible" };
    }

    // Crea el préstamo
    const id = this.nextIds.prestamo++;
    const fecha = new Date().toISOString();
    const prestamo = new Prestamo(id, libroId, usuarioId, fecha);
    
    // Marca el libro como prestado
    libro.prestar();
    
    // Agrega el préstamo al Map
    this.prestamos.set(id, prestamo);
    
    // Guarda todo
    this.save();

    return { ok: true, mensaje: "Préstamo registrado", prestamo };
  }

  /**
   * REGISTRA la devolución de un libro
   * 
   * @param prestamoId - ID del préstamo a devolver
   * @returns Objeto con { ok: boolean, mensaje: string }
   * 
   * VALIDACIONES:
   * 1. Verifica que el préstamo exista
   * 2. Verifica que el préstamo esté activo (no devuelto)
   * 3. Verifica que el libro aún exista
   * 
   * PROCESO (si todo es válido):
   * 1. Registra la fecha de devolución en el Préstamo
   * 2. Marca el Libro como disponible
   * 3. Guarda todos los datos
   */
  devolverLibro(prestamoId: number) {
    // Busca el préstamo
    const prestamo = this.prestamos.get(prestamoId);

    // VALIDACIONES
    if (!prestamo) {
      console.error("❌ Préstamo no encontrado");
      return { ok: false, mensaje: "Préstamo no encontrado" };
    }
    if (!prestamo.isActivo()) {
      console.error("❌ Préstamo ya devuelto");
      return { ok: false, mensaje: "Ya devuelto" };
    }

    // Busca el libro del préstamo
    const libro = this.libros.get(prestamo.libroId);
    if (!libro) {
      console.error("❌ Libro inexistente");
      return { ok: false, mensaje: "Libro inexistente" };
    }

    // Registra la devolución
    prestamo.devolver(new Date().toISOString());
    libro.devolver();
    
    // Guarda todo
    this.save();

    return { ok: true, mensaje: "Libro devuelto" };
  }

  /**
   * OBTIENE la lista de préstamos (activos o todos)
   * 
   * @param activosOnly - Si true, solo retorna préstamos activos (sin devolver)
   * @returns Array con los Préstamos solicitados
   */
  listarPrestamos(activosOnly = false): Prestamo[] {
    const arr = Array.from(this.prestamos.values());
    return activosOnly ? arr.filter(p => p.isActivo()) : arr;
  }

  /**
   * RETORNA estadísticas de la biblioteca
   * 
   * @returns Objeto con: { totalLibros, disponibles, prestamosActivos }
   */
  estadisticas() {
    // Total de libros en la biblioteca
    const totalLibros = this.libros.size;
    
    // Cuántos libros están disponibles ahora
    const disponibles = Array.from(this.libros.values())
      .filter(l => l.isDisponible()).length;
    
    // Cuántos préstamos están activos (sin devolver)
    const prestamosActivos = this.listarPrestamos(true).length;

    return { totalLibros, disponibles, prestamosActivos };
  }
}

export { Biblioteca };