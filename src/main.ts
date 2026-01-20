// ============================================
// ARCHIVO 7: main.ts
// DEMOSTRACIÓN DE USO DEL SISTEMA
// ============================================

import { Biblioteca } from "./Biblioteca";

/**
 * Función DEMO que muestra el funcionamiento completo del sistema
 * 
 * PASOS:
 * 1. Crea una Biblioteca
 * 2. Muestra el estado inicial
 * 3. Crea libros y usuarios de ejemplo
 * 4. Realiza un préstamo
 * 5. Devuelve el libro
 * 6. Muestra estadísticas finales
 */
function demo() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║        DEMO - SISTEMA DE GESTIÓN DE BIBLIOTECA        ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log("\n");

  // ===== PASO 1: CREAR BIBLIOTECA =====
  console.log("📚 Inicializando Biblioteca...");
  const biblioteca = new Biblioteca();
  console.log("\n");

  // ===== PASO 2: MOSTRAR ESTADO INICIAL =====
  console.log("📊 Estado inicial:");
  console.log(`   - Libros: ${biblioteca.listarLibros().length}`);
  console.log(`   - Usuarios: ${biblioteca.listarUsuarios().length}`);
  console.log(`   - Préstamos activos: ${biblioteca.listarPrestamos(true).length}`);
  console.log("\n");

  // ===== PASO 3: CREAR DATOS DE EJEMPLO =====
  console.log("📖 Creando libros de ejemplo...");
  if (biblioteca.listarLibros().length === 0) {
    biblioteca.crearLibro(
      "Cien años de soledad",
      "Gabriel García Márquez",
      1967
    );
    biblioteca.crearLibro(
      "Don Quijote de la Mancha",
      "Miguel de Cervantes",
      1605
    );
    biblioteca.crearLibro(
      "El Quijote",
      "Miguel de Cervantes",
      1605
    );
  }
  console.log("\n");

  console.log("👥 Creando usuarios de ejemplo...");
  if (biblioteca.listarUsuarios().length === 0) {
    biblioteca.crearUsuario("Ana Pérez");
    biblioteca.crearUsuario("Carlos López");
    biblioteca.crearUsuario("María García");
  }
  console.log("\n");

  // ===== PASO 4: MOSTRAR DATOS =====
  console.log("📋 LIBROS DISPONIBLES:");
  console.table(
    biblioteca.listarLibros().map((l: any) => ({
      "ID": l.id,
      "Título": l.titulo,
      "Autor": l.autor,
      "Año": l.año,
      "Disponible": l.isDisponible() ? "✓" : "✗"
    }))
  );

  console.table(
    biblioteca.listarUsuarios().map((u: any) => ({
      "ID": u.id,
      "Nombre": u.nombre
    }))
  );
  console.log("\n");

  // ===== PASO 5: REALIZAR UN PRÉSTAMO =====
  console.log("🔄 REALIZANDO PRÉSTAMO...");
  const libros = biblioteca.listarLibros();
  const usuarios = biblioteca.listarUsuarios();

  if (libros.length > 0 && usuarios.length > 0) {
    const resultadoPrestamo = biblioteca.prestarLibro(
      libros[0].id,
      usuarios[0].id
    );
    console.log(`   ${resultadoPrestamo.mensaje}`);
    console.log(`   Libro: "${libros[0].titulo}"`);
    console.log(`   Usuario: "${usuarios[0].nombre}"`);
  }
  console.log("\n");

  // ===== PASO 6: MOSTRAR ESTADO DESPUÉS DEL PRÉSTAMO =====
  console.log("📊 Después del préstamo:");
  console.log("Estadísticas:", biblioteca.estadisticas());
  console.log("\n");

  console.log("📋 PRÉSTAMOS ACTIVOS:");
  console.table(
    biblioteca.listarPrestamos(true).map((p: any) => ({
      "ID": p.id,
      "Libro ID": p.libroId,
      "Usuario ID": p.usuarioId,
      "Fecha Préstamo": new Date(p.fechaPrestamo).toLocaleDateString(),
      "Devuelto": p.isActivo() ? "No" : "Sí"
    }))
  );
  console.log("\n");

  // ===== PASO 7: DEVOLVER EL LIBRO =====
  console.log("🔄 DEVOLVIENDO LIBRO...");
  const activos = biblioteca.listarPrestamos(true);
  if (activos.length > 0) {
    const pid = activos[0].id;
    console.log(`   ID del préstamo a devolver: ${pid}`);
    const resultadoDevolucion = biblioteca.devolverLibro(pid);
    console.log(`   ${resultadoDevolucion.mensaje}`);
  }
  console.log("\n");

  // ===== PASO 8: ESTADO FINAL =====
  console.log("📊 ESTADO FINAL:");
  console.log("Estadísticas finales:", biblioteca.estadisticas());
  console.log("\n");

  console.log("📋 LIBROS FINALES:");
  console.table(
    biblioteca.listarLibros().map((l: any) => ({
      "ID": l.id,
      "Título": l.titulo,
      "Disponible": l.isDisponible() ? "✓" : "✗"
    }))
  );
  console.log("\n");

  console.log("╔════════════════════════════════════════════════════════╗");
  console.log("║                  ✓ DEMO COMPLETADA                     ║");
  console.log("╚════════════════════════════════════════════════════════╝");
  console.log("\n");
}

// ===== EJECUTAR LA DEMO =====
demo();