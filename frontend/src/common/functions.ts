export function downloadBase64Image(base64Data: string, fileName?: string) {
  const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

  try {
    const byteCharacters = atob(cleanBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'image/png' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || 'QR.png';
    link.click();
  } catch (error) {
    console.error('Failed to decode base64 string', error);
  }
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export const getLocation = (): Promise<{ lat: string; lon: string }> =>
  new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const lon = position.coords.longitude.toString();
          resolve({ lat, lon });
        },
        (error) => {
          reject('Error getting location');
        },
      );
    } else {
      reject('Geolocation is not supported by this browser');
    }
  });

export function downloadFile(blobData: Blob, fileName?: string) {
  const blob = new Blob([blobData], { type: 'application/pdf' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName || 'report.pdf';

  link.click();

  URL.revokeObjectURL(link.href);
}
