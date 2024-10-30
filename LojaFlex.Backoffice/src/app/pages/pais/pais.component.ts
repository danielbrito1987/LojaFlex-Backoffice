import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PaisModel } from 'src/app/shared/models/pais.model';
import { PaisService } from 'src/app/shared/services/pais.service';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})
export class PaisComponent implements OnInit {
  isLoading: boolean = false;
  paises: PaisModel[] = [];
  paisForm: FormGroup;
  selectedPais: PaisModel | null = null;
  isEditing: boolean = false;
  filterNome: string = "";

  constructor(
    private toastr: ToastrService,
    private paisService: PaisService,
    private fb: FormBuilder
  ) {
    this.paisForm = this.fb.group({
      idPais: [''],
      dscPais: ['', [Validators.required, Validators.maxLength(100)]],
      sigla: ['', [Validators.required, Validators.maxLength(5)]]
    })
  }

  ngOnInit(): void {
    this.loadPaises();
  }

  loadPaises() {
    this.isLoading = true;

    this.paisService.getAll().subscribe((data) => {
      this.paises = data.filter(pais => 
        pais.dscPais?.toLowerCase().includes(this.filterNome.toLowerCase())
      );

      this.isLoading = false;
    })
  }

  openModal(pais?: PaisModel) {
    if (pais) {
      this.selectedPais = pais;
      this.isEditing = true;
      this.paisForm.patchValue(pais);
    } else {
      this.isEditing = false;
      this.paisForm.reset();
    }

    const modalElement = document.getElementById('modalPais');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("Modal não foi encontrado");
    }
  }

  closeModal() {
    const modalElement = document.getElementById('modalPais');

    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        console.error('Modal instance not found');
      }
    } else {
      console.error('Modal element not found');
    }
  }

  savePais() {
    Object.keys(this.paisForm.controls).forEach(control => {
      this.paisForm.get(control)?.markAsTouched();
    });

    if (this.paisForm.valid) {
      this.isLoading = true;

      if(this.isEditing) {
        this.paisService.update(this.paisForm.value).subscribe(() => {
          this.toastr.success('País alterado com sucesso!');
          this.loadPaises();
        }, (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        });
      } else {
        this.paisService.create(this.paisForm.value).subscribe(() => {
          this.toastr.success('País cadastrado com sucesso!');
          this.loadPaises();
        }, (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        });
      }

      this.closeModal();
    }
  }

  confirmDelete(pais: PaisModel) {
    const confirmDelete = confirm('Tem certeza que deseja excluir este país?');
    if (confirmDelete) {
      this.isLoading = true;

      this.paisService.delete(pais.idPais).subscribe(() => {
        this.toastr.success('País excluído com sucesso!');
        this.loadPaises();
      }, (error) => {
        this.isLoading = false;
        this.toastr.error(error);
      });
    }
  }

  changeSigla() {
    const siglaControl = this.paisForm.get('sigla');
    const valorAtual = siglaControl?.value || '';
    siglaControl?.setValue(valorAtual.toUpperCase(), { emitEvent: false });
  }
}
