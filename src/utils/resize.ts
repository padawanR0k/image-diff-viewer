const dataUrlToBlob = function (url: string) {
  const arr = url.split(',');
  const mime = arr[0]!.match(/:(.*?);/)![1];
  const str = atob(arr[1]);
  let length = str.length;
  const uintArr = new Uint8Array(length);
  while (length--) {
    uintArr[length] = str.charCodeAt(length);
  }
  return new Blob([uintArr], { type: mime });
};

export const resizeImage = (image: Blob, width = 0, height = 0): Promise<string | Blob | null> => {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();

    // Read the file
    reader.readAsDataURL(image);

    // Manage the `load` event
    reader.addEventListener('load', function (e) {
      // Create new image element
      const ele = new Image();
      ele.addEventListener('load', function () {
        // Create new canvas
        const canvas = document.createElement('canvas');

        // Draw the image that is scaled to `ratio`
        const context = canvas.getContext('2d');
        const w = width;
        const h = height;
        canvas.width = w;
        canvas.height = h;
        context!.drawImage(ele, 0, 0, w, h);

        // Get the data of resized image
        'toBlob' in canvas
          ? canvas.toBlob(function (blob) {
            console.log(blob)
            resolve(blob);
          })
          : (() => {
            console.log(dataUrlToBlob(canvas.toDataURL()))
            resolve(dataUrlToBlob(canvas.toDataURL()))
          })();
      });

      // Set the source
      if (typeof e.target!.result === "string") {
        ele.src = e.target!.result;
      } else {
        ele.src = '';
      }

    });

    reader.addEventListener('error', function (e) {
      reject('');
    });
  });
};


export const isDifferentSize = (img1: HTMLImageElement, img2: HTMLImageElement) => {
  return img1.naturalHeight !== img2.naturalHeight || img1.naturalWidth !== img2!.naturalWidth
}

export const getSmallSize = (img1: HTMLImageElement, img2: HTMLImageElement) => {
  const smallImage = img1.naturalWidth > img2.naturalWidth ? img2 : img1;

  console.log(img1.naturalWidth, img1.width)
  console.log(img2.naturalWidth, img2.width)
  return {
    width: smallImage.naturalWidth,
    height: smallImage.naturalHeight
  }
}
