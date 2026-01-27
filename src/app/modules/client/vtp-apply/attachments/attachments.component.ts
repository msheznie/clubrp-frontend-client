import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

/** Static required documents list for VTP apply (same as admin copy). */
const REQUIRED_DOCUMENTS = [
  { display_name: 'License', is_mandatory: true },
  { display_name: 'Medical', is_mandatory: true },
  { display_name: 'Photo', is_mandatory: false }
];

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class AttachmentsComponent implements OnInit {
  attachmentsForm: FormGroup;
  requiredDocuments = REQUIRED_DOCUMENTS;
  isDragOver = false;
  isProcessingFiles = false;

  constructor(private fb: FormBuilder) {
    this.attachmentsForm = this.fb.group({
      attachments: [[]],
      status: ['pending']
    });
  }

  ngOnInit(): void {
    if (!this.attachmentsForm.get('attachments')?.value) {
      this.attachmentsForm.patchValue({ attachments: [] });
    }
  }

  get attachments(): any[] {
    return this.attachmentsForm.get('attachments')?.value || [];
  }

  /** Returns attachment array in payload shape for parent (vtp-apply) to send. */
  getAttachments(): any[] {
    return this.attachments;
  }

  isFormValid(): boolean {
    return this.attachments.length > 0;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    if (!fileType) return 'attach_file';
    const t = fileType.toLowerCase();
    if (t.includes('pdf')) return 'picture_as_pdf';
    if (t.includes('word') || t.includes('document')) return 'description';
    if (t.includes('excel') || t.includes('spreadsheet')) return 'table_chart';
    if (t.includes('image') || t.includes('jpeg') || t.includes('png') || t.includes('gif')) return 'image';
    if (t.includes('text')) return 'text_snippet';
    return 'attach_file';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFiles(Array.from(input.files));
      input.value = '';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    if (event.dataTransfer?.files?.length) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  private processFiles(files: File[]): void {
    this.isProcessingFiles = true;
    const currentAttachments = this.attachments;
    const errors: string[] = [];
    const newAttachments: any[] = [];

    files.forEach((file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name} has an unsupported file type.`);
        return;
      }
      const isDuplicate = currentAttachments.some((att: any) => att.file_name === file.name);
      if (isDuplicate) {
        errors.push(`${file.name} is already uploaded.`);
        return;
      }
      newAttachments.push({
        document_type: 'ATTACHMENT',
        file_type: file.type || '',
        file_size: file.size,
        file_name: file.name,
        attachment: file,
        attachment_type: null,
        expire_on: null,
        id: null,
        vtp_attachment_id: null
      });
    });

    if (errors.length > 0) {
      console.warn('Attachment validation:', errors.join(' '));
      // Optionally use a snackbar if HelperService is injected
    }

    if (newAttachments.length > 0) {
      this.attachmentsForm.patchValue({
        attachments: [...currentAttachments, ...newAttachments]
      });
    }

    this.isProcessingFiles = false;
  }

  removeAttachment(index: number): void {
    const current = this.attachments;
    current.splice(index, 1);
    this.attachmentsForm.patchValue({ attachments: [...current] });
  }

  clearAllAttachments(): void {
    this.attachmentsForm.patchValue({ attachments: [] });
  }

  previewFile(attachment: any): void {
    const file = attachment.attachment;
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  downloadFile(attachment: any): void {
    const file = attachment.attachment;
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.file_name || file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
