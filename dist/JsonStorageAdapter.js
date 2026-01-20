"use strict";
// ============================================
// ARCHIVO 2: JsonStorageAdapter.ts
// PATRÓN ADAPTER - IMPLEMENTACIÓN PARA JSON
// ============================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStorageAdapter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
class JsonStorageAdapter {
    constructor() {
        this.dataFile = path_1.default.join(process.cwd(), "data", "biblioteca.json");
    }
    /**
     * Asegura que el directorio de datos existe
     * Si no existe, lo crea recursivamente
     *
     * Se ejecuta ANTES de guardar para evitar errores
     */
    ensureDataDir() {
        const dir = path_1.default.dirname(this.dataFile);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
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
    save(obj) {
        this.ensureDataDir();
        const json = JSON.stringify(obj, null, 2); // null, 2 = formato bonito
        fs_1.default.writeFileSync(this.dataFile, json, { encoding: "utf-8" });
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
    load() {
        try {
            // Si el archivo no existe, retorna null
            if (!fs_1.default.existsSync(this.dataFile)) {
                console.log(`ℹ No existe archivo previo: ${this.dataFile}`);
                return null;
            }
            // Lee el archivo como texto
            const raw = fs_1.default.readFileSync(this.dataFile, { encoding: "utf-8" });
            // Convierte el texto JSON a objeto JavaScript
            const data = JSON.parse(raw);
            console.log(`✓ Datos cargados desde: ${this.dataFile}`);
            return data;
        }
        catch (err) {
            console.error("❌ Error leyendo almacenamiento JSON:", err);
            return null;
        }
    }
}
exports.JsonStorageAdapter = JsonStorageAdapter;
