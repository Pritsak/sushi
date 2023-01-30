import { Injectable } from '@angular/core';
import { getDownloadURL, percentage, ref, uploadBytesResumable, Storage, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private storage: Storage) { }

  public uploadPercent = 0

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`
    let url = ''
    if (file) {
      try {
        const storageRef = ref(this.storage, path)
        const task = uploadBytesResumable(storageRef, file)
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress
        })
        await task;
        url = await getDownloadURL(storageRef)
      }
      catch (e: any) {
        console.error(e)
      }
    } else {
      console.log('Wrong format')
    }
    return Promise.resolve(url)
  }

  async deleteUploadFile(imagePath: string): Promise<void> {
    const task = ref(this.storage, imagePath)
    return deleteObject(task)
  }
}
