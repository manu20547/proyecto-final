// ============================================
// ARCHIVO 2: JsonStorageAdapter.ts
// PATRÓN ADAPTER - IMPLEMENTACIÓN PARA JSON
// ============================================

import fs from "fs";
import path from "path";
import { IStorage } from "./IStorage";

/**
 * PATRÓN ADAPTER: Clase que adapta el sistema de archivos JSON
 * para que implemente la interfaz IStorage.
 * 
 * ¿Por qué es un adapter?
 * - La clase fs (file system) de Node.js no sigue nuestra interfaz IStorage
 * - Creamos JsonStorageAdapter para "adaptar" fs a nuestra interfaz
 * - Ahora cualquier código que espera IStorage puede usar JsonStorageAdapter
 * 
 * VENTAJA: Si queremos cambiar a otra forma de almacenamiento
 * (Base de datos, API, etc.), solo creamos un nuevo adapter
 * sin modificar el código principal.
 */
class JsonStorageAdapter implements IStorage {
  // Ruta donde se guardarán los datos JSON
  private readonly dataFile: string;

  constructor() {
    this.dataFile = path.join(process.cwd(), "data", "biblioteca.json");
  }

  /**
   * Asegura que el directorio de datos existe
   * Si no existe, lo crea recursivamente
   * 
   * Se ejecuta ANTES de guardar para evitar errores
   */
  private ensureDataDir(): void {
    const dir = path.dirname(this.dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✓ Directorio creado: ${dir}`);
    }
  }

  /**
   * Implementa el método save de la interfaz IStorage
   * 
   * @param obj - Los datos a guardar (pueden ser libros, usuarios, préstamos)
   * 
   * PROCESO:
   * 1. Asegura que existe el directorio
   * 2. Convierte el objeto a JSON formateado (legible)
   * 3. Escribe el JSON en el archivo
   */
  save(obj: unknown): void {
    this.ensureDataDir();
    const json = JSON.stringify(obj, null, 2); // null, 2 = formato bonito
    fs.writeFileSync(this.dataFile, json, { encoding: "utf-8" });
    console.log(`✓ Datos guardados en: ${this.dataFile}`);
  }

  /**
   * Implementa el método load de la interfaz IStorage
   * 
   * @returns Los datos parseados desde el JSON, o null si el archivo no existe
   * 
   * PROCESO:
   * 1. Verifica si el archivo existe
   * 2. Si existe, lo lee como string
   * 3. Parsea el string a objeto JavaScript
   * 4. Si hay error, lo captura y retorna null
   */
  load(): any | null {
    try {
      // Si el archivo no existe, retorna null
      if (!fs.existsSync(this.dataFile)) {
        console.log(`ℹ No existe archivo previo: ${this.dataFile}`);
        return null;
      }

      // Lee el archivo como texto
      const raw = fs.readFileSync(this.dataFile, { encoding: "utf-8" });
      
      // Convierte el texto JSON a objeto JavaScript
      const data = JSON.parse(raw);
      console.log(`✓ Datos cargados desde: ${this.dataFile}`);
      return data;
    } catch (err) {
      console.error("❌ Error leyendo almacenamiento JSON:", err);
      return null;
    }
  }
}

export { JsonStorageAdapter };