const fs = require('fs');
const path = require('path');
const os = require('os');

const perdaToMigrate = [
  { id: 1, title: "Peraturan Daerah Nomor 1 Tahun 2025", year: 2025, desc: "Pajak Daerah dan Retribusi Daerah", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2014" },
  { id: 2, title: "Peraturan Daerah Nomor 5 Tahun 2024", year: 2024, desc: "Rencana Pembangunan Jangka Panjang Daerah", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2013" },
  { id: 3, title: "Peraturan Daerah Nomor 4 Tahun 2024", year: 2024, desc: "Perubahan Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2024", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2012" },
  { id: 4, title: "Peraturan Daerah Nomor 3 Tahun 2024", year: 2024, desc: "Pertanggungjawaban Pelaksanaan Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2023", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2011" },
  { id: 5, title: "Peraturan Daerah Nomor 2 Tahun 2024", year: 2024, desc: "Bangunan Gedung", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2010" },
  { id: 6, title: "Peraturan Daerah Nomor 1 Tahun 2024", year: 2024, desc: "Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2024", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2009" },
  { id: 7, title: "Peraturan Daerah Nomor 7 Tahun 2023", year: 2023, desc: "Pajak Daerah dan Retribusi Daerah", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2006" },
  { id: 8, title: "Peraturan Daerah Nomor 6 Tahun 2023", year: 2023, desc: "Perubahan Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2023", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2005" },
  { id: 9, title: "Peraturan Daerah Nomor 5 Tahun 2023", year: 2023, desc: "Pertanggungjawaban Pelaksanaan Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2022", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2004" },
  { id: 10, title: "Peraturan Daerah Nomor 4 Tahun 2023", year: 2023, desc: "Ketertiban Umum, Ketentraman dan Perlindungan Masyarakat", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2003" },
  { id: 11, title: "Peraturan Daerah Nomor 3 Tahun 2023", year: 2023, desc: "Perubahan Atas Perda No 13 Th 2018 (Tambahan Penghasilan PNS)", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2002" },
  { id: 12, title: "Peraturan Daerah Nomor 2 Tahun 2023", year: 2023, desc: "Anggaran Pendapatan dan Belanja Daerah Tahun Anggaran 2023", url: "https://jdih.dprd.bandung.go.id/dokumen/download/2001" },
];

async function migrate() {
  console.log('🚀 Starting Perda migration...');
  
  const currentPerdas = await strapi.documents('api::legislative-document.legislative-document').findMany({
    filters: { type: 'Perda' },
    limit: 100
  });

  for (const item of perdaToMigrate) {
    if (currentPerdas.find(p => p.title === item.title)) {
      console.log(`⏩ Skipping: ${item.title}`);
      continue;
    }

    console.log(`⏳ Migrating: ${item.title}...`);
    let tmpPath = '';
    try {
      const response = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${item.title.replace(/\s+/g, '_')}.pdf`;
      tmpPath = path.join(os.tmpdir(), fileName);
      fs.writeFileSync(tmpPath, buffer);

      const stat = fs.statSync(tmpPath);
      const uploadedFiles = await strapi.plugin('upload').service('upload').upload({
        data: {},
        files: {
          filepath: tmpPath,
          originalFilename: fileName,
          mimetype: 'application/pdf',
          size: stat.size,
        },
      });

      if (uploadedFiles && uploadedFiles.length > 0) {
        const created = await strapi.documents('api::legislative-document.legislative-document').create({
          data: {
            title: item.title,
            description: item.desc,
            year: item.year,
            type: 'Perda',
            publish_date: new Date(item.year, 0, 1),
            status: 'Berlaku',
            file: uploadedFiles[0].id
          }
        });
        await strapi.documents('api::legislative-document.legislative-document').publish({ documentId: created.documentId });
        console.log(`✅ Success: ${item.title}`);
      }
    } catch (error) {
      console.error(`❌ Failed ${item.title}:`, error.message);
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  }
  console.log('✨ Finished.');
}

module.exports = migrate;
