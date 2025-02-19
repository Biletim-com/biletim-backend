# Ek Hizmet Gereksinimleri & Açıklamalar

## 1. **Biletim Güvende**

### 1.1. Bilinen Gereksinimler

1. **Uygunluk & İade**  
   - Yolcular, uçuş kalkış saatinden **3 saat** öncesine kadar (tek yön veya gidiş-dönüş) uçak biletlerini iptal edebilirler.  
   - Başarılı bir iptal işlemi sonrasında, kullanıcı bilet ücretinin **%90’ını** geri alır.  
   - Eğer gidiş-dönüş uçuş **tek bir bilet** (PNR) üzerinde (farklı hava yolları tarafından işletilse bile) tanımlanmışsa, **her iki** uçuşu birden iptal etmek gerekir; havayolu kurallarına göre ilk uçuşun kalkış saatinden **3 saat** öncesine kadar iptal edilebilir.  

2. **İptal Süreci**  
   - İptal işlemi şu yollarla başlatılabilir:  
     - **0850 244 2586** numaralı hattı arayarak, veya  
     - Uygulama içindeki **İptal Akışı**nı kullanarak.  
   - **Kısmi iptaller** (örn. tek PNR içindeki gidiş-dönüş biletlerden sadece birini iptal etme) mümkün değildir.  
   - **Check-in yapılmış biletler** kullanıcı tarafından iptal edilemez.  
   - **Yalnızca ek hizmet** iptali yapılamaz, ek hizmetler tek başına iptal edilemez.

3. **İade & Zaman Çizelgesi**    
   - Kullanıcı, eğer iptal koşullarına uymayan bir işlem yaparsa (örn. check-in yapılmış bilet, kalkışa 3 saatten az kalmış bilet), **herhangi bir iade alamaz**.  
   - İade tutarı, kullanıcının tercihi doğrultusunda banka hesabına veya cüzdan hesabına (wallet) yatırılır.

4. **Diğer Hususlar**  
   - Kullanıcı, “Biletim Güvende” hizmetini satın alarak yukarıda belirtilen haklara sahip olur.  
   - Bilet tamamen iptal edildiğinde, **ek hizmetlere** dair herhangi bir iade yapılmaz.

---

### 1.2. Sorular & Açıklamalar

#### Proje Yönetimi

1. **İade Süresi**  
   - Gereksinimde iadenin **2-7 iş günü** içinde yapılacağı belirtiliyor. Bu işlemin anında veya daha hızlı yapılması mümkün mü? Bankacılık ortaklarından kaynaklı kısıtlar var mı? Kod tarafında anında iade başlatmıyor muyuz?  
2. **Hizmet Kapsamı**  
   - Biletim Güvende, çoklu şehir (multi-city) biletleri için de geçerli olacak mı yoksa sadece tek yön/gidiş-dönüş için mi geçerli?  **HAYIR**
3. **Kullanıcı İletişimi**  
   - Kullanıcıları uygunluk ve 3 saatlik iptal sınırı hakkında **nasıl** bilgilendireceğiz (hangi kanalları kullanacağız)?  **Email deki PDF e eklenecek**

#### Mühendislik

1. **PNR Yönetimi**  
   - Gidiş-dönüş biletinin tek PNR mı yoksa birden fazla PNR mı olduğunu nasıl **tespit edeceğiz** (özellikle farklı hava yolları varsa)?  
2. **Otomatik İade**  
   - İade akışını ne tetikliyor? (İptal olayı, çağrı merkezi, müşteri talebi vb.)  
   - İptal işlemi gerçekleştiğinde müşteriye nasıl bildirim gönderiliyor?

---

## 2. **Biletim iadeJet** (ARASTIRMA)

### 2.1. Bilinen Gereksinimler

1. **Özel Hizmet**  
   - Biletim iadeJet hizmetini satın alan kullanıcılar, kişi başı **20 TL** ek ücret öderler.  
   - Bu hizmet, havayolu bilet iptaliyle ilgili **uzun iade sürecini** atlamalarına olanak tanır.  
   - Kullanıcının iptal talebi **öncelikli** olarak işleme alınır ve iade işlemi Biletim.com tarafından, minimum havayolu müdahalesiyle gerçekleştirilir.

