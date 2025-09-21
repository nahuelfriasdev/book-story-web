export const getProfileImage = (file:any) => {
  if(file && typeof file === 'string') return file;
  if(file && typeof file === 'object') return file.uri;

  return "/defaultAvatar.png";

}