## 1. Mobil Uygulamaya Özel Fiyat
- Mobil kayitli kullanicilara ozel kampanya
- login olmasi lazim
- Kontrol panelden yonetilmesi

### 1.1 Proje Yöneticisi

1. **Kapsam & İş Mantığı**  
   - Mobil uygulamada, diğer platformlara kıyasla özel bir fiyat sunarak hangi somut faydayı sağlamayı hedefliyoruz?  
   - Bu özelliğin amacı mobil uygulama indirilme sayılarını artırmak mı, yoksa daha geniş bir promosyon stratejisinin bir parçası mı?

2. **Hedef Kitle & Kullanıcı Gereksinimleri**  
   - Mobil uygulamaya özel fiyatları görmek ve bunlardan yararlanmak için kullanıcıların oturum açmış olması gerekiyor mu?  
   - Yalnızca mobilde geçerli fırsatlar tüm uygulama kullanıcılarına mı gösterilmeli, yoksa belirli segmentlere mi sunulmalı?

3. **Zaman Çizelgesi & Teslimatlar**  
   - Bu özelliğin ne zaman hayata geçirilmesi gerekiyor? Belirli bir pazarlama kampanyasına veya sürüm dönüm noktasına mı bağlı?  
   - Başarıyı nasıl ölçeriz? (ör. mobil dönüşüm oranlarında artış, rezervasyon sayısı veya kullanıcı benimsemesi gibi)

5. **Riskler & Azaltma Stratejileri**  
   - Mobilde daha düşük fiyatlar sunmak kanal çatışmalarına veya iş ortaklarından tepkiye neden olabilir mi?  
   - Masaüstü ile mobilde farklı fiyatlar gören kullanıcıların yaşayabileceği kafa karışıklığını nasıl yönetiriz?

---

### 1.2 Mühendislik

1. **Teknik Mimari**  
   - Sistem, mobil uygulama istekleri ile diğer kanalları (web, üçüncü taraf vb.) nasıl ayırt edecek?  
   - Mevcut fiyatlandırma motorunun neresine “mobil uygulama indirimi” mantığını entegre edeceğiz?

2. **Veri & Arka Uç Servisleri**  
   - Veritabanında mobil kanallar için ayrı fiyat kayıtları mı tutacağız, yoksa dinamik bir indirim formülü mü uygulayacağız?  
   - Bu mevcut bir fiyatlandırma servisinin uzantısı olabilir mi, yoksa yeni bir mikroservise mi ihtiyaç var?

3. **Güvenlik & Erişim Kontrolü**  
   - Kullanıcının oturum açması gerekiyorsa, mobil indirimler için kimlik doğrulama nasıl ele alınacak?  
   - Bu indirimli fiyatlara diğer kanallardan yetkisiz erişimi nasıl engelleriz?

5. **Cüzdan veya Ödeme Sistemleri ile Entegrasyon**  
   - Mobil uygulamaya özel bu fiyatlar, mevcut herhangi bir cüzdan veya ödül puanı sistemiyle entegre olacak mı?  
   - İndirimli fiyatlandırma için işlem akışlarını değiştirmemiz gerekiyor mu?

---

### 1.3 Sistem Tasarımı

1. **Kullanıcı Akışı & Arayüz**  
   - Kullanıcı, mobil uygulamadaki indirimli fiyatı nasıl keşfedecek ve onunla etkileşime girecek?  
   - Kullanıcı oturum açmamışken ve açmışken deneyim farklı mı olacak?

2. **Kenar Durumlar & Koşullar**  
   - Bir kullanıcı işlem ortasında mobilden web’e geçerse ne olur? Fiyat indirimi devam eder mi?  
   - Birden fazla indirim seviyesi var mı (ör. temel üyelik için %5, premium için %10 gibi)?

3. **Wireframe'ler & Kullanıcı Deneyimi**  
   - İndirimli fiyat, standart fiyata kıyasla nasıl gösterilmeli?  
   - “Yalnızca mobil” olduğunu belirten bir rozet veya etiket olacak mı?

5. **Tasarım Tutarlılığı**  
   - Uygulama genelinde özel fiyatlar için tutarlı bir stil veya görsel tanımlayıcıya sahip miyiz?  
   - “Sadece mobil” fırsatlar için özel bir renk şeması veya ikonlar var mı?

---

