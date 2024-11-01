import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EspecieModel } from 'src/app/shared/models/especie.model';
import { EspecieService } from 'src/app/shared/services/especie.service';

@Component({
  selector: 'app-especie',
  templateUrl: './especie.component.html',
  styleUrls: ['./especie.component.css']
})
export class EspecieComponent implements OnInit {
  isLoading: boolean = false;
  especies: EspecieModel[] = [];
  selectedEspecie: EspecieModel | null = null;
  isEditing: boolean = false;
  filterNome: string = "";
  especieForm: FormGroup;

  constructor(
    private especieService: EspecieService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.especieForm = this.fb.group({
      idEspecie: [''],
      dscEspecie: ['', [Validators.required, Validators.maxLength(150)]]
    })
  }

  ngOnInit(): void {
  }

  loadEspecies() {
    this.isLoading = true;

    this.especieService.getAll().subscribe((data) => {
      this.especies = data.filter(especie => 
        especie.dscEspecie?.toLowerCase().includes(this.filterNome.toLowerCase())
      );

      this.isLoading = false;
    })
  }

  openModal(especie?: EspecieModel) {
    if (especie) {
      this.selectedEspecie = especie;
      this.isEditing = true;
      this.especieForm.patchValue(especie);
    } else {
      this.isEditing = false;
      this.especieForm.reset();
    }

    const modalElement = document.getElementById('modalEspecie');

    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("Modal não foi encontrado");
    }
  }

  closeModal() {
    const modalElement = document.getElementById('modalEspecie');

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

  saveEspecie() {
    Object.keys(this.especieForm.controls).forEach(control => {
      this.especieForm.get(control)?.markAsTouched();
    });

    if (this.especieForm.valid) {
      this.isLoading = true;

      if(this.isEditing) {
        this.especieService.update(this.especieForm.value).subscribe(() => {
          this.toastr.success('Espécie alterada com sucesso!');
          this.loadEspecies();
        }, (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        });
      } else {
        this.especieService.create(this.especieForm.value).subscribe(() => {
          this.toastr.success('Espécie cadastrada com sucesso!');
          this.loadEspecies();
        }, (error) => {
          this.isLoading = false;
          this.toastr.error(error);
        });
      }

      this.closeModal();
    }
  }

  confirmDelete(especie: EspecieModel) {
    const confirmDelete = confirm('Tem certeza que deseja excluir esta espécie?');
    if (confirmDelete) {
      this.isLoading = true;

      this.especieService.delete(especie.idEspecie).subscribe(() => {
        this.toastr.success('Espécie excluída com sucesso!');
        this.loadEspecies();
      }, (error) => {
        this.isLoading = false;
        this.toastr.error(error);
      });
    }
  }
}
