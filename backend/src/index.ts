import type { Core } from '@strapi/strapi';

export default {
  register() { },

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Seed Member data (foto is now media type, uploaded separately via admin)
    const memberItems = [
      { nama: "EKO KURNIANTO W, S.T., M.PMat.", jabatan: "Ketua", dapil: "DAPIL 1 (Coblong, Cidadap, Bandung Wetan, Cibeunying Kaler, Cibeunying Kidul, Sumur Bandung)", komisi: "Komisi II", bio: "Jabatan DPRD: Anggota Komisi II, Anggota Badan Musyawarah, Anggota Badan Anggaran. Periode 2024-2029, Fraksi PKS, Perolehan suara: 16.185 suara." },
      { nama: "H. DENI NURSANI, S.Pd. I", jabatan: "Wakil Ketua", dapil: "DAPIL 6 (Babakan Ciparay, Bandung Kulon, Bojongloa Kidul)", komisi: "Komisi IV", bio: "Jabatan DPRD: Anggota Komisi IV, Anggota Badan Musyawarah. Periode 2024-2029, Fraksi PKS." },
      { nama: "H. ANDRI RUSMANA, S.Pd.I, M.A.P.", jabatan: "Sekretaris", dapil: "DAPIL 4 (Bandung Kidul, Buahbatu, Rancasari, Gedebage, Panyileukan, Cinambo)", komisi: "Komisi III", bio: "Jabatan DPRD: Anggota Komisi III, Anggota Badan Pembentukan Perda. Lahir di Garut, 7 Nov 1984. Periode 2024-2029, Fraksi PKS." },
      { nama: "SITI MARFUAH, SS, S.Pd, M.Pd.", jabatan: "Bendahara", dapil: "DAPIL 7 (Sukasari, Andir, Cicendo, Sukajadi)", komisi: "Komisi II", bio: "Jabatan DPRD: Wakil Ketua Komisi II, Anggota Badan Pembentukan Perda. Lahir di Karawang, 20 Juni 1976. Periode 2024-2029, Fraksi PKS." },
      { nama: "AHMAD RAHMAT PURNAMA, A.Md.", jabatan: "Anggota", dapil: "DAPIL 3 (Antapani, Arcamanik, Cibiru, Ujungberung, Mandalajati)", komisi: "Komisi I", bio: "Jabatan DPRD: Anggota Komisi I, Anggota Badan Musyawarah, Anggota Badan Anggaran. Lahir di Yogyakarta, 26 Sept 1971. Periode 2024-2029, Fraksi PKS." },
      { nama: "drg. SUSI SULASTRI", jabatan: "Anggota", dapil: "DAPIL 3 (Antapani, Arcamanik, Cibiru, Ujungberung, Mandalajati)", komisi: "Komisi IV", bio: "Jabatan DPRD: Anggota Komisi IV, Anggota Badan Pembentukan Perda. Lahir di Bandung, 20 Sept 1980. Periode 2024-2029, Fraksi PKS." },
      { nama: "ELTON AGUS MARJAN, S.E.", jabatan: "Anggota", dapil: "DAPIL 4 (Bandung Kidul, Buahbatu, Rancasari, Gedebage, Panyileukan, Cinambo)", komisi: "Komisi IV", bio: "Jabatan DPRD: Anggota Komisi IV, Wakil Ketua Badan Kehormatan. Lahir di Bandung, 25 Agus 1984. Periode 2024-2029, Fraksi PKS." },
      { nama: "H. AGUS ANDI SETYAWAN, S.Pd.I", jabatan: "Anggota", dapil: "DAPIL 3 (Antapani, Arcamanik, Cibiru, Ujungberung, Mandalajati)", komisi: "Komisi III", bio: "Jabatan DPRD: Wakil Ketua Komisi III, Anggota Badan Musyawarah, Anggota Badan Anggaran. Lahir di Bandung, 6 Juni 1972. Periode 2024-2029, Fraksi PKS." },
      { nama: "H. ASEP MULYADI, S.H.", jabatan: "Anggota", dapil: "DAPIL 3 (Antapani, Arcamanik, Cibiru, Ujungberung, Mandalajati)", komisi: "Pimpinan DPRD", bio: "Jabatan DPRD: Ketua DPRD Kota Bandung, Ketua Badan Musyawarah, Ketua Badan Anggaran. Lahir di Ciamis, 25 Juli 1971. Periode 2024-2029, Fraksi PKS." },
      { nama: "H. IMAN LESTARIYONO, S.Si, S.H.", jabatan: "Anggota", dapil: "DAPIL 1 (Coblong, Cidadap, Bandung Wetan, Cibeunying Kaler, Cibeunying Kidul, Sumur Bandung)", komisi: "Komisi IV", bio: "Jabatan DPRD: Ketua Komisi IV, Anggota Badan Musyawarah, Anggota Badan Anggaran. Lahir di Bandung, 3 Juli 1976. Periode 2024-2029, Fraksi PKS." },
      { nama: "SUSANTO TRIYOGO ADIPUTRO, S.ST., M.T.", jabatan: "Anggota", dapil: "DAPIL 7 (Sukasari, Andir, Cicendo, Sukajadi)", komisi: "Komisi I", bio: "Jabatan DPRD: Sekretaris Komisi I, Anggota Badan Anggaran. Lahir di Bandung, 1 Juli 1991. Periode 2024-2029, Fraksi PKS." },
    ];

    const currentMembers = await strapi.documents('api::member.member').findMany();
    for (const item of memberItems) {
      const existing = currentMembers.find(m => m.nama.toLowerCase().includes(item.nama.split(',')[0].toLowerCase()));
      if (existing) {
        await strapi.documents('api::member.member').update({ documentId: existing.documentId, data: item });
      } else {
        const created = await strapi.documents('api::member.member').create({ data: item });
        await strapi.documents('api::member.member').publish({ documentId: created.documentId });
      }
    }
    console.log('✓ Seeded/Updated 11 member data.');

    // Seed Article data from bandung.pks.id
    const articleItems = [
      {
        title: "Pansus 12 DPRD Kota Bandung Rampungkan Raperda Penyelenggaraan Kesejahteraan Sosial",
        content: "Panitia Khusus (Pansus) 12 DPRD Kota Bandung telah merampungkan pembahasan Rancangan Peraturan Daerah (Raperda) tentang Penyelenggaraan Kesejahteraan Sosial.\n\nSaat ini, proses regulasi tersebut memasuki tahap konsultasi ke kementerian terkait serta evaluasi di Kementerian Hukum dan HAM (Kemenkumham).\n\nAnggota Pansus 12 DPRD Kota Bandung, Susanto Triyogo Adiputro mengatakan, secara substansi pembahasan telah selesai, tinggal menunggu tahapan harmonisasi dan evaluasi sebelum ditetapkan menjadi Peraturan Daerah (Perda).\n\n\"Alhamdulillah secara pembahasan sudah selesai. Tinggal proses konsultasi ke kementerian dan selanjutnya evaluasi di Kemenkumham,\" ujarnya.\n\nMenurut Susanto Raperda ini memiliki ruang lingkup yang komprehensif, mencakup tanggung jawab dan wewenang pemerintah daerah, penyelenggaraan kesejahteraan sosial, kelembagaan LKS, pengaturan PUB, UGB, perizinan, sistem informasi, pembinaan, pengawasan, pemantauan, evaluasi hingga pembiayaan.\n\n\"Regulasi ini diharapkan mampu menciptakan tata kelola penyelenggaraan kesejahteraan sosial yang lebih tertib, transparan, dan akuntabel,\" pungkasnya.",
        excerpt: "Pansus 12 DPRD Kota Bandung telah merampungkan pembahasan Raperda tentang Penyelenggaraan Kesejahteraan Sosial.",
        publishedAt: "2026-02-25T12:10:00.000Z",
      },
      {
        title: "Raperda Kesejahteraan Sosial Kota Bandung Berubah Total, Pansus 12 Siapkan Perda Baru",
        content: "DPRD Kota Bandung melalui Panitia Khusus (Pansus) 12 tengah memfasilitasi Rancangan Peraturan Daerah (Raperda) tentang Penyelenggaraan dan Penanganan Kesejahteraan Sosial ke Pemerintah Provinsi Jawa Barat.\n\nKetua Pansus 12, Iman Lestariyono menjelaskan, awalnya pembahasan hanya difokuskan pada perubahan kedua atas Peraturan Daerah Kota Bandung Nomor 24 Tahun 2012. Namun substansi yang harus diubah ternyata mencapai lebih dari 50 persen.\n\n\"Karena perubahan sudah di atas 50 persen, maka disepakati perda lama dicabut dan diganti dengan perda yang baru. Ini bukan sekadar revisi, tetapi pembentukan regulasi baru,\" ujarnya.\n\nSaat ini, raperda tersebut masih dalam tahap fasilitasi di tingkat provinsi. Pansus 12 menargetkan dalam waktu satu bulan ke depan regulasi tersebut sudah dapat disahkan dalam rapat paripurna.",
        excerpt: "DPRD Kota Bandung melalui Pansus 12 memfasilitasi Raperda Kesejahteraan Sosial yang berubah total karena perubahan substansi melebihi 50 persen.",
        publishedAt: "2026-02-28T09:00:00.000Z",
      },
      {
        title: "DPRD Matangkan Raperda Trantibum Kota Bandung",
        content: "DPRD Kota Bandung sedang membahas Rancangan Peraturan Daerah (Raperda) tentang Penyelenggaraan Ketertiban Umum, Ketentraman, dan Perlindungan Masyarakat.\n\nAnggota Pansus 13 Andri Rusmana mengatakan, pembahasan Raperda ini sudah dilakukan bertahap dan intensif bersama sejumlah organisasi perangkat daerah (OPD).\n\n\"Saat ini kami fokus mendalami substansi materi yang terdiri atas 63 pasal dalam 18 bab,\" ujarnya, Senin (2/3/2026).\n\nPembahasan turut melibatkan Satpol PP, Dinas Sosial, Dinas Kesehatan, DPMPTSP, Dinas Perdagangan dan Industri, Disbudpar, Bagian Hukum, serta tim penyusun naskah akademik.\n\n\"Kami ingin perda ini benar-benar menjadi solusi atas persoalan ketertiban umum di Kota Bandung secara menyeluruh,\" pungkasnya.",
        excerpt: "DPRD Kota Bandung membahas Raperda Ketertiban Umum dengan 63 pasal dalam 18 bab untuk memperkuat tata kelola kota.",
        publishedAt: "2026-03-02T10:00:00.000Z",
      },
      {
        title: "Bandung Perkuat Edukasi Gaya Hidup Sehat dari Sekolah, Kampanye GGL Dimulai",
        content: "Pemerintah Kota Bandung bersama IAKMI memperkuat upaya pencegahan penyakit tidak menular dengan menggelar kampanye pola makan sehat bagi pelajar melalui gerakan Ayo Kurangi Gula, Garam dan Lemak (GGL).\n\nWali Kota Bandung, Muhammad Farhan mengatakan kampanye ini merupakan bagian dari pendekatan preventif pemerintah dalam membangun budaya hidup sehat masyarakat kota.\n\n\"Gerakan ini fokus pada anak-anak sekolah. Dari sinilah pendidikan kesehatan dimulai agar mereka tumbuh dengan kesadaran menjalani gaya hidup sehat sejak dini,\" ujar Farhan, Senin (2/3/2026).\n\nKetua DPRD Kota Bandung, Asep Mulyadi mengapresiasi langkah Pemkot Bandung yang mulai menaruh perhatian serius pada edukasi konsumsi pangan sehat bagi generasi muda.\n\n\"Apa yang kita lakukan hari ini akan berpengaruh besar dalam 20 sampai 30 tahun ke depan, terutama terhadap kualitas kesehatan masyarakat,\" kata Asep.",
        excerpt: "Pemkot Bandung bersama IAKMI menggelar kampanye Ayo Kurangi GGL bagi pelajar untuk membangun budaya hidup sehat sejak dini.",
        publishedAt: "2026-03-03T08:30:00.000Z",
      },
      {
        title: "Bandung Siapkan Grand Design Kependudukan 20 Tahun, Soroti TFR 1,83 dan Ancaman Ageing City",
        content: "Rencana Peraturan Daerah Grand Design Pembangunan Kependudukan (GDPK) kota Bandung saat ini masih tahap fasilitasi di provinsi Jawa Barat.\n\nAnggota pansus 11, Eko Kurnianto menyampaikan GDPK ini perencanaan besar pembangunan kependudukan kota Bandung 20 tahun kedepan yang fokus di bidang Kependudukan.\n\nPertama desain kependudukan, karena kota Bandung saat ini aging city. \"Kalau tingkat kelahiran rendah maka satu masa seperti negara Jepang. Hari ini TFR kota Bandung 1,83 padahal idealnya 2,\" paparnya.\n\nKedua kualitas penduduk. Ketiga ketahanan keluarga. Keempat mobilitas sebaran penduduk. Kelima adalah administrasi kependudukan.\n\n\"GDPK itu dua puluh tahun makanya yang mendesak untuk segera dijabarkan adalah peta jalan lima tahun oleh dinas-dinas sehingga visi kependudukan 20 tahun kedepan bisa tercapai,\" tutupnya.",
        excerpt: "Kota Bandung menyiapkan Grand Design Pembangunan Kependudukan 20 tahun ke depan, menyoroti TFR 1,83 dan ancaman aging city.",
        publishedAt: "2026-03-05T11:00:00.000Z",
      },
      {
        title: "Tragedi Bantargebang, Fraksi PKS DPRD Bandung Dorong Reformasi Pengelolaan Sampah",
        content: "Ketua Fraksi PKS DPRD Kota Bandung, Eko Kurnianto, menyampaikan duka cita mendalam atas peristiwa longsor sampah di TPST Bantargebang.\n\n\"Kondisi ini menunjukkan bahwa model pengelolaan sampah yang terlalu bertumpu pada penimbunan di TPA memiliki keterbatasan,\" ujar Eko, Senin (9/3/2026).\n\nFraksi PKS mendorong beberapa langkah strategis: Pertama, memperkuat kebijakan pengurangan sampah dari sumber. Kedua, mempercepat pengembangan teknologi pengolahan sampah. Ketiga, evaluasi menyeluruh terhadap sistem pengelolaan sampah. Keempat, memperkuat kolaborasi semua pihak.\n\n\"Peristiwa di Bantargebang harus menjadi pelajaran bagi semua kota, termasuk Bandung, agar transformasi sistem pengelolaan sampah dapat dilakukan lebih cepat dan lebih terarah,\" katanya.",
        excerpt: "Fraksi PKS DPRD Bandung mendorong reformasi pengelolaan sampah pasca tragedi Bantargebang.",
        publishedAt: "2026-03-09T14:00:00.000Z",
      },
      {
        title: "DPRD Nilai Setahun Kepemimpinan Farhan Erwin Belum Tunjukkan Dampak Signifikan",
        content: "Ketua DPRD Kota Bandung Asep Mulyadi menyampaikan evaluasi terhadap satu tahun kepemimpinan Wali Kota Bandung Muhammad Farhan bersama Wakil Wali Kota Erwin.\n\n\"Secara umum kami melihat ada niat baik dari pemerintah kota dalam membangun komunikasi dengan berbagai stakeholder. Namun satu tahun ini masih dalam tahap transisi, sehingga hasilnya belum terlihat secara masif di lapisan masyarakat,\" ujar Asep.\n\n\"Kami tidak ingin pembangunan hanya bersifat seremonial. Target-target makro seperti pengurangan angka pengangguran dan kemiskinan harus menjadi kompas utama,\" katanya.\n\n\"Kami akan terus mengingatkan dan menagih janji-janji politik tersebut agar benar-benar diterjemahkan menjadi kebijakan nyata yang dirasakan manfaatnya oleh warga Kota Bandung,\" ujar Asep.",
        excerpt: "DPRD menilai satu tahun kepemimpinan Farhan-Erwin masih dalam fase transisi. Dampak kebijakan belum dirasakan luas oleh masyarakat.",
        publishedAt: "2026-03-15T09:00:00.000Z",
      },
      {
        title: "Evaluasi DPRD, Belum Ada Terobosan Besar Atasi Macet, Banjir, dan Sampah di Bandung",
        content: "Ketua DPRD Kota Bandung Asep Mulyadi menilai sejumlah persoalan klasik perkotaan masih menjadi tantangan utama. Tiga isu utama: kemacetan, banjir, dan pengelolaan sampah.\n\nAsep menyebut tiga persoalan tersebut sebagai \"tiga dosa besar\" yang membayangi kualitas hidup warga Kota Bandung.\n\n\"Pemkot perlu lebih berani melakukan desentralisasi pengolahan sampah di tingkat kewilayahan, bukan hanya mengandalkan TPA,\" ujar Asep.\n\n\"Upaya memang sudah ada, tetapi belum terlihat terobosan yang bersifat game changer. Rakyat membutuhkan solusi yang terasa langsung dalam kehidupan sehari-hari,\" kata dia.\n\nDPRD juga mendorong penguatan ketahanan pangan kota melalui program urban farming yang lebih terintegrasi.",
        excerpt: "Ketua DPRD menyoroti kemacetan, banjir, dan sampah sebagai 'tiga dosa besar' Bandung yang belum tertangani tuntas.",
        publishedAt: "2026-03-18T10:30:00.000Z",
      },
      {
        title: "DPRD Soroti Efektivitas APBD di Tahun Pertama Farhan",
        content: "Ketua DPRD Kota Bandung Asep Mulyadi menyoroti efektivitas penggunaan APBD dalam satu tahun kepemimpinan Wali Kota Bandung Muhammad Farhan.\n\n\"Serapan yang tinggi tidak ada gunanya jika kualitas pekerjaannya rendah karena terburu-buru mengejar tenggat waktu,\" ujar Asep.\n\nDPRD mengingatkan agar alokasi anggaran tetap berfokus pada tiga pilar utama: pendidikan, kesehatan, dan infrastruktur dasar.\n\nPada sektor pendidikan, DPRD mendorong penambahan ruang kelas. Di sektor kesehatan, layanan rumah sakit harus dapat diakses tanpa hambatan administratif. Infrastruktur dasar seperti jalan dan fasilitas publik juga harus tetap menjadi perhatian utama.\n\nDPRD mendorong evaluasi program secara menyeluruh sehingga setiap kegiatan yang dibiayai APBD benar-benar relevan dengan kebutuhan masyarakat.",
        excerpt: "DPRD menyoroti efektivitas penggunaan APBD Kota Bandung dan mendorong fokus pada pendidikan, kesehatan, dan infrastruktur dasar.",
        publishedAt: "2026-03-22T08:00:00.000Z",
      },
      {
        title: "Ketua DPRD Bandung Dorong Tahun Kedua Farhan Jadi Tahun Akselerasi",
        content: "Ketua DPRD Kota Bandung Asep Mulyadi memberikan rekomendasi strategis kepada Wali Kota Bandung Muhammad Farhan dalam memasuki tahun kedua masa kepemimpinannya.\n\n\"Di tahun kedua ini kami merekomendasikan agar wali kota lebih fokus pada eksekusi teknis daripada sekadar wacana, sehingga program yang dirancang dapat memberikan dampak nyata bagi masyarakat,\" ujarnya.\n\nDPRD juga menekankan pentingnya memperkuat sinergi antara pemerintah kota dan lembaga legislatif dalam penyusunan kebijakan maupun penganggaran.\n\nIa menilai hambatan anggaran tidak seharusnya menjadi alasan klasik yang menghambat realisasi program pembangunan.\n\n\"Kami ingin tahun kedua ini menjadi tahun akselerasi bagi Bandung yang lebih maju dan memberikan manfaat nyata bagi masyarakat,\" kata Asep.",
        excerpt: "Ketua DPRD Bandung merekomendasikan Wali Kota Farhan fokus pada eksekusi teknis di tahun kedua kepemimpinannya.",
        publishedAt: "2026-03-27T09:30:00.000Z",
      },
    ];

    const currentArticles = await strapi.documents('api::article.article').findMany({ status: 'draft' });
    if (currentArticles.length === 0) {
      for (const item of articleItems) {
        const created = await strapi.documents('api::article.article').create({
          data: {
            title: item.title,
            content: item.content,
            excerpt: item.excerpt,
          },
        });
        await strapi.documents('api::article.article').publish({ documentId: created.documentId });
        // Update publishedAt to match original date from bandung.pks.id
        await strapi.db.query('api::article.article').updateMany({
          where: { documentId: created.documentId, publishedAt: { $ne: null } },
          data: { createdAt: new Date(item.publishedAt), publishedAt: new Date(item.publishedAt) },
        });
      }
      console.log('✓ Seeded 10 article data from bandung.pks.id.');
    }

    // Set public permissions for members and articles
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (publicRole) {
      const publicPermissions = await strapi.query('plugin::users-permissions.permission').findMany({
        where: { role: publicRole.id },
      });

      const requiredActions = [
        'api::member.member.find',
        'api::member.member.findOne',
        'api::article.article.find',
        'api::article.article.findOne',
        'api::category.category.find',
        'api::category.category.findOne',
        'api::gallery.gallery.find',
        'api::gallery.gallery.findOne',
        'api::aspiration.aspiration.create',
        'api::followup.followup.findOne',
        'api::legislative-document.legislative-document.find',
        'api::legislative-document.legislative-document.findOne',
        'plugin::upload.content-api.upload',
      ];

      for (const action of requiredActions) {
        const exists = publicPermissions.find(p => p.action === action);
        if (!exists) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action, role: publicRole.id },
          });
        }
      }
      console.log('✓ Public permissions set for all APIs.');
    }

    // --- Category Seeder ---
    const categories = ['Berita', 'Event', 'Wawancara & Opini', 'Kutipan Media', 'Berita Aspirasi', 'Pandangan Fraksi'];
    const currentCats = await strapi.documents('api::category.category').findMany();
    for (const catName of categories) {
      if (!currentCats.find(c => c.name === catName)) {
        const createdCat = await strapi.documents('api::category.category').create({ data: { name: catName } });
        await strapi.documents('api::category.category').publish({ documentId: createdCat.documentId });
      }
    }
    console.log('✓ Categories verified/seeded.');

    // --- Assign "Berita" category to uncategorized articles ---
    const allCats = await strapi.documents('api::category.category').findMany();
    const beritaCategory = allCats.find(c => c.name === 'Berita');
    if (beritaCategory) {
      const allArticles = await strapi.documents('api::article.article').findMany({
        populate: ['category'],
        limit: 100,
      });
      let assignedCount = 0;
      for (const article of allArticles) {
        if (!article.category) {
          await strapi.documents('api::article.article').update({
            documentId: article.documentId,
            data: { category: beritaCategory.documentId },
          });
          await strapi.documents('api::article.article').publish({ documentId: article.documentId });
          assignedCount++;
        }
      }
      if (assignedCount > 0) {
        console.log(`✓ Assigned "Berita" category to ${assignedCount} uncategorized articles.`);
      }
    }

  },
};

