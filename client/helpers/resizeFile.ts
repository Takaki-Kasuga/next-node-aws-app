import Resizer from 'react-image-file-resizer';
export const resizeFile = (image: any) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      720,
      540,
      'JPEG',
      100,
      0,
      (uri) => {
        console.log('uri', uri);
        resolve(uri);
      },
      'file'
    );
  });
};
