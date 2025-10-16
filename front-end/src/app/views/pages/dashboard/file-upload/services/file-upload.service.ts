
import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

export interface FileMetadata {
  id: number;
  filename: string;
  original_filename: string;
  mimetype: string;
  size_bytes: number;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Upload file with progress tracking
   */
  uploadFile(file: File, userId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    return this.http.post(`${this.apiUrl}/api/files`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const progress = event.total
              ? Math.round(100 * event.loaded / event.total)
              : 0;
            return { type: 'progress', progress };
          case HttpEventType.Response:
            return { type: 'complete', data: event.body };
          default:
            return { type: 'other' };
        }
      })
    );
  }

  /**
   * List files for user
   */
  listFiles(userId: string): Observable<FileMetadata[]> {
    return this.http.get<FileMetadata[]>(`${this.apiUrl}/api/files`, {
      params: { user_id: userId }
    });
  }

  /**
   * Download file
   */
  downloadFile(fileId: number, userId: string, originalFilename: string): void {
    this.http.get(`${this.apiUrl}/api/files/${fileId}`, {
      params: { user_id: userId },
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = originalFilename;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed:', err);
        throw err;
      }
    });
  }

  /**
   * Delete file
   */
  deleteFile(fileId: number, userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/files/${fileId}`, {
      params: { user_id: userId }
    });
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}