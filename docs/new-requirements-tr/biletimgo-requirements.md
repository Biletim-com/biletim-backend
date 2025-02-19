# 1. Gereksinimlerin Sınıflandırılması

## 1.1. İş/İşlevsel Gereksinimler

### Para Birimi & Dönüştürme

- 1 BiPara = 1 TL  
- Kullanıcılar banka/kredi kartlarından BiPara yatırabilir.  
- Kullanıcılar Kredi Kartı Puanlarını (CardPoints) BiPara’ya dönüştürebilir.
- Kart Puanlari  1sene sonra zaman asimina ugrayacak

### Kullanıcı Uygunluğu

- Yalnızca kayıtlı kullanıcılar cüzdan (wallet) özelliklerini kullanabilir.

### Satın Alma & İade Mantığı

- Kullanıcılar, cüzdan (wallet) ile satın aldıkları bileti iade edebilir.
- Kullanıcılar satin aldiklari bileti Wallet a return edebilir
- Ek hizmetle alınan biletler, banka/kredi kartlarına iade edilir (BiPara cüzdanına iade yok).  
- Ek hizmetli biletler, cüzdan veya kayıtlı kartlar aracılığıyla satın alınamaz.

## 1.2. Açık/Karar Verilmemiş Sorular

- Cüzdandaki bakiye transferini bankaya geri iade etmek mümkün olacak mı? **EVET** **Yeni Requirement**
- Kredi kartı puanları (CardPoints) cüzdana aktarılmışsa, bunlar bankaya geri aktarılabilir mi?  **HAYIR**
- Kullanıcılar, iade için kaynak seçebilecek mi? (Örn. A kartıyla satın alıp B karta iade gibi)  **HAYIR**
- Para/puan aktarımının bir yıl sonra geçerliliğini yitirmesi (expire) söz konusu mu?  **EVET**
- Cüzdanla kısmi ödeme yapılabilecek mi? (Detayları tartışılmalı) **ARASTIRMA**

## 1.3. Potansiyel Teknik/Uygulama Gereksinimleri

- Cüzdan bakiye yükleme (top-up) akışı ve ödeme servisleri entegrasyonu.  
- Tam vs. kısmi ödemelerin (bölünmüş ödemeler) işlenmesi.  
- Farklı kaynaklara iade (cüzdan vs. kart) mantığının yönetilmesi.  
- Kredi Kartı Puanlarını BiPara’ya dönüştürme mantığı.  
- İşlem güvenliği ve ilgili finansal düzenlemelerle uyumluluğun sağlanması.

---

# 2. Rol Bazlı Sorular & Açıklamalar

## 2.1. Proje Yönetimi

**Odak Noktası**: Genel kapsam, kullanıcı deneyimi, politika uyumluluğu, zaman çizelgesi, paydaş uyumu ve iş kuralları.

### İade Politikası Açıklaması

- Bir kullanıcı bileti sadece BiPara ile satın aldıysa (ek hizmet yoksa), iade BiPara’ya mı yapılır yoksa banka kartına mı?  **BiPara**
- Bilet kısmen cüzdan (BiPara) + kısmen kartla satın alındıysa, iade de bu orana göre mi bölünerek yapılır? **ARASTIRMA**

### Yasal / Uyum (Regulatory) Konuları

- Cüzdana iade vs. karta iade konusunda uymamız gereken herhangi bir bankacılık düzenlemesi var mı?  
- Kredi kartı puanlarını kullanılabilir bir “para” birimine (BiPara) dönüştürüp daha sonra iade etme konusunda yasal kısıtlar var mı? **IADE YOK**

### Kullanıcı Deneyimi & Politika

- Kullanıcı, herhangi bir iade kaynağı seçebilecek mi? (Örn. A kartıyla satın alıp B karta iade) Yoksa yasal sebeplerle iade orijinal ödeme kaynağına mı kilitlenmeli?  **HAYIR**
- Cüzdan için maksimum yükleme tutarı veya işlem limiti olacak mı?  **ARASTIRMA**
- Kullanılmayan BiPara’nın belli bir süre sonra (expire) geçersiz kalması planlanıyor mu?  **HAYIR**

### İş Modeli & Ücretlendirme

- Kredi kartı puanlarını BiPara’ya dönüştürmede veya cüzdan yüklemelerinde ücret/komisyon alınacak mı?  **HAYIR**
- İade işlemlerinde ek ücret kesilecek mi, yoksa bu maliyetleri biz mi üstleneceğiz? **BILET KURALLARINA GORE**

---

## 2.2. Mühendislik

**Odak Noktası**: Sistem entegrasyonu, veri akışı, API’ler, performans, güvenlik ve teknik uygulanabilirlik.

### API'ler & Entegrasyon Noktaları

