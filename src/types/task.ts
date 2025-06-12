export interface Task {
  _id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  estado: 'pendiente' | 'completada';
}
