import { Component, OnInit } from '@angular/core';
interface Equipo {
  nombre: string;
  logo: string;
  pts: number;
  pj: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
  sg: number;
}

interface Grupo {
  nombre: string;
  equipos: Equipo[];
}
@Component({
  selector: 'app-cuadro-grupo',
  templateUrl: './cuadro-grupo.component.html',
  styleUrls: ['./cuadro-grupo.component.scss']
})
export class CuadroGrupoComponent implements OnInit {
  grupos: Grupo[] = [
    {
      nombre: 'Grupo A',
      equipos: [
        { nombre: 'Equipo 1', logo: 'ruta/al/logo1.png', pts: 3, pj: 1, v: 1, e: 0, d: 0, gp: 3, gc: 0, sg: 3 },
        { nombre: 'Equipo 2', logo: 'ruta/al/logo2.png', pts: 1, pj: 1, v: 0, e: 1, d: 0, gp: 1, gc: 1, sg: 0 },
        // Agregar más equipos según sea necesario
      ]
    },
    {
      nombre: 'Grupo B',
      equipos: [
        { nombre: 'Equipo 3', logo: 'ruta/al/logo3.png', pts: 3, pj: 1, v: 1, e: 0, d: 0, gp: 2, gc: 1, sg: 1 },
        { nombre: 'Equipo 4', logo: 'ruta/al/logo4.png', pts: 0, pj: 1, v: 0, e: 0, d: 1, gp: 1, gc: 2, sg: -1 },
        // Agregar más equipos según sea necesario
      ]
    },
    // Agregar más grupos según sea necesario
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