- Cüzdan yüklemelerini ve iadeleri yönetmek için hangi dış ödeme sağlayıcıları/gateway'leri kullanacağız?  **VAKIF ve GARANTI**
- Kredi Kartı Puanları (CardPoints) sistemiyle entegrasyon nasıl gerçekleşecek?  **VAKIF ve GARANTI**

### Veri Modeli & İşlemler

- BiPara bakiyesi kullanıcının hesabında nasıl takip edilecek? Gerçek zamanlı mı yoksa asenkron bir güncelleme mi olacak?  **GERCEK ZAMANLI**
- Kullanıcı aynı anda birden fazla işlem yaparsa (örneğin kısmi ödeme + aynı anda bakiye yükleme), eşzamanlılık (concurrency) nasıl yönetilecek?

### İade/Satın Alma Senaryoları

- Cüzdana iade ile karta iade için ayrı işlem akışları mı gerekecek?  
- Bir biletin birden fazla eklentisi (add-on) varsa, cüzdan ve kart için her bir eklenti ödemesini ayrı ayrı mı bölmemiz gerekiyor?

### Güvenlik & Dolandırıcılık Önleme

- BiPara transferlerinde sahtekarlığı (fraud) önlemek için hangi güvenlik önlemleri (KVKK, ek doğrulama vb.) alınacak?  
- Kullanıcının kredi kartından yükleme yaptıktan sonra BiPara’yı hemen harcayıp, sonrasında banka harcama itirazı (chargeback) yaparsa nasıl bir süreç işleyecek?

### Performans & Ölçeklenebilirlik

- En yoğun zamanda saniyede kaç cüzdan işlemi (TPS) bekleniyor? 
- Yükleme veya iade süreleri ya da kullanıcı bildirimleri konusunda herhangi bir hız kısıtlaması veya SLA var mı?

---

## 2.3. Sistem Tasarımı

**Odak Noktası**: Mimari, bileşen etkileşimleri, veri modelleme, kullanıcı akışları, kenar durumlar, UI/UX tutarlılığı.

### İş Akışı / Kullanıcı Yolculukları

- **Yükleme (Deposit) Akışı**:  
  - Kullanıcı bankadan BiPara’yı nasıl yüklüyor?  
  - Yükleme sonrası yeni cüzdan bakiyesini anlık olarak arayüzde görüyor mu? **EVET**

- **Kredi Kartı Puanı (CardPoints) Dönüşümü**:  
  - Kullanıcı puanları BiPara’ya nasıl dönüştürüyor? UI üzerinde adım adım süreç nasıl?  **UX GELECEK**
  - Onay veya ek doğrulama gerektiren bir aşama var mı?  **3DS ISTENEBILIR**

- **Bilet Satın Alma**:  
  - Kısmi ödeme akışı (cüzdan + kart) nasıl görünecek?  **UX GELECEK**
  - Ek hizmetler cüzdan veya kayitli kartla ödenemiyorsa, kullanıcı arayüzü nasıl yönlendirilecek?

- **İade Akışı**:  
  - Satın alma işlemi ek hizmetle veya ek hizmetsiz yapıldıysa farklı senaryolar nasıl işliyor?  **ARASTIRMA**
  - Kısmi cüzdan, kısmi kart ile ödeme yapıldıysa iade akışı nasıl bölünüyor? **ARASTIRMA**

### Veri Yapıları

- “Cüzdan” (wallet) nesnesinde hangi veri öğelerini saklıyoruz? (Bakiye, son yükleme tarihi, yükleme kaynakları, işlem geçmişi vb.)  
- CardPoints’ten yapılan dönüşümleri ayrı bir kayıt olarak mı takip ediyoruz (fon kaynağının hangi puan sisteminden geldiği gibi)?

### Kenar Durumlar

- Kullanıcının BiPara bakiyesi yetersizse (kısmi ödeme sırasında), ek bakiye yükleme seçeneği mi gösterilir?  
- Kısmen BiPara, kısmen kart ödemesi yapıldıktan sonra iade edilmek istendiğinde her bir kaynağa göre bir iade oranı zorunlu mu?  
- Ek hizmetlerin bir kısmı cüzdanla, bir kısmı kartla ödenirse tüm tutar tek işlemde mi yoksa ayrı ayrı mı yönetilmeli?


## Arastirma
- Minimal hangi kart bilgileri ile 3DS i baslatabiliriz? (Vakif ve Garanti). Kayitli kartlarla odeme ile ilgili
- Wallet transaction listesi olacak mi? Figmaya bakilacak. Bu cuzdana aktarilan paranin iade edilmeis ile alakali
- Kismi odemelerde kesintiler nasil dagitilacak?
- Kredi Karti puani wallet a aktarma UX i.

## Yeni Requirement
- Admin panelden yanlis yapilmis Wallet a iadeyi iptal edip, satin alinan karta iade yapilabilir.