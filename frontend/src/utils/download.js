export const forceDownload = async (url, filename) => {
  try {
    // Buka file di tab baru sesuai permintaan user
    window.open(url, '_blank');

    // Lakukan force download secara bersamaan
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Failed to force download.", error);
    // Jika fetch gagal, tab baru sudah terbuka sebagai fallback
  }
}
