import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from './componets/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { MinutaService } from './services/minuta-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'minuta';
  formularios: any[] = [];
  displayedColumns: string[] = ['id', 'fecha', 'hora', 'asunto', 'detalle', 'guardia', 'acciones'];
  totalFormularios: number = 0;
  filteredFormularios: any[] = [];
  pageSize: number = 50;
  currentPage: number = 0;
  filtros: any = {};
  searchText: string = '';
  startDate: string = ''; // Fecha de inicio
  endDate: string = '';   // Fecha de fin
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  readonly dialog = inject(MatDialog)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Método para verificar si el usuario está autenticado
  isAuthenticated$ = this.auth.isAuthenticated$
  isAuthenticated = false
  userName:any
  constructor(private formularioService: MinutaService,
    private auth: AuthService
  ) {

  }

  ngOnInit() {
    // Verifica si el usuario está autenticado
    this.auth.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    this.cargarFormularios()

    });

    // Obtén el nombre del usuario desde los claims
    this.auth.idTokenClaims$.subscribe((claims) => {
      if (claims) {
        this.userName = claims['name']; // El nombre del usuario está en el claim "name"
      }
    });
  }
  
  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(500), // Espera 500 ms después del último cambio
        distinctUntilChanged() // Solo emite si el valor cambió realmente
      )
      .subscribe(() => {
        this.buscarFormulario(); // Llama a la función de búsqueda
      });
  }
  loginWithRedirect(): void {
    this.auth.loginWithRedirect();
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin } // Redirige a la página principal
    });
  }



  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.cargarFormularios()
    });
  }

  cargarFormularios(event?: any): void {
    if (event) {
      this.currentPage = event.pageIndex;  // Página actual
      this.pageSize = event.pageSize;      // Tamaño de la página
    }
    console.log(this.startDate.toString().split('T')[0])
    console.log(this.searchText)
    this.formularioService
      .obtenerFormularios({
        limit: this.pageSize,
        offset: this.currentPage * this.pageSize,
        searchText: this.searchText,  // Filtro de texto
        startDate: this.startDate ? this.convertirFecha(this.startDate) : this.startDate,    // Filtro de fecha de inicio
        endDate: this.endDate ?this.convertirFecha(this.endDate): this.endDate,        // Filtro de fecha de fin
      })
      .subscribe({
        next: (response) => {
          this.formularios = response.formulario;
          console.log(this.formularios)
          this.totalFormularios = response.formulario_aggregate.aggregate.count;
        },
        error: (error) => {
          console.log('Error al cargar los datos:', error);
        },
      });
  }

  buscarFormulario(): void {
    this.searchText =(this.searchInput.nativeElement.value)
    this.cargarFormularios();
  }

  // Método para actualizar el filtro por fecha
  buscarPorFecha(): void {
    this.cargarFormularios();
  }

  convertirFecha(dateInput:any, diasSumar = 0) {
    // Crear un objeto Date con la entrada
    const fecha = new Date(dateInput);
  
    // Sumar o restar días si se indica
    fecha.setDate(fecha.getDate() + diasSumar);
  
    // Obtener las partes de la fecha
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11, se suma 1
    const day = String(fecha.getDate()).padStart(2, '0');
  
    // Retornar en formato YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }
}

