import { ProfileImageProps } from "../../types";

export const getProfileImage = (file:ProfileImageProps) => {
  if(file && typeof file === 'string') return file;
  if(file && typeof file === 'object') return file.uri;

  return "/defaultAvatar.png";

}