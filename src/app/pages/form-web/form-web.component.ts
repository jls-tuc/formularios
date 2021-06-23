import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormWebService } from '../services/formWeb.service';
import { ValidarPersonaService } from '../services/validar.persona.service';
import { LocalidadesService } from '../services/localidades.service';
import { Localidades } from '../interface/localidades.interface';

import Swal from 'sweetalert2';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-form-web',
  templateUrl: './form-web.component.html',
  styleUrls: ['./form-web.component.css'],
})
export class FormWebComponent implements OnInit {
  public localidades: Localidades[] = [];
  datosForm: FormGroup;
  formWeb: FormGroup;
  cargar_datos = false;
  datos_per = true;
  dataPer: any;
  redSocial: boolean;

  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private localidadesService: LocalidadesService,
    private ValidarPersona: ValidarPersonaService,
    private formWebServis: FormWebService,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.buildForm();
    this.buildDataper();
  }

  ngOnInit(): void {
    this.cargarLocalidades();
  }

  onScriptLoad() {
    //  console.log('Google reCAPTCHA loaded and is ready for use!');
  }

  onScriptError() {
    //console.log('Something went long when loading the Google reCAPTCHA');
  }

  cargarLocalidades() {
    this.localidadesService.getLocalidades().subscribe((data: any) => {
      //   console.log(data);
      this.localidades = data;
      this.cdr.markForCheck();
    });
  }
  buildForm(data?) {
    this.formWeb = this.fb.group({
      fecha: [''],
      nroReg: [''],
      estado: ['sin leer'],
      nombre: [data ? data.nombres : ''],
      apellido: [data ? data.apellido : ''],
      dni: [data ? data.dni : '', Validators.required],
      nro_Tramite: [data ? data.ID_TRAMITE_PRINCIPAL : '', Validators.required],
      sexo: [data ? data.sexo : ''],
      calle: [data ? data.calle : '', Validators.required],
      numero: [data ? data.numero : '', Validators.required],
      piso: [data ? data.piso : ''],
      departamento: [data ? data.departamento : ''],
      cpostal: [data ? data.cpostal : ''],
      barrio: [],
      monoblock: [data ? data.monoblock : ''],
      localidad: [data ? data.ciudad : '', Validators.required],
      telefono: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      contactoRedSocial: ['No'],
      redesSociales: [''],
      motivo_consulta: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(400),
        ],
      ],
    });
  }

  buildDataper() {
    this.datosForm = this.fb.group({
      dni: ['', Validators.required],
      nro_Tramite: ['', Validators.required],
      sexo: ['', Validators.required],
      myRecaptcha: [''],
    });
  }

  async validarDNI() {
    if (this.datosForm.invalid) {
      return Object.values(this.datosForm.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((ctrl) =>
            ctrl.markAsTouched()
          );
        } else {
          control.markAsTouched();
        }
      });
    } else {
      let doc = this.datosForm.get('dni').value;
      let sexo = this.datosForm.get('sexo').value;
      let params = `dni=${this.datosForm.get('dni').value}&sexo=${
        this.datosForm.get('sexo').value
      }`;

      let nroTramite = this.datosForm.get('nro_Tramite').value;
      //console.log(nroTramite);
      if (doc != 0 || nroTramite != 0 || sexo != 0) {
        this.ValidarPersona.getPersonaBD(params).subscribe(
          async (data: any) => {
            //console.log(data);
            if (nroTramite === data.ID_TRAMITE_PRINCIPAL) {
              await Swal.fire({
                icon: 'success',
                title: 'Datos validados correctamente',
                text: `Puede continuar la carga ${data.apellido}  ${data.nombres} `,
              });
              //data.dni = this.formWeb.get('dni').value;
              this.dataPer = data;
              //  console.log(`dataPer`, this.dataPer);
              this.buildForm(this.dataPer);
              this.datos_per = false;
              this.cargar_datos = true;
              this.cdr.markForCheck();
            } else {
              await Swal.fire({
                icon: 'warning',
                title: 'Los datos ingresados no son validos',
                text: `Por favor verifique los datos ingresados.Gracias.`,
              });

              this.cdr.markForCheck();
            }
          }
        );
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Debe completar los campos requeridos',
          text: `Por favor complete los campos.Gracias.`,
        });

        this.cdr.markForCheck();
      }
    }
  }

  guardar() {
    console.log(this.formWeb);
    if (this.formWeb.invalid) {
      return Object.values(this.formWeb.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach((ctrl) =>
            ctrl.markAsTouched()
          );
        } else {
          control.markAsTouched();
        }
      });
    } else {
      //Este cogigo es para geo!!!!!
      /* this.formWeb.patchValue({
          direccion: `${this.formWeb.get('numero').value} ${
            this.formWeb.get('calle').value
          } ${this.formWeb.get('localidad').value} Neuquen`,
        }); */
      console.log(this.formWeb.value);
      const datos = this.formWeb.value;

      this.formWebServis.crearForm(datos).subscribe(async (data: any) => {
        if (data.ok === true) {
          await Swal.fire(
            'Su consulta fue cargada correctamente',
            'Un representante de la Sub Secretaria, se estará comunicando a la brevedad.',
            'success'
          );
          await this.formWeb.reset();
          this.document.location.href = 'https://ciudadanianqn.gob.ar/portal';
        } else {
          Swal.fire('Verificar la conexion', '', 'error');
        }
      });
    }
  }

  ////// VALIDACIONES DE LOS FORM!!

  /////persona

  get documentoNoValido() {
    return (
      this.datosForm.get('dni').invalid && this.datosForm.get('dni').touched
    );
  }
  get nroTramiteNoValido() {
    return (
      this.datosForm.get('nro_Tramite').invalid &&
      this.datosForm.get('nro_Tramite').touched
    );
  }
  get sexoNoValido() {
    return (
      this.datosForm.get('sexo').invalid && this.datosForm.get('sexo').touched
    );
  }
  ////datos de seguimiento

  get celularNoValido() {
    return (
      this.formWeb.get('telefono').invalid &&
      this.formWeb.get('telefono').touched
    );
  }
  get emailNoValido() {
    return (
      this.formWeb.get('email').invalid && this.formWeb.get('email').touched
    );
  }

  get localidadNoValido() {
    return (
      this.formWeb.get('localidad').invalid &&
      this.formWeb.get('localidad').touched
    );
  }
  get calleNoValido() {
    return (
      this.formWeb.get('calle').invalid && this.formWeb.get('calle').touched
    );
  }
  get numeroNoValido() {
    return (
      this.formWeb.get('numero').invalid && this.formWeb.get('numero').touched
    );
  }
  ////redes sociales
  get contactoRedSocialNoValido() {
    return (
      this.formWeb.get('contactoRedSocial').invalid &&
      this.formWeb.get('contactoRedSocial').touched
    );
  }
  get redesSocialesNoValido() {
    return (
      this.formWeb.get('redesSociales').invalid &&
      this.formWeb.get('redesSociales').touched
    );
  }

  ///// Datos Complementarios
  get motivoNoValido() {
    return (
      this.formWeb.get('motivo_consulta').touched &&
      this.formWeb.get('motivo_consulta').invalid
    );
  }

  //activar Red Social
  activarRedSocial() {
    if (this.formWeb.get('contactoRedSocial').value === 'Si') {
      this.redSocial = true;
    } else {
      this.redSocial = false;
    }
  }
}
