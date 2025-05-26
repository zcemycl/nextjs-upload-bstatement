function fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data URL prefix (data:application/pdf;base64,)
        const base64 = (reader.result! as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  export {fileToBase64};