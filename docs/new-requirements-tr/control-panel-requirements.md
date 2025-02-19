# 1. Kullanıcı Yönetimi

  1.1 Tüm Kullanıcı İçeriğini Görüntüleme ve Düzenleme
  - Kayıtlı kullanıcılara (site üyeleri) ait tüm bilgileri görüntüleme, düzenleme ve silme yeteneği.
  - Kullanıcı hesapları üzerinde tam yönetim hakları (kişisel bilgiler, roller, izinler, durum).

# 2. Bilet/Otel Yönetimi

  2.1 İşlem Arama
  - Günlük, haftalık veya aylık işlemleri (otobüs/uçak biletleri ve otel rezervasyonları) arama ve görüntüleme yeteneği.

  2.2 Faturalandırma
  - Müşterilerden gelen, bilet/otel satışlarına ilişkin tüm fatura taleplerini görüntüleme.
    - butun biletlerde fatura zorunlu
    - yurt disina fatura kesilebilir
    - **kimlikle yurt disi seyahetleri icin Biletall destek e sorulacak**
  - Fatura kesilip sisteme yüklendiğinde, fatura eki veya indirme linkiyle birlikte otomatik e-posta gönderilmesi.  
    - parasut ile entegrasyon (API) **GORUSULECEK**

  2.3 İade Yönetimi
  - Müşterilerin site üzerinden başlattığı tüm iade taleplerini görüntüleme.
  - İade işlemlerinin (bakiye transferi) sonuçlarını ve durumlarını (örn. bekliyor, onaylandı, tamamlandı) görüntüleme.

# 3. Komisyon Yönetimi (Yalnızca Uçak Biletleri İçin)

  3.1 Havayolu Bazlı Komisyon Ayarları
  - Komisyon sadece uçak biletlerine uygulanır (otobüs veya otel için geçerli değildir).
  - Komisyon oranları şunlara bağlıdır:
    - Havayolu (örneğin, Havayolu A, Havayolu B vb.)
    - Bilet Fiyat Aralıkları (örneğin, 0–100 USD, 101–200 USD vb.)
  - Her bir havayolu için, bir veya birden fazla fiyat aralığına ait varsayılan komisyon oranları yapılandırma.
  - Bu komisyon oranı yapılandırmalarını görüntüleme, oluşturma, düzenleme veya silme yeteneği.
  - Sistem, satış anında biletin fiyatına ve ilgili havayoluna göre doğru komisyonu hesaplayıp uygular.

  3.2 Komisyon Güncellemeleri
  - Yönetici, komisyon oranlarını/aralıklarını istediği zaman güncelleyebilir.

# 4. İçerik Yönetimi

  4.1 Duyurular & Kampanyalar
  - KAMPANYALARIN CALISILMASI LAZIM (Bir logic e oturtmak icin bir calisma yapilmasi lazim)
  - Duyuruları, kampanyaları, bilgilendirme metinlerini vb. manuel olarak yönetebilme (metin ve resim oluşturma, düzenleme, silme).
  - Sitenin slider/karusel bölümündeki banner görsellerini yönetme.
  - Kampanya oluşturma ve yönetme, başlangıç/bitiş tarihleri, indirim oranları vb. tanımlama.
  - Tüm üyelere kampanyalar hakkında e-posta ve/veya SMS gönderme.

  4.2 SSS (Sık Sorulan Sorular) Yönetimi
  - SSS bölümünü yönetme (oluşturma, düzenleme, silme).

  4.3 Site Sayfaları Yönetimi
  - Sitenin alt sayfalarındaki tüm başlık ve alt başlıklara tam erişim; düzenleme, oluşturma veya silme.

# 5. Blog Yönetimi

  5.1 Blog Erişimi ve Düzenlemesi
  - Sitedeki blog gönderilerini yönetme (oluşturma, düzenleme, silme).
  - Blog gönderileri için resim veya medya yükleyebilme.

# 6. Raporlar

  6.1 Gelir Raporları
  - Belirli bir tarih aralığına göre özet ve detaylı gelir bilgilerini görüntüleme.
  - Verileri Excel’e aktarabilme.

  6.2 Satış (Gelir) Raporları
  - Günlük, haftalık, aylık veya özel bir tarih aralığı seçerek özet ve detaylı gelir raporlarını (bilet sayısı, toplam gelir vb.) görüntüleme.
  - Verileri Excel’e aktarabilme.

  6.3 Fatura Raporları
  - Günlük, haftalık, aylık veya özel bir tarih aralığına göre kesilen faturaları (özet ve detaylı) görüntüleme.
  - Verileri Excel’e aktarabilme.

# 7. Yönetici Bilgileri

  7.1 Yönetici Profili
  - Yönetici profilindeki kişisel bilgileri (ör. isim, e-posta, şifre) güncelleme yeteneği.
  - Belirli izinlere sahip yeni yönetici veya kullanıcı hesapları ekleyebilme.

# Ek Sorular & Açıklamalar

## Komisyon Verileri

- **Soru:** Yönetim panelinde komisyon kuralları için geçerlilik tarihlerini tanımlayacağınız bir alan gerekli mi? (Örneğin, eski komisyon belirli bir tarihe kadar geçerli, ardından yeni oranlar başlıyor gibi.)

## Komisyon Raporlaması

- **Soru:** Komisyona özel raporlara (örn. havayolu bazında kazanılan toplam komisyon, tarih aralığı vb.) ihtiyacınız var mı? **EVET** 
- **Soru:** Komisyon bilgileri mevcut finansal raporlarda (Gelir, Satış) mı yer almalı, yoksa ayrı spesifik raporlar olarak mı görünmeli? **HAYIR**

## Fiyat Aralıkları

- **Soru:** Her havayolu için kaç adet fiyat aralığı bekliyorsunuz? (Sadece birkaç tane mi yoksa çok sayıda mı olabilir?) **DINAMIK**

## Diğer Yaygın Açıklamalar

- **Soru:** Çoklu para birimi desteğine ihtiyaç var mı? **Sağlayıcı çoklu para birimi ile satın alma desteklemiyor**.

- BIELATTALL bilet satislarinda sabit telefon numarasi