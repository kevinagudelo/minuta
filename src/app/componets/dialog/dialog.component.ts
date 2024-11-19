import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


import {

  MatDialogRef,
} from '@angular/material/dialog';
import { MinutaService } from 'src/app/services/minuta-service.service';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.less']
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
  formulario!: FormGroup  ;

  constructor(private fb: FormBuilder,
    private formularioServices : MinutaService
  ) {}

  ngOnInit() {
    // Inicializar el formulario con valores por defecto
    this.formulario = this.fb.group({
      fecha: [new Date()], // Fecha actual
      hora: [this.getHoraActual()], // Hora actual
      asunto: [''], // Vacío por defecto
      detalle: [''] // Vacío por defecto
    });
  }

  // Método para obtener la hora actual en formato 'HH:mm'
  getHoraActual(): string {
    const now = new Date();
    const horas = now.getHours().toString().padStart(2, '0');
    const minutos = now.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  enviarFormulario() {
    console.log('Datos del formulario:', this.formulario.value);
    const { fecha, hora, asunto, detalle } = this.formulario.value;

    const data = {
      fecha: fecha.toISOString().split('T')[0], // Formatear fecha como YYYY-MM-DD
      hora: hora,
      asunto: asunto,
      detalle: detalle,
    };

     this.formularioServices.guardarFormulario(data).subscribe({
      next: (response) => {
        console.log('Formulario guardado:', response);
        this.closeDialog()
        //this.cargarFormularios(); // Recargar la lista de formularios
      },
      error: (error) => {
        console.log('Error al guardar el formulario:', error);
      },
    });

  }
  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();  // Cierra el diálogo desde el componente principal
    }
  }
}
