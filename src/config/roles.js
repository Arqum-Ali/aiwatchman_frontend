export const ROLES = {
  ADMIN: "admin",
  OWNER: "owner",
  VIEWER: "viewer",
};

// define which pages are allowed for each role
export const rolePages = {
  admin: ["/", "/users", "/upload_image"],
  owner: ["/", "/known-faces", "/camera"],
  viewer: ["/", "/UnknownFaces"],
};