## 2. Kişiye Özel Kampanyalar (Diger fazlarda. simdilik yok)

### 2.1 Proje Yönetimi

1. **Kampanya Türleri & Kapsam**  
   - Kampanyalar otellere, otobüslere, uçak biletlerine mi yoksa hepsinin bir kombinasyonuna mı yönelik?  
   - Temel amaç nedir: Sadık müşterileri elde tutmak, ek satış yapmak veya çapraz satış yapmak mı?

2. **Hedefleme & Uygunluk Kriterleri**  
   - Hangi kullanıcının hangi kampanyadan yararlanacağını nasıl tanımlıyoruz? (ör. sadakat seviyesi, geçmiş satın almalar gibi)  
   - Kişiselleştirilmiş teklifler için, özellikle konum veya kullanım verileri söz konusuysa, kullanıcı onayına ihtiyacımız var mı?

3. **Operasyonel & Pazarlama Koordinasyonu**  
   - Kampanya içeriği ve uygunluğu Pazarlama tarafından mı belirlenecek, yoksa sistem kurallarıyla otomatik mi olacak?  
   - Başarıyı nasıl ölçeriz (kampanya kullanımı oranı, satış artışı, kullanıcı elde tutma gibi)?

4. **Hukuki & Uyum**  
   - Kişiselleştirilmiş teklifler için kullanıcıları belirlerken veri gizliliği konularını göz önünde bulundurmamız gerekiyor mu?  
   - GDPR veya diğer bölgesel düzenlemelerle ilgili konuları ele almamız gerekiyor mu?

---

### 2.2 Mühendislik

