import { Component, OnInit } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-cropper',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ImageCropperComponent
  ],
  templateUrl: './cropper.component.html'
})
export class CropperComponent implements OnInit {

  showImageCropper: boolean = false;
  imageUrl: string = 'images/others/placeholder.jpg';
  // imageUrl: string = '';
  isLoadImageFailed: boolean = false;
  isNoFileChosen: boolean = false;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl  = '';
  
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.imageUrl) {
      this.showImageCropper = true;
    }
  }

  fileChangeEvent(event: Event): void {
    this.showImageCropper = false;
    const target = event.target as HTMLInputElement | null;
    if (target?.files?.length) {
      this.imageChangedEvent = event;
      this.showImageCropper = true;
      this.isLoadImageFailed = false;
      this.isNoFileChosen = false;
      this.imageUrl = '';
    } else {
      this.isNoFileChosen = true;
      this.isLoadImageFailed = false;
    }

  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || '');
    // event.blob can be used to upload the cropped image

    // Download button
    let downloadButton: HTMLElement = document.querySelector('#croppedImageDownload') as HTMLElement;
    downloadButton.setAttribute('href', event.objectUrl as string);
  }

  imageLoaded(image: LoadedImage) {
    // show cropper

  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
    this.showImageCropper = false;
    this.isLoadImageFailed = true;
    this.isNoFileChosen = false;
    console.log('Failed to load image');
  }

}
