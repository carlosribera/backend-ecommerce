export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callBack: Function ) => {
  // console.log({ file })
  if (!file) return callBack( new Error('File is empty'), false)

  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png'];

  if( validExtension.includes(fileExtension)) {
    return callBack( null, true)
  }

  callBack( null, false )
}