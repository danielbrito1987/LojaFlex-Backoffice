import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FamiliaModel } from 'src/app/shared/models/familia.model';
import { FamiliaService } from 'src/app/shared/services/familia.service';

@Component({
  selector: 'app-familia',
  templateUrl: './familia.component.html',
  styleUrls: ['./familia.component.css']
})
export class FamiliaComponent implements OnInit {
  isLoading: boolean = false;
  familias: FamiliaModel[] = [];
  selectedFamilia: FamiliaModel | null = null;
  isEditing: boolean = false;
  filterNome: string = "";
  familiaForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private familiaService: FamiliaService,
    private fb: FormBuilder
  ) {
    this.familiaForm = this.fb.group({
      idFamilia: [''],
      dscFamilia: ['', [Validators.required, Validators.maxLength(150)]]
    })
  }

  ngOnInit(): void {
    this.loadFamilias();
  }
  
  loadFamilias() {
    this.isLoading = true;

    this.familiaService.getAll().subscribe((data) => {
      this.familias = data.filter(pais => 
        pais.dscFamilia?.toLowerCase().includes(this.filterNome.toLowerCase())
      );

      this.isLoading = false;
    })
  }

  openModal(familia?: FamiliaModel) {
    if (familia) {
      this.selectedFamilia = familia;
      this.isEditing = true;
      this.familiaForm.patchValue(familia);
    } else {
      this.isEditing = false;
      this.familiaForm.reset();
    }

    const modalElement = document.getElementById('modalFamilia');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("Modal não foi encontrado");
    }
  }

  closeModal() {
    const modalElement = document.getElementById('modalFamilia');

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

  saveFamilia() {
    Object.keys(this.familiaForm.controls).forEach(control => {
      this.familiaForm.get(control)?.markAsTouched();
    });

    if (this.familiaForm.valid) {
      this.isLoading = true;

      if(this.isEditing) {
        this.familiaService.update(this.familiaForm.value).subscribe(() => {
          this.toastr.success('Família alterada com sucesso!');
          this.loadFamilias();
        }, (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        });
      } else {
        this.familiaService.create(this.familiaForm.value).subscribe(() => {
          this.toastr.success('Família cadastrada com sucesso!');
          this.loadFamilias();
        }, (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        });
      }

      this.closeModal();
    }
  }

  confirmDelete(familia: FamiliaModel) {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta família?');
    if (confirmDelete) {
      this.isLoading = true;

      this.familiaService.delete(familia.idFamilia).subscribe(() => {
        this.toastr.success('Família excluída com sucesso!');
        this.loadFamilias();
      }, (error) => {
        this.isLoading = false;
        this.toastr.error(error);
      });
    }
  }
}