2. **Kapsam & Süreç**  
   - Kullanıcı işlemi muhtemelen uygulama veya müşteri hizmetleri aracılığıyla başlatır.  
   - Biletim.com, iadeJet kapsamında havayoluyla ilgili **karmaşık** iptal ve iade sürecini yönetir.  
   - Zaman çizelgesi ve kesin **iade oranı** tam olarak belirtilmemiştir; varsayımımız bilet ücretinin iadesini, hizmet bedeli hariç, kapsadığı yönündedir.

---

### 2.2. Sorular & Açıklamalar

#### Proje Yönetimi

1. **Hizmet Tanımı & Fiyatlandırma**  
   - **20 TL** ücreti sabit midir, yoksa sezona, hava yoluna veya diğer faktörlere göre değişebilir mi? (SABIT)

#### Mühendislik

1. **Arka Uç (Backend) İş Akışı**  
   - iadeJet akışı, normal iade akışından mimari olarak nasıl farklılık gösteriyor?  
   - iadeJet talepleri için **ayrı bir kuyruk veya mikroservise** ihtiyaç var mı?  
2. **Ödeme Servisleriyle Entegrasyon**  
   - Normal iade sürecinde kullandığımız ödeme sağlayıcılarıyla aynı sistem mi kullanılacak?  
   - iadeJet ücreti için **ayrı bir muhasebe kaydı** (ledger entry) gerekli mi?

#### Sistem Tasarımı

1. **Süreç Akışı**  
   - Kullanıcı iadeJet’i seçtiğinde, **farklı bir iptal akışı** mı devreye giriyor, yoksa standart iptal akışına mı entegre?  
   - Kullanıcıya iadeJet’in **hızlı işlem** durumunu göstermek için (örn. daha kısa işlem süresi), nasıl bir **durum** bildirimi sunacağız?

---

## 3. **Biletim Express CHECK-IN** (IPTAL)
- PNR numarasiyla kontrol saglayip firmayi identity ettikten sonra onlarin check in url ne redirect yapilacak (ANA SAYFADA)

### 3.1. Bilinen Gereksinimler

1. **Check-In Hizmeti**  
   - Sağlayıcı, **check-in** desteğini doğrudan sunmamaktadır. Otomatik bir süreç yok.  
   - Kullanıcılar, Biletim Express üzerinden check-in yapamaz.

2. **Sonuçlar**  
   - Biletim.com, havayolunun kendi check-in sürecine bağımlı kalır.  
   - Yolcu havayolu sitesi üzerinden check-in yaptıysa, Biletim Güvende ve iadeJet de bu durumu dikkate alır (check-in yapılmış biletlerde iptal mümkün olmayabilir).

---

### 3.2. Sorular & Açıklamalar

#### Proje Yönetimi

1. **Hizmet Yol Haritası**  
   - İleride, ortak hava yollarıyla doğrudan check-in desteği sunmak gibi bir plan var mı?  
   - Eğer hiçbir şekilde check-in desteklenmiyorsa, “Biletim Express CHECK-IN” ifadesini kaldırmalı veya gizlemeli miyiz?

#### Sistem Tasarımı

1. **UI/UX**  
   - Check-in mevcut değilken, “Biletim Express CHECK-IN” hakkında **nasıl** bir bilgilendirme veya uyarı göstermeliyiz?  
   - Kullanıcı, bu özelliğin gelecekte sunulabilmesi için bir “placeholder” veya açıklama metni görecek mi?

---

## 4. **Özet**

- **Biletim Güvende**, kalkış saatinden 3 saat öncesine kadar (tek yön veya gidiş-dönüş) yapılacak iptallerde bilet ücretinin %90’ının iade edilmesini sağlayan bir hizmettir. Eğer bilet tek PNR içindeyse (gidiş-dönüş), iptal tüm uçuşları kapsar.  
- **Biletim iadeJet**, kişi başı 20 TL ek ücretle daha hızlı bir iade süreci sunan, kullanıcının havayolu ile doğrudan uğraşmasını büyük ölçüde azaltan bir hizmettir.  
- **Biletim Express CHECK-IN**, sağlayıcının check-in desteği olmaması nedeniyle şu anda aktif olarak kullanılamamaktadır. Bu durum, check-in yapılmış biletlerin iptalinin mümkün olmaması gibi süreçleri de etkilemektedir.