1. **Veri Hatları & Kişiselleştirme Mantığı**  
   - Kampanya uygunluğu için hangi kullanıcı özellikleri (geçmiş, konum, üyelik durumu) kullanılacak?  
   - Bu veri noktalarını nasıl güncel tutacağız (gerçek zamanlı API'ler, toplu işler)?

2. **Kampanya Konfigürasyonu**  
   - Özel bir Kampanya Yönetim Sistemi mi geliştireceğiz, yoksa mevcut bir sistemle mi entegre olacağız?  
   - Kampanya kuralları, başlangıç/bitiş tarihleri ve kullanıcı segmentleri nerede tutulacak?

3. **Ölçeklenebilirlik & Performans**  
   - Gerçek zamanlı veya gerçek zamana yakın uygunluk kontrollerinin sistem performansını düşürmediğinden nasıl emin oluruz?  
   - Kullanıcı tabanı büyükse, önbellekleme veya kuyruk sistemlerine ihtiyaç var mı?

4. **Diğer Modüllerle Entegrasyon**  
   - Kampanyalar cüzdan kredileri veya harici sadakat programlarıyla ilişkilendirilmeli mi?  
   - Kullanıcı profillerini güncellemek için kampanya kullanımını nasıl takip ederiz?

---

### 2.3 Sistem Tasarımı

1. **Kullanıcı Yolculuğu & Kampanya Keşfi**  
   - Kullanıcılar kişiselleştirilmiş kampanyalardan nasıl haberdar olacak—bildirimle mi, kontrol paneliyle mi, yoksa ödeme akışı içinde mi?  
   - Kullanıcı uygunsa kampanyalar otomatik olarak mı görüntülensin?

2. **Kampanya İçeriği & Kullanıcı Deneyimi**  
   - Kampanyalar indirim, bonus puan veya özel özellikler mi sunacak?  
   - Kampanya tekliflerini özel afişler veya renk kodlamasıyla görsel olarak ayırmalı mıyız?

3. **Kenar Durumlar & Uygunluk**  
   - Bir kullanıcı kampanya kriterlerini kısmen karşılıyorsa ne olur? Kısmi bir indirim mi yoksa hiç indirim olmaz mı?  
   - Birden fazla kampanya birleştirilebilir mi, yoksa aynı anda sadece bir kampanya mı geçerli?

4. **Kontrol Paneli & Analitik**  
   - Aktif/sona ermiş kampanyalar için bir “Tekliflerim” bölümü gerekiyor mu?  
   - Bir kullanıcının belirli bir teklifi kaç kez kullandığını göstermeli miyiz?

---

## 3. Push notifications
- App e gelen fiyat ile ilgili bildirimler
- Bu bildirimler hem kampanya hem de duyuru olabilir
- Kampanya bildirimleri acildiginda biletleme ekranina gidilecek
- Duyurularda anasayfaya gidilecek
- notification duzenlendginde URL eklenecek kullanicilari yonlendirmek icin
- Notification listesi icin UI calismasi (Bottom slider)

### 3.1 Proje Yönetimi

1. **Amaçlar & Kullanım Senaryoları**  
   - Bu bildirimleri tetikleyen şey nedir: fiyat düşüşleri, sınırlı stok/koltuk, yoksa promosyonlar mı?  **Manuel olarak panelden girilecek. BiletAll dan gelen bildirimleri kullanicilara aktarmak icin**
   - Bu uyarıları tüm kullanıcılara mı yoksa belirli segmentlere mi yollamayı hedefliyoruz?  **Uyelik sarti olmadan uygulama kullanicilarina gonder**

2. **Bildirim Politikaları**  
   - Bunlar gerçek zamanlı mı yoksa belirli aralıklarla toplu olarak mı gönderilecek?  **Toplu**
   - Kullanıcıları spamlemekten kaçınmak için bir gönderim sıklığı limiti var mı?  **LIMIT YOK**

3. **Kullanıcı Onayı & Tercihleri**  
   - Kullanıcılar belirli bildirim türlerinden (ör. sadece uçak teklifleri) vazgeçebilir mi?  **HAYIR**
   - Abonelikten ayrılmaları veya bildirim ayarlarını nasıl yöneteceğiz?  **BU FEATURE YOK**

4. **Fonksiyonlar Arası Uyum**  
   - Bu bildirimler pazarlama kampanyalarına mı bağlı yoksa tamamen olay odaklı mı çalışıyor?  
   - Kuralları hangi departman belirliyor veya sıklık/içeriği kim kontrol ediyor?

---

### 3.2 Mühendislik

1. **Sistem Mimarisi**  
   - Fiyat değişiklikleri için gerçek zamanlı bir akışa mı sahibiz yoksa fiyat verilerini periyodik olarak mı sorguluyoruz?  
   - Bildirimler için hangi kanallar destekleniyor (push, SMS, e-posta, uygulama içi vb.)?

2. **Kuyruk & Olay Yönetimi**  
   - Gerçek zamanlı olaylar için bir mesaj kuyruğu sistemi (ör. Kafka, RabbitMQ) kullanacak mıyız?  
   - Teslim sırası ve tekrar denemeleri nasıl ele alıyoruz?

3. **Kullanıcı Abonelik Mantığı**  
   - Bir kullanıcı belirli rotalara/ürünlere/fiyatlara nasıl abone olur?  
   - Abonelik verileri özel bir tabloda mı yoksa kullanıcı profilleriyle entegre şekilde mi saklanacak?

4. **Veri & Loglama**  
   - Gönderilen, açılan ve tıklanan bildirimleri analitik amaçlarla nasıl kaydediyoruz?  **KAYIT YOK**
   - Bildirim teslimatıyla ilgili gerçek zamanlı metrikler için bir izleme paneline ihtiyacımız var mı?

---

### 3.3 Sistem Tasarımı

1. **Bildirim Tasarımı & Kullanıcı Akışı**  
   - Push bildirimleri, ilgili fiyat detaylarını göstermek için uygulamanın ilgili ekranına yönlendiriyor mu?  
   - Uygulama içi bildirimler, belirli bir bildirim merkezinde mi yoksa bir afiş şeklinde mi gösterilecek?

2. **Kullanıcı Tercihleri & Ayarları**  
   - Kullanıcılar bildirim türlerini (fiyat düşüşleri, son dakika fırsatları vb.) nerede özelleştirebilir?  
   - Kategori (otobüs, uçak, otel) veya fiyat aralığı bazında detaylı kontrol seçenekleri sunuyor muyuz?

3. **Zamanlama & Bağlam**  
   - Bildirimler anında mı gönderilmeli yoksa daha iyi etkileşim için belirli bir zaman dilimi mi tercih edilmeli?  
   - Gece yarısı gibi uygun olmayan saatlerde (örn. yerel saatle 03:00) bildirimleri engellemeli miyiz?

4. **Etkileşim & Takip**  
   - Kullanıcı bir bildirime dokunduğunda ancak fiyat tekrar değişmişse ne olur?  
   - Fırsatın süresi dolarsa alternatif seçenekler gösteriyor muyuz?
