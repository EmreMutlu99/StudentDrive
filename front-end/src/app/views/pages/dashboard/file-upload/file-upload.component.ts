import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService, FileMetadata } from './services/file-upload.service';
import { AuthService, CurrentUser } from '../../../../core/services/auth.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  files: FileMetadata[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isDragOver: boolean = false;

  // Mock user ID for testing (replace with real auth in production)
  userId: string = 'test-user-123';

  // File validation
  maxFileSize = 10 * 1024 * 1024; // 10MB
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

  constructor(private fileUploadService: FileUploadService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.ensureSession().subscribe();
    this.auth.user$
    .pipe(filter(Boolean), take(1))
    .subscribe(user => {
      this.userId = user.id;
      console.log('userId:', this.userId);
      this.loadFiles();
      // use it here...
    });

    
    
  }

  /**
   * Load files for current user
   */
  loadFiles(): void {
    this.fileUploadService.listFiles(this.userId).subscribe({
      next: (files) => {
        this.files = files;
      },
      error: (err) => {
        this.showError('Failed to load files');
        console.error(err);
      }
    });
  }

  /**
   * Handle file selection from input
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectFile(input.files[0]);
    }
  }

  /**
   * Handle drag over
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  /**
   * Handle drag leave
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  /**
   * Handle file drop
   */
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.selectFile(event.dataTransfer.files[0]);
    }
  }

  /**
   * Select and validate file
   */
  selectFile(file: File): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.showError('Invalid file type. Only PDF, JPEG, and PNG are allowed');
      return;
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      this.showError('File size exceeds 10MB limit');
      return;
    }

    this.selectedFile = file;
  }

  /**
   * Upload selected file
   */
  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.errorMessage = '';
    this.successMessage = '';

    this.fileUploadService.uploadFile(this.selectedFile, this.userId).subscribe({
      next: (event) => {
        if (event.type === 'progress') {
          this.uploadProgress = event.progress;
        } else if (event.type === 'complete') {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.selectedFile = null;
          this.showSuccess('File uploaded successfully');
          this.loadFiles();
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadProgress = 0;
        const errorMsg = err.error?.error || 'Upload failed';
        this.showError(errorMsg);
        console.error(err);
      }
    });
  }

  /**
   * Download file
   */
  downloadFile(file: FileMetadata): void {
    try {
      this.fileUploadService.downloadFile(file.id, this.userId, file.original_filename);
    } catch (err) {
      this.showError('Download failed');
      console.error(err);
    }
  }

  /**
   * Delete file with confirmation
   */
  deleteFile(file: FileMetadata): void {
    if (!confirm(`Are you sure you want to delete ${file.original_filename}?`)) {
      return;
    }

    this.fileUploadService.deleteFile(file.id, this.userId).subscribe({
      next: () => {
        this.showSuccess('File deleted successfully');
        this.loadFiles();
      },
      error: (err) => {
        const errorMsg = err.error?.error || 'Delete failed';
        this.showError(errorMsg);
        console.error(err);
      }
    });
  }

  /**
   * Format file size
   */
  formatSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
  }

  /**
   * Show success message
   */
  private showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}