# Upload Module

## Features

- ✅ **Dual Mode**: Cloudinary (cloud) hoặc Local Storage
- ✅ **File Types**: CV (PDF), Images (Avatar, Logo, Cover)
- ✅ **Validation**: File type, size limit
- ✅ **Auto Update**: Tự động cập nhật database
- ✅ **Image Optimization**: Auto resize, compress với Cloudinary

## APIs

### Upload CV

```http
POST /api/upload/cv
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  file: [PDF file, max 10MB]

Response:
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "hrm-app/cvs/...",
  "message": "CV uploaded successfully"
}
```

### Upload Avatar

```http
POST /api/upload/avatar
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  file: [Image file (jpg, png), max 5MB]

Response:
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "hrm-app/avatars/...",
  "message": "Avatar uploaded successfully"
}
```

### Upload Company Logo

```http
POST /api/upload/company-logo
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  file: [Image file (jpg, png), max 5MB]

Response:
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "hrm-app/logos/...",
  "message": "Company logo uploaded successfully"
}
```

### Upload Company Cover

```http
POST /api/upload/company-cover
Headers: Authorization: Bearer {token}
Body: multipart/form-data
  file: [Image file (jpg, png), max 10MB]

Response:
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "hrm-app/covers/...",
  "message": "Company cover uploaded successfully"
}
```

### Delete File

```http
DELETE /api/upload/:publicId
Headers: Authorization: Bearer {token}

Response:
{
  "message": "File deleted successfully"
}
```

## Configuration

### Option 1: Cloudinary (Recommended for Production)

Add to `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get credentials from: https://cloudinary.com

### Option 2: Local Storage (Development)

**No configuration needed!** Files will be stored in `/uploads` folder automatically.

Access files: `http://localhost:5000/uploads/{folder}/{filename}`

## File Limits

| Type   | Allowed Formats | Max Size |
| ------ | --------------- | -------- |
| CV     | PDF             | 10 MB    |
| Avatar | JPG, PNG        | 5 MB     |
| Logo   | JPG, PNG        | 5 MB     |
| Cover  | JPG, PNG        | 10 MB    |

## Image Transformations (Cloudinary)

### Avatar

- Size: 300x300px
- Crop: Fill with face detection
- Quality: Auto

### Logo

- Size: 500x500px
- Crop: Fit
- Quality: Auto

### Cover

- Size: 1920x600px
- Crop: Fill
- Quality: Auto

## Testing with Postman/Thunder Client

1. **Get token** from login
2. **Create new request**:
   - Method: POST
   - URL: `http://localhost:5000/api/upload/avatar`
   - Headers: `Authorization: Bearer {your_token}`
   - Body: form-data
     - Key: `file` (type: File)
     - Value: Select image file

## Frontend Integration Example

```typescript
// React/Vue/Angular
const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:5000/api/upload/avatar', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  console.log('Uploaded:', data.url);
};
```

## Database Updates

Uploads automatically update:

- CV → `Resume.cvFileUrl`
- Avatar → `User.avatar`
- Logo → `Company.logo`
- Cover → `Company.coverImage`
