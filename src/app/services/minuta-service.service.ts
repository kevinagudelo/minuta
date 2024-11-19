import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular'; // Importar AuthService de Auth0

@Injectable({
  providedIn: 'root'
})
export class MinutaService {

  private baseUrl = 'https://amazing-ladybug-90.hasura.app/api/rest'; // Cambia por tu URL de Hasura

  constructor(
    private http: HttpClient,
    private auth: AuthService // Inyectar AuthService para acceder al token
  ) { }

  // Método para guardar datos en Hasura
  guardarFormulario(data: any): Observable<any> {
    const url = `${this.baseUrl}/insertformulario`;

    return this.auth.idTokenClaims$.pipe(
      switchMap((claims: any | undefined) => {
        if (claims) {
          // Extraer el ID (sub) y el nombre del usuario
          const userId = claims['sub'];
          const userName = claims['name'];

          // Agregar el ID y nombre al cuerpo del formulario
          const formData = {
            ...data,
            user_id: userId,
            user_name: userName,
          };

          // Obtener el token de acceso
          return this.auth.getAccessTokenSilently().pipe(
            switchMap((token: string | undefined) => {
              if (token) {
                const headers = new HttpHeaders().set(
                  'Authorization',
                  `Bearer ${token}`
                );

                // Enviar los datos a Hasura
                return this.http.post(url, formData, { headers }).pipe(
                  catchError((error) => {
                    console.error('Error al guardar el formulario:', error);
                    return throwError(
                      () => new Error('Error al guardar el formulario.')
                    );
                  })
                );
              } else {
                console.warn('No se encontró un token de autenticación.');
                return throwError(
                  () =>
                    new Error(
                      'No se encontró un token de autenticación.'
                    )
                );
              }
            })
          );
        } else {
          console.warn('No se encontraron claims de usuario.');
          return throwError(() => new Error('No se encontraron claims de usuario.'));
        }
      }),
      catchError((error) => {
        console.error('Error al obtener claims del usuario:', error);
        return throwError(() => new Error('Error al obtener claims del usuario.'));
      })
    );
  }

   obtenerFechaActual(): string {
    const hoy = new Date(); // Fecha actual
    const año = hoy.getFullYear(); // Año actual
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0'); // Mes (se suma 1 porque los meses empiezan en 0)
    const día = hoy.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
  
    return `${año}-${mes}-${día}`;
  }

  // Método para obtener los datos desde Hasura
  obtenerFormularios(params: { limit: number, offset: number,searchText?: string; startDate?: string; endDate?: string  }): Observable<any> {
    const { limit, offset, searchText = '', startDate, endDate } = params
    
    let url = `${this.baseUrl}/getformulariosdate`;
    return this.auth.getAccessTokenSilently().pipe(
      switchMap((token: string | undefined) => {
        if (token) {
          const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
          let httpParams = new HttpParams()
            .set('limit',limit.toString())
            .set('offset', offset.toString())
            .set('startDate', startDate ? startDate : "2024-01-01")
            .set('endDate', endDate ? endDate : this.obtenerFechaActual());
            if (searchText){
             httpParams= httpParams.set('search', searchText)
               url = `${this.baseUrl}/getformularios`;

            }
    

          return this.http.get(url, { headers, params: httpParams }).pipe(
            catchError((error) => {
              console.error('Error al obtener los formularios:', error);
              return throwError(() => new Error('Error al obtener los formularios.'));
            })
          );
        } else {
          console.warn('No se encontró un token de autenticación.');
          return throwError(() => new Error('No se encontró un token de autenticación.'));
        }
      }),
      catchError((error) => {
        console.error('Error al obtener el token:', error);
        return throwError(() => new Error('Error al obtener el token de autenticación.'));
      })
    );
  }

}
