export const vPOSResponse: Record<
  string,
  { description: string; detail?: string }
> = {
  '0000': {
    description: 'İşlem Başarılı',
    detail: 'Bir işlemin başarılı olduğunu gösterir.',
  },
  '0001': {
    description: 'Red-Bankanızı Arayın',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0002': {
    description: 'Kategori Yok',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0003': {
    description: 'İşyeri Kategorisi Hatalı/Tanımsız',
    detail: undefined,
  },
  '0004': {
    description: 'Karta El Koyunuz/Sakıncalı',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0005': {
    description: 'Red/Onaylanmadı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0006': {
    description: 'Hatalı İşlem',
    detail: undefined,
  },
  '0007': {
    description: 'Karta El Koyunuz',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0008': {
    description: 'Kimlik Kontrolü/Onaylandı',
    detail: undefined,
  },
  '0009': {
    description: 'Tekrar Deneyiniz',
    detail:
      'Hatanın devam etmesi halinde kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0010': {
    description: 'Tekrar Deneyiniz',
    detail:
      'Hatanın devam etmesi halinde kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0011': {
    description: 'Tekrar Deneyiniz',
    detail:
      'Hatanın devam etmesi halinde kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0012': {
    description: 'Hatalı İşlem/Red',
    detail:
      'Kart sahibi kart bilgilerini doğru girdiğinden veya sanal limitinin yeterli olup olmadığından emin olduktan sonra işlemini tekrar denemelidir. Kart sahibi hata almaya devam ediyorsa kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0013': {
    description: 'Geçersiz İşlem Tutarı',
    detail: undefined,
  },
  '0014': {
    description: 'Geçersiz Kart Numarası',
    detail: undefined,
  },
  '0015': {
    description: 'Müşteri Yok/Bin Hatalı',
    detail: undefined,
  },
  '0021': {
    description: 'İşlem Yapılamadı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0030': {
    description: 'Format Hatası (Üye İşyeri)',
    detail: undefined,
  },
  '0032': {
    description: 'Dosyasına Ulaşılamadı',
    detail: undefined,
  },
  '0033': {
    description: 'Süresi Bitmiş/İptal Kart',
    detail: undefined,
  },
  '0034': {
    description: 'Sahte Kart',
    detail: undefined,
  },
  '0038': {
    description: 'Şifre Aşımı/Karta El Koy',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0041': {
    description: 'Kayıp Kart-Karta El Koy',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0043': {
    description: 'Çalıntı Kart-Karta El Koy',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0051': {
    description: 'Bakiyesi-Kredi Limiti Yetersiz',
    detail: undefined,
  },
  '0052': {
    description: 'Hesap Noyu Kontrol Edin',
    detail: undefined,
  },
  '0053': {
    description: 'Hesap Yok',
    detail: undefined,
  },
  '0054': {
    description: 'Vade Sonu Geçmiş Kart',
    detail: undefined,
  },
  '0055': {
    description: 'Hatalı Kart Şifresi',
    detail: undefined,
  },
  '0056': {
    description: 'Kart Tanımlı Değil',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0057': {
    description: 'Kart İşlem Tipine Kapalı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0058': {
    description: 'İşlem Tipi Terminale Kapalı',
    detail:
      'Girilen kart numarası hatalı veya rastgele girilmiş bir değer olabilir.',
  },
  '0059': {
    description: 'Sahtekarlık Şüphesi',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0061': {
    description: 'Para Çekme Tutar Limiti Aşıldı',
    detail: undefined,
  },
  '0062': {
    description: 'Yasaklanmış Kart',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0063': {
    description: 'Güvenlik İhlali',
    detail: undefined,
  },
  '0065': {
    description: 'Para Çekme Limiti Aşıldı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0075': {
    description: 'Şifre Deneme Sayısı Aşıldı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0077': {
    description: 'Şifre Script Talebi Reddedildi',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0078': {
    description: 'Şifre Güvenilir Bulunmadı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0089': {
    description: 'İşlem Onaylanmadı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0091': {
    description: 'Kartı Veren Banka Hizmet Dışı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0092': {
    description: 'Bankası Bilinmiyor',
    detail: undefined,
  },
  '0093': {
    description:
      'Kartınız E-Ticaret İşlemlerine Kapalıdır. Bankanızı Arayınız.',
    detail: 'Kart E-Ticarete Kapalı',
  },
  '0096': {
    description: 'Bankasının Sistemi Arızalı',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisine yönlendirilmelidir. Farklı bankalardan da aynı hata alınıyorsa, hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0312': {
    description: 'Kartın Cvv2 Değeri Hatalı',
    detail: undefined,
  },
  '0315': {
    description: 'Kartın Sanal Limiti Yeterli Değil',
    detail: undefined,
  },
  '0320': {
    description: 'Önprovizyon Yok',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0323': {
    description: 'Önpr. Kapama Tutar Eşlenmedi',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0357': {
    description: 'Eksik Ödeme Sayacı: Nakit Red',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0358': {
    description: 'Kart Kapalı',
    detail: undefined,
  },
  '0359': {
    description: 'Aylık Ciro Limiti Aşıldı',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine iletiniz.',
  },
  '0381': {
    description: 'Red Karta El Koy',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0382': {
    description: 'Sahte Kart-Karta El Koyunuz',
    detail: 'IP bloklanarak aynı IP’den işlem gelmesi engellenebilir.',
  },
  '0400': {
    description: '3D Secure Şifre Doğrulaması Yapılamadı',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine iletiniz.',
  },
  '0501': {
    description: 'Geçersiz Taksit/İşlem Tutarı',
    detail: 'Taksit tanımı yok veya denenen işlem tutarı 1 TL’nin altındadır.',
  },
  '0503': {
    description: 'Ekstre-Taksit Sayısı Uyumsuz',
    detail: undefined,
  },
  '0504': {
    description: 'İşyerinin Storeu İçin Bu Kartın Bini Tanımlı Değil',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0540': {
    description: 'İade Edilecek İşlemin Orijinali Bulunamadı',
    detail: undefined,
  },
  '0541': {
    description: 'Orj. İşlem Tamamı İade Edildi',
    detail: undefined,
  },
  '0542': {
    description: 'Günlük İade Limiti Aşımı',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0550': {
    description: "İşlem YKB POS'undan Yapılmalı",
    detail: undefined,
  },
  '0570': {
    description: 'Yurtdışı Kart İşlem İzni Yok',
    detail:
      'Yurt dışı kart işlem izni için talebinizi şubenize iletmeniz gerekmektedir.',
  },
  '0571': {
    description: 'İşyeri Amex İşlem İzni Yok',
    detail: 'Amex Kart İşlem izni için Şubenize başvurunuz.',
  },
  '0572': {
    description: 'İşyeri Amex Tanımları Eksik',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0574': {
    description: 'Kampüs Karta Uygun İşyeri Değil',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0575': {
    description: 'Limitsiz Takip Kart',
    detail:
      'Kart sahibi kredi kartını aldığı bankanın kredi kartları servisiyle görüşerek kartını e-ticarette kullanamadığını belirtmelidir.',
  },
  '0577': {
    description: 'Taksitte Kapalı Sektör',
    detail: undefined,
  },
  '0580': {
    description: 'CAVV veya BKM Expsign Değeri Hatalı',
    detail:
      'ECI ve CAVV değerlerinin provizyon mesajında boş veya hatalı gönderilmektedir.',
  },
  '0581': {
    description: 'ECI veya CAVV Bilgisi Eksik',
    detail:
      'ECI ve CAVV değerlerinin provizyon mesajında boş veya hatalı gönderilmektedir.',
  },
  '0582': {
    description: 'CAVV ACS Error',
    detail:
      'ECI ve CAVV değerlerinin provizyon mesajında boş veya hatalı gönderilmektedir.',
  },
  '0583': {
    description: 'BKM Expsign Mükerrer',
    detail:
      'ECI ve CAVV değerlerinin provizyon mesajında boş veya hatalı gönderilmektedir.',
  },
  '0961': {
    description: 'Debit Kartla İade Yapılamaz',
    detail: undefined,
  },
  '0962': {
    description: 'TerminalID Tanımsız',
    detail: undefined,
  },
  '0963': {
    description: 'Üye İşyeri Tanımlı Değil',
    detail: undefined,
  },
  '0966': {
    description: 'Duplicate İşlem Numarası Hatası',
    detail: undefined,
  },
  '0971': {
    description: 'Eşleşmiş (Capture) Bir İşlem İptal Edilemez',
    detail: undefined,
  },
  '0972': {
    description: 'Para Kodu Geçersiz. Onus Kart ile Yapılan İşlem',
    detail: undefined,
  },
  '0973': {
    description: 'İşlem Onaylanmadı',
    detail: undefined,
  },
  '0974': {
    description: 'Reversal Farklı Günde Gelmiş',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0975': {
    description: 'İşlem İzni Yok',
    detail: 'Sanal POS’un bu işleme yetkisi yoktur.',
  },
  '0976': {
    description: 'Onus Kart Tanımlı Değil',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0977': {
    description: 'Onus Kart Tanımlı Değil',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0978': {
    description: 'Notonus Kart ile Taksitli İşlem',
    detail: 'Diğer Banka kartları ile taksitli işlem yapılamaz.',
  },
  '0980': {
    description: 'Son Kur Bilgisi Bulunamadı',
    detail: undefined,
  },
  '0981': {
    description: '3D Secure Acquiring ile İlgili Eksik Güvenlik Alanı',
    detail:
      'ECI ve CAVV değerlerinin provizyon mesajında boş veya hatalı gönderilmelidir.',
  },
  '0982': {
    description: 'İşlem İptal Durumda. İade Edilemez',
    detail: undefined,
  },
  '0983': {
    description: 'İade Edilecek İşlemin Orijinali Bulunamadı',
    detail: undefined,
  },
  '0984': {
    description: 'İade Tutarı Satış Tutarından Büyük Olamaz',
    detail: 'İade Tutarı Satış Tutarından Büyük Olamaz',
  },
  '0985': {
    description: 'İşyeri Store’a Bağlı Olmalıdır',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '0986': {
    description: 'GİB Taksit Hata',
    detail: undefined,
  },
  '0987': {
    description: 'İşyeri MP Taksit Tanımı Bulunamadı',
    detail: 'Hatayı vpos724@vakifbank.com.tr adresine bildiriniz.',
  },
  '1001': {
    description: 'Sistem Hatası',
    detail: undefined,
  },
  '1006': {
    description:
      'Bu İşlem Numarası ile Daha Önce Bir İşlem Gerçekleştirilmiş, Yeni Bir Numara Verebilir Yada Bu Alanı Boş Bırakabilirsiniz',
    detail: undefined,
  },
  '1007': {
    description: 'Referans Transaction Alınamadı',
    detail:
      'Genel olarak iade işlemlerinde, iade edilecek işlemin ReferansTransactionId değeriyle uyuşmadığı durumlarda alınır.',
  },
  '1044': {
    description: 'Debit Kartlarla Taksitli İşlem Yapılamaz',
    detail: undefined,
  },
  '1046': {
    description: 'Toplam İade Tutarı Orijinal Tutarı Aştı',
    detail: undefined,
  },
  '1047': {
    description: 'İşlem Tutarı Geçersiz',
    detail: undefined,
  },
  '1049': {
    description: 'Geçersiz Tutar',
    detail:
      "Üye işyerinin CurrencyAmount alanında XX.YY formatında kayıt ilettiği kontrol edilmelidir. Virgül kullanılmamalı, noktadan sonra 2 hane olmalıdır. 1 TL'lik işlem için 1.00 gönderilmelidir.",
  },
  '1050': {
    description: 'CVV Hatalı',
    detail:
      "CVV'nin formatının hatalı gönderilmesinden ya da hiç gönderilmemesinden dolayı alınan hatadır.",
  },
  '1051': {
    description: 'Kredi Kartı Numarası Hatalı',
    detail: undefined,
  },
  '1052': {
    description: 'Kart Vadesi Hatalı veya Vade Formatı Hatalı',
    detail: undefined,
  },
  '1053': {
    description: 'Gönderilen Pancode Kayıtlı Değil',
    detail: undefined,
  },
  '1054': {
    description: 'İşlem Numarası Hatalı',
    detail: undefined,
  },
  '1059': {
    description: 'İşlemin Tamamı İade Edilmiş',
    detail: undefined,
  },
  '1060': {
    description: 'Hatalı Taksit Sayısı',
    detail: undefined,
  },
  '1061': {
    description:
      'Aynı Sipariş Numarasıyla Daha Önceden Başarılı İşlem Yapılmış',
    detail: undefined,
  },
  '1065': {
    description: 'Ön Provizyon Daha Önceden Kapatılmış',
    detail: undefined,
  },
  '1073': {
    description: 'Terminal Üzerinde Aktif Olarak Bir Batch Bulunamadı',
    detail: undefined,
  },
  '1074': {
    description:
      'İşlem Henüz Sonlanmamış Yada Referans İşlem Henüz Tamamlanmamış',
    detail: undefined,
  },
  '1075': {
    description: 'Sadakat Puan Tutarı Hatalı',
    detail: undefined,
  },
  '1076': {
    description: 'Sadakat Puan Kodu Hatalı',
    detail: undefined,
  },
  '1077': {
    description: 'Para Kodu Hatalı',
    detail: undefined,
  },
  '1078': {
    description: 'Geçersiz Sipariş Numarası',
    detail: undefined,
  },
  '1079': {
    description: 'Geçersiz Sipariş Açıklaması',
    detail: undefined,
  },
  '1080': {
    description: 'Sadakat Tutarı ve Para Tutarı Gönderilmemiş',
    detail: undefined,
  },
  '1081': {
    description: 'Puanla Satış İşleminde Taksit Sayısı Gönderilemez',
    detail: undefined,
  },
  '1082': {
    description: 'Geçersiz İşlem Tipi',
    detail: undefined,
  },
  '1083': {
    description: 'Referans İşlem Daha Önceden İptal Edilmiş',
    detail: undefined,
  },
  '1087': {
    description:
      'Yabancı Para Birimiyle Taksitli Provizyon Kapama İşlemi Yapılamaz',
    detail: undefined,
  },
  '1088': {
    description: 'Önprovizyon İptal Edilmiş',
    detail: undefined,
  },
  '1089': {
    description: 'Referans İşlem Yapılmak İstenen İşlem İçin Uygun Değil',
    detail: undefined,
  },
  '1091': {
    description: 'Recurring İşlemin Toplam Taksit Sayısı Hatalı',
    detail: undefined,
  },
  '1092': {
    description: 'Recurring İşlemin Tekrarlama Aralığı Hatalı',
    detail: undefined,
  },
  '1093': {
    description: 'Sadece Satış (Sale) İşlemi Recurring Olarak İşaretlenebilir',
    detail: undefined,
  },
  '1095': {
    description: 'Lütfen Geçerli Bir Email Adresi Giriniz',
    detail: undefined,
  },
  '1096': {
    description: 'Provizyon Talep Mesajına ClientIP Değerini Gönderiniz',
    detail: undefined,
  },
  '1097': {
    description: 'Lütfen Geçerli Bir CAVV Değeri Giriniz',
    detail: undefined,
  },
  '1098': {
    description: 'Lütfen Geçerli Bir ECI Değeri Giriniz',
    detail: undefined,
  },
  '1099': {
    description: 'Lütfen Geçerli Bir Kart Sahibi İsmi Giriniz',
    detail: undefined,
  },
  '1100': {
    description: 'Lütfen Geçerli Bir Brand Girişi Yapın',
    detail: undefined,
  },
  '1101': {
    description: 'Referans Transaction Reverse Edilmiş',
    detail: undefined,
  },
  '1102': {
    description: 'Recurring İşlem Aralığı Geçersiz',
    detail: undefined,
  },
  '1103': {
    description: 'Taksit Sayısı Girilmeli',
    detail: undefined,
  },
  '1104': {
    description: 'İzinsiz Taksitli İşlem',
    detail: undefined,
  },
  '1105': {
    description: "Üye İşyeri IP'si Sistemde Tanımlı Değil",
    detail:
      'Güvenlik nedeniyle uygulamaya gelen provizyon isteklerinde Statik IP kontrolü yapılmaktadır. Statik IP bilginizi üye işyeri numaranızla birlikte vpos724@vakifbank.com.tr adresine iletmeniz gerekmektedir.',
  },
  '1106': {
    description: 'Extract Maksimum 40 Karakter Olmalıdır',
    detail: 'Extract maksimum 40 karakter olmalıdır.',
  },
  '1107': {
    description: 'Expsign Alanının Uzunluğu Hatalı',
    detail: undefined,
  },
  '1108': {
    description: 'Mpitransactionid Alanının Uzunluğu Hatalı',
    detail: undefined,
  },
  '1109': {
    description: 'Valuelist Alanının Uzunluğu Hatalı',
    detail: undefined,
  },
  '1110': {
    description: 'Bu Üye İşyeri 3D İşlem Yapamaz',
    detail: undefined,
  },
  '1111': {
    description: 'Bu Üye İşyeri Non Secure İşlem Yapamaz',
    detail: undefined,
  },
  '1112': {
    description: 'Terminal Aktif Değil',
    detail: undefined,
  },
  '1113': {
    description: 'Terminalde Açık Reversal Bulunuyor',
    detail: undefined,
  },
  '1114': {
    description: 'Mpitransactionid Alanı Boş Gönderilmiş',
    detail: undefined,
  },
  '1115': {
    description: 'Mpitransactionid Bulunamıyor',
    detail: undefined,
  },
  '1116': {
    description: 'ECI Değeri Mp1 ile Uyumsuz',
    detail: undefined,
  },
  '1117': {
    description: 'CAVV Değeri Mp1 ile Uyumsuz',
    detail: undefined,
  },
  '1118': {
    description: '3D Secure İşlemler Mailorder Olarak Gönderilemez',
    detail: undefined,
  },
  '1119': {
    description:
      'Otomatik Gün Sonu Tanımlı Üye İşyeri Manuel Gün Sonu Yapamazlar',
    detail: undefined,
  },
  '1120': {
    description: 'Geçersiz Security Code',
    detail: undefined,
  },
  '1121': {
    description: 'Transactiondevicesource Alanının Gönderilmesi Zorunludur',
    detail: undefined,
  },
  '1122': {
    description: "Surcharge Tutarı 0'dan Büyük Olmalı",
    detail: undefined,
  },
  '1123': {
    description: 'Kayıt İade Durumda',
    detail: 'İade Edilmiş Bir Kayıt İptal Edilmeye Çalışılıyor',
  },
  '1124': {
    description: 'Kayıt İptal Durumda',
    detail: 'İptal Edilmiş Bir Kayıt İade Edilmeye Çalışılıyor',
  },
  '1125': {
    description: 'Terminal Bulunamadı',
    detail: undefined,
  },
  '1126': {
    description: 'MPI İşlemindeki Veriler ile Uyumsuz',
    detail: undefined,
  },
  '1127': {
    description:
      "3D's İşlemlerde Kart Bilgisi veya Tutar Provizyon Mesajında Yer Almamalıdır",
    detail: undefined,
  },
  '1128': {
    description: 'Mpitransactionid Daha Önce Başka Bir İşlem İçin Kullanılmış',
    detail: undefined,
  },
  '1129': {
    description: 'Express ve 3D Secure İşlem Aynı Anda Gönderilemez',
    detail: 'Express ve 3D Secure işlem aynı anda gönderilemez.',
  },
  '1130': {
    description: 'Expsign Değeri İletilen İşlem İçin ECI Değeri Geçerli Değil',
    detail: 'ExpSign değeri iletilen işlem için ECI değeri geçerli değil.',
  },
  '1131': {
    description: 'Customitems Alanının Uzunluğu Hatalı',
    detail: 'Customitems alanının uzunluğu hatalı.',
  },
  '1132': {
    description: 'İşleme Ait Kanal Bilgisine Göre, Expsign Değeri Boş Olmalı',
    detail: 'İşleme ait kanal bilgisine göre, Expsign değeri boş olmalı.',
  },
  '1133': {
    description:
      'Üye İş Yeri Yetkileri Arasında Ekstre Gönderme Yetkisi Bulunmamaktadır',
    detail: undefined,
  },
  '1134': {
    description:
      'Custom Items Name Alanının Uzunluğu Maksimum 100 Karakter Olmalı',
    detail: 'Custom Items Name Alanının Uzunluğu Maksimum 100 Karakter Olmalı',
  },
  '1135': {
    description: 'Customitem İçerisinde Tutar Hatalı',
    detail: 'Customitem İçerisinde Tutar Hatalı',
  },
  '1136': {
    description: 'Customitem İçerisinde Telefon Hatalı',
    detail: 'Customitem İçerisinde Telefon Hatalı',
  },
  '1137': {
    description: 'Customitem İçerisinde E-Posta Hatalı',
    detail: 'Customitem İçerisinde E-Posta Hatalı',
  },
  '1138': {
    description: 'Customitem İçerisinde Tip Hatalı',
    detail: 'Customitem İçerisinde Tip Hatalı',
  },
  '1139': {
    description: 'Tanımlı Customitem Hatalı CustomType',
    detail: 'Tanımlı Customitem Hatalı CustomType',
  },
  '1140': {
    description: 'Sıra Numarası Zorunlu',
    detail: 'Sıra Numarası Zorunlu',
  },
  '1141': {
    description: 'Vade Süresi(Ay) Zorunlu',
    detail: 'Vade Süresi(Ay) Zorunlu',
  },
  '1142': {
    description: 'Ödeme Sıklığı(Ay) Zorunlu',
    detail: 'Ödeme Sıklığı(Ay) Zorunlu',
  },
  '1143': {
    description: 'Öteleme Süresi(Ay) Zorunlu',
    detail: 'Öteleme Süresi(Ay) Zorunlu',
  },
  '1144': {
    description: 'Vade Ödeme Sıklığı Zorunlu',
    detail: 'Vade Ödeme Sıklığı Zorunlu',
  },
  '1145': {
    description: 'SGK Tutarı Küsüratlı Olamaz',
    detail: 'SGK Tutarı Küsüratlı Olamaz.',
  },
  '1146': {
    description: 'Ödeme Planı Bulunamadı',
    detail: 'Ödeme Planı Bulunamadı.',
  },
  '1147': {
    description:
      'Üye İş Yeri Yetkileri Arasında GİB Taksit Yetkisi Bulunmamaktadır',
    detail:
      'Üye İş Yeri Yetkileri Arasında GİB Taksit Yetkisi Bulunmamaktadır.',
  },
  '1148': {
    description:
      'Üye İş Yeri Yetkileri Arasında Tekrarlı Tahsilat Yetkisi Bulunmamaktadır',
    detail:
      'Üye İş Yeri Yetkileri Arasında Tekrarlı Tahsilat Yetkisi Bulunmamaktadır.',
  },
  '1152': {
    description:
      'Customitem İçerisindeki VFTBankReferansNo Bu İşlem Tipi İçin Geçerli Değildir',
    detail:
      'Customitem içerisindeki VFTBankReferansNo bu işlem tipi için geçerli değildir.',
  },
  '1153': {
    description: 'Üye İş Yerinin BKM Express İzni Yoktur',
    detail: 'Üye iş yerinin BKM Express izni yoktur.',
  },
  '2012': {
    description: 'Batch Bulunamadı',
    detail: 'Batch Bulunamadı.',
  },
  '2013': {
    description: 'Terminal Bulunamadı',
    detail: 'Terminal Bulunamadı.',
  },
  '2200': {
    description: 'İş Yerinin Sistem İçin Gerekli Hakkı Yok',
    detail: undefined,
  },
  '2202': {
    description: 'İşlem İptal Edilemez (Batch Kapalı)',
    detail: undefined,
  },
  '2203': {
    description:
      "Batch Kapama İsteğinden Önce Batch'e Ait SettlementQueue'daki İşlemler Tamamlanmış Olmalı",
    detail: undefined,
  },
  '4000': {
    description: 'İşlem Tipi Hatalı',
    detail: 'İşlem Tipi Hatalı',
  },
  '4001': {
    description: 'Bitiş Tarihi, Başlangıç Tarihinden Küçük Olamaz',
    detail: 'Bitiş Tarihi, Başlangıç Tarihinden Küçük Olamaz',
  },
  '4002': {
    description: 'Başlangıç Tarihi Zorunlu',
    detail: 'Başlangıç Tarihi Zorunlu',
  },
  '4003': {
    description: 'Bitiş Tarihi Zorunlu',
    detail: 'Bitiş Tarihi Zorunlu',
  },
  '4004': {
    description: 'Otorizasyon Kodu Zorunlu',
    detail: 'Otorizasyon Kodu Zorunlu',
  },
  '4005': {
    description: 'En Az Bir Sorgu Kriteri Zorunlu',
    detail: 'En Az Bir Sorgu Kriteri Zorunlu',
  },
  '4006': {
    description: 'En Az Bir Sorgu Kriteri Zorunlu',
    detail: 'En Az Bir Sorgu Kriteri Zorunlu',
  },
  '4007': {
    description: 'Arama Kriteri Hatalı',
    detail: 'Arama Kriteri Hatalı',
  },
  '4008': {
    description: 'Mutabakat Tarihi Zorunlu',
    detail: 'Mutabakat Tarihi Zorunlu',
  },
  '5000': {
    description: 'En Az 1 Sayfa İçeriği Zorunlu',
    detail: 'En Az 1 Sayfa İçeriği Zorunlu',
  },
  '5001': {
    description: 'Kimlik Doğrulama İşlemi Başarısız',
    detail:
      'İşyeri numarasının veya işyeri şifresinin veya istek yapılan URL adresinin doğruluğundan emin olunuz.',
  },
  '5002': {
    description: 'İş Yeri Aktif Değil',
    detail: undefined,
  },
  '5003': {
    description: 'Sayfanın 1 Adet Tutar Tipinde İçeriği Olmalı',
    detail: 'Sayfanın 1 Adet Tutar Tipinde İçeriği Olmalı',
  },
  '5004': {
    description: "Sayfanın 1'den Fazla Tutar Tipinde İçeriği Olamaz",
    detail: "Sayfanın 1'den Fazla Tutar Tipinde İçeriği Olamaz",
  },
  '5005': {
    description: 'Tutar Tipindeki Sayfa İçeriğinde Para Birimi Zorunlu',
    detail: 'Tutar Tipindeki Sayfa İçeriğinde Para Birimi Zorunlu',
  },
  '5006': {
    description: 'Sayfa İçerik Başlığı Zorunlu',
    detail: 'Sayfa İçerik Başlığı Zorunlu',
  },
  '5007': {
    description: 'Sayfa İçeriği Hatalı',
    detail: 'Sayfa İçeriği Hatalı',
  },
  '5008': {
    description: 'Bağış Sayfası İçerik Etiket Uzunluğu Hatalı',
    detail: undefined,
  },
  '5009': {
    description: 'Bağış Sayfası İçerik Etiket Değer Uzunluğu Hatalı',
    detail: undefined,
  },
  '5010': {
    description: 'Girilen Değer 200 Karakteri Geçmemeli',
    detail: undefined,
  },
  '5011': {
    description:
      'Dikkate Alınacak Tutar Alanı Seçiliyse, Para Birimi de Seçilebilmelidir',
    detail: undefined,
  },
  '5012': {
    description:
      'Dikkate Alınacak Tutar Alanı Seçiliyse, Dikkate Alınacak Adet Alanı Seçilmemelidir',
    detail: undefined,
  },
  '5013': {
    description:
      'Dikkate Alınacak Tutar Alanı Seçiliyse, Giriş Zorunlu Olmalıdır',
    detail: undefined,
  },
  '5014': {
    description:
      'Dikkate Alınacak Adet Alanı Seçiliyse, Para Birimi Seçilmemelidir',
    detail: undefined,
  },
  '5015': {
    description:
      'Dikkate Alınacak Adet Alanı Seçiliyse, Giriş Zorunlu Olmalıdır',
    detail: undefined,
  },
  '5016': {
    description: 'Değer Başlık Alanı Boş Bırakılamaz',
    detail: undefined,
  },
  '5017': {
    description: "Sayfanın 1'den Fazla Adet Tipinde İçeriği Olamaz",
    detail: undefined,
  },
  '5018': {
    description:
      'İçerik Tipi Liste Yada Radyo Butonu Olan İçeriklere İçerik Değeri Atanabilir',
    detail: undefined,
  },
  '6000': {
    description: 'Merchant Isactive Field Is Invalid',
    detail: undefined,
  },
  '6001': {
    description: 'Merchant Contactaddressline1 Length Is Invalid',
    detail: undefined,
  },
  '6002': {
    description: 'Merchant Contactaddressline2 Length Is Invalid',
    detail: undefined,
  },
  '6003': {
    description: 'Merchant Contactcitylength Is Invalid',
    detail: undefined,
  },
  '6004': {
    description: 'Merchant Contactemail Must Be Valid Email',
    detail: undefined,
  },
  '6005': {
    description: 'Merchant Contactemail Length Is Invalid',
    detail: undefined,
  },
  '6006': {
    description: 'Merchant Contactname Length Is Invalid',
    detail: undefined,
  },
  '6007': {
    description: 'Merchant Contactphone Length Is Invalid',
    detail: undefined,
  },
  '6008': {
    description: 'Merchant Hostmerchantid Length Is Invalid',
    detail: undefined,
  },
  '6009': {
    description: 'Merchant Hostmerchantid Is Empty',
    detail: undefined,
  },
  '6010': {
    description: 'Merchant Merchantname Length Is Invalid',
    detail: undefined,
  },
  '6011': {
    description: 'Merchant Merchantpassword Length Is Invalid',
    detail: undefined,
  },
  '6012': {
    description: 'Terminalinfo Hostterminalid Is Invalid',
    detail: undefined,
  },
  '6013': {
    description: 'Terminalinfo Hostterminalid Length Is Invalid',
    detail: undefined,
  },
  '6014': {
    description: 'Terminalinfo Hostterminalid Is Empty',
    detail: undefined,
  },
  '6015': {
    description: 'Terminalinfo Terminalname Is Invalid',
    detail: undefined,
  },
  '6016': {
    description: 'Üye İşyeri Departmanı Hatalı',
    detail: 'Üye İşyeri Departmanı Hatalı',
  },
  '6017': {
    description: 'Üye İşyeri Departman No Hatalı',
    detail: 'Üye İşyeri Departman No Hatalı',
  },
  '6018': {
    description: 'Merchant Not Found',
    detail: undefined,
  },
  '6019': {
    description: 'Invalidrequest',
    detail: undefined,
  },
  '6020': {
    description: 'Birim Zaten Mevcut',
    detail: 'Birim Zaten Mevcut',
  },
  '6021': {
    description: 'Birim Bulunamadı',
    detail: 'Birim Bulunamadı',
  },
  '6022': {
    description: 'Transaction Type Exist In Merchant Permission',
    detail: undefined,
  },
  '6023': {
    description: 'Merchant Permission Exist In Merchant',
    detail: undefined,
  },
  '6024': {
    description: 'Currency Code Exist In Merchant Currency Codes Permission',
    detail: undefined,
  },
  '6025': {
    description: 'Terminal Exist In Merchantterminals',
    detail: undefined,
  },
  '6026': {
    description: 'Terminal Can Not Be Found In Merchantterminals',
    detail: undefined,
  },
  '6027': {
    description:
      'Invalid Login Attempt. Please Check ClientId And Clientpassword Fields',
    detail: undefined,
  },
  '6028': {
    description: 'Merchant Is Already Exist. You Should Try To Update Method',
    detail: undefined,
  },
  '6029': {
    description: 'Üye İşyeri Eposta Hatalı',
    detail: 'Üye İşyeri Eposta Hatalı',
  },
  '6030': {
    description: 'Üye İşyeri Web Adresi Hatalı',
    detail: 'Üye İşyeri Web Adresi Hatalı',
  },
  '6031': {
    description: 'Otomatik Günsonu Zamanı Zorunlu',
    detail: 'Otomatik Günsonu Zamanı Zorunlu',
  },
  '6032': {
    description: 'Otomatik Günsonu Zamanı Hatalı',
    detail: 'Otomatik Günsonu Zamanı Hatalı',
  },
  '6033': {
    description: '3D Üye İşyeri Tipi Hatalı',
    detail: '3D Üye İşyeri Tipi Hatalı',
  },
  '6034': {
    description: 'Parenthostmerchantid Dolu Olmamalıdır',
    detail: 'ParentHostMerchantId dolu olmamalıdır.',
  },
  '6035': {
    description: 'Parenthostmerchantid Dolu Olmalıdır',
    detail: 'ParentHostMerchantId dolu olmalıdır.',
  },
  '6036': {
    description: 'Yalnızca Ana Bayi, Alt Bayi İşlemlerini Görebilir',
    detail: 'Yalnızca Ana Bayi, Alt Bayi İşlemlerini Görebilir.',
  },
  '6037': {
    description: 'Ana Bayi Sistemde Tanımlı Değil',
    detail: 'Ana Bayi Sistemde Tanımlı Değil.',
  },
  '6038': {
    description:
      "Alt Bayi Olan Bir İşyeri Başka Bir İşyerinin Parenthostmerchantid'si Olamaz",
    detail:
      "Alt Bayi Olan Bir İşyeri Başka Bir İşyerinin ParentHostMerchantId'si Olamaz.",
  },
  '6039': {
    description: 'TCKN veya VKN Alanları Dolu Olmalıdır',
    detail: 'TCKN veya VKN alanları dolu olmalıdır.',
  },
  '6040': {
    description: "Aynı TCKN'ye Sahip Sadece Bir Üye İşyeri Olabilir",
    detail: "Aynı TCKN'ye Sahip Sadece Bir Üye İşyeri Olabilir.",
  },
  '6041': {
    description: "Aynı VKN'ye Sahip Sadece Bir Üye İşyeri Olabilir",
    detail: "Aynı VKN'ye Sahip Sadece Bir Üye İşyeri Olabilir.",
  },
  '6042': {
    description: 'TCKN 11 Hane Olmalı',
    detail: 'TCKN 11 Hane Olmalı.',
  },
  '6043': {
    description: 'TCKN Numerik Olmalıdır',
    detail: 'TCKN Numerik Olmalıdır.',
  },
  '6044': {
    description: 'VKN 10 Hane Olmalıdır',
    detail: 'VKN 10 Hane Olmalıdır.',
  },
  '6045': {
    description: 'VKN Numerik Olmalıdır',
    detail: 'VKN Numerik Olmalıdır.',
  },
  '6046': {
    description: 'TCKN ve VKN 10 veya 11 Hane Olmalıdır',
    detail: 'TCKN ve VKN 10 veya 11 Hane olmalıdır.',
  },
  '6047': {
    description: 'TCKN ve VKN Alanı Boş Olamaz',
    detail: 'TCKN ve VKN alanı boş olamaz.',
  },
  '6048': {
    description: 'VKN ve TCKN Boş Olmalıdır',
    detail: 'VKN ve TCKN boş olmalıdır.',
  },
  '6049': {
    description: 'MerchantID Boş Olmalıdır',
    detail: 'MerchantID Boş olmalıdır.',
  },
  '6050': {
    description: 'MerchantID Boş Olamaz',
    detail: 'MerchantID Boş olamaz.',
  },
  '6051': {
    description: 'Parent Hostmerchant Ana Bayi Olmalıdır',
    detail: 'Parent HostMerchant Ana Bayi Olmalıdır.',
  },
  '6052': {
    description: 'Kullanıcının Onaylama Yetkisi Yok',
    detail: 'Kullanıcının Onaylama Yetkisi Yok.',
  },
  '6053': {
    description: 'Üye İş Yerinin Vade ve Ödeme Sıklığı Tekil Olmalıdır',
    detail: 'Üye İş Yerinin Vade ve Ödeme Sıklığı Tekil Olmalıdır.',
  },
  '6054': {
    description: 'Ödeme Sıklığı Numerik Olmalı',
    detail: 'Ödeme Sıklığı Numerik Olmalı.',
  },
  '6055': {
    description: 'Vade Süresi Numerik Olmalı',
    detail: 'Vade Süresi Numerik Olmalı.',
  },
  '6056': {
    description: 'Sıra Numarası Numerik Olmalı',
    detail: 'Sıra Numarası Numerik Olmalı.',
  },
  '6057': {
    description: 'Öteleme Süresi Numerik Olmalı',
    detail: 'Öteleme Süresi Numerik Olmalı.',
  },
  '6058': {
    description: 'Ödeme Sıklığı Zorunlu',
    detail: 'Ödeme Sıklığı Zorunlu.',
  },
  '6059': {
    description: 'Vade Süresi Zorunlu',
    detail: 'Vade Süresi Zorunlu.',
  },
  '6060': {
    description: 'Sıra Numarası Zorunlu',
    detail: 'Sıra Numarası Zorunlu.',
  },
  '6061': {
    description: 'Öteleme Süresi Zorunlu',
    detail: 'Öteleme Süresi Zorunlu.',
  },
  '6063': {
    description: 'Ana Bayi, Alt Bayi İlişkisi Bulunmuyor',
    detail: 'Ana Bayi, Alt Bayi İlişkisi Bulunmuyor.',
  },
  '6064': {
    description: 'HostmerchantID Veri Uzunluğu Geçersiz',
    detail: 'HostMerchantID veri uzunluğu geçersiz.',
  },
  '6065': {
    description: 'HostsubmerchantID Veri Uzunluğu Geçersiz',
    detail: 'HostSubMerchantID veri uzunluğu geçersiz.',
  },
  '6066': {
    description: 'HostsubmerchantID Boş Olamaz',
    detail: 'HostSubMerchantID Boş Olamaz.',
  },
  '6067': {
    description: 'HostsubmerchantID Değeri Boş Olmamalıdır',
    detail: 'HostSubMerchantID Değeri Boş Olmamalıdır.',
  },
  '7777': {
    description:
      'Banka Tarafında Gün Sonu Yapıldığından İşlem Gerçekleştirilemedi',
    detail: undefined,
  },
  '9000': {
    description: 'İşlem Yükleme Limit Aşıldı',
    detail: undefined,
  },
  '9001': {
    description: 'İşlem Yükleme Limit Aşıldı',
    detail: undefined,
  },
  '9025': {
    description: 'Hatalı İstek',
    detail: 'Hatalı istek.',
  },
  '9026': {
    description: 'İstek Bilgisi Hatalı',
    detail: 'İstek bilgisi hatalı.',
  },
  '9027': {
    description: 'Kullanıcı Adı veya Şifre Yanlış',
    detail: 'Kullanıcı adı veya şifre yanlış.',
  },
  '9028': {
    description: 'Rol Bulunamadı',
    detail: 'Rol bulunamadı.',
  },
  '9029': {
    description: 'Rol Adı Boş Bırakılamaz',
    detail: 'Rol adı boş bırakılamaz.',
  },
  '9030': {
    description: 'Rol İçerisinde Tanımlı User Varken Silemezsiniz',
    detail: 'Rol içerisinde tanımlı user varken silemezsiniz.',
  },
  '9031': {
    description: 'Kullanıcı Adı veya Şifre Yanlış',
    detail: 'Kullanıcı adı veya şifre yanlış.',
  },
  '9032': {
    description: 'Kullanıcı Pasif',
    detail: 'Kullanıcı Pasif.',
  },
  '9033': {
    description: 'Kullanıcı Silinmiş',
    detail: 'Kullanıcı Silinmiş.',
  },
  '9034': {
    description: 'Üye İşyeri Yöneticisi Kullanıcısı Bulunuyor',
    detail: 'Üye İşyeri Yöneticisi Kullanıcısı Bulunuyor.',
  },
  '9035': {
    description: 'Üye İşyerine Ait Bir Yönetici Rolü Bulunuyor',
    detail: 'Üye İşyerine ait bir yönetici rolü bulunuyor.',
  },
  '9036': {
    description: 'Bloklanmış Kullanıcı',
    detail: 'Bloklanmış Kullanıcı.',
  },
  '9037': {
    description: 'Kullanıcının Şifre Süresi Dolmuş',
    detail: 'Kullanıcının şifre süresi dolmuş.',
  },
  '9038': {
    description: 'Yeni Şifre Eski Şifreyle Aynı Olamaz',
    detail: 'Yeni Şifre Eski Şifreyle Aynı Olamaz.',
  },
  '9039': {
    description: 'Üye İşyeri Bulunamadı',
    detail: undefined,
  },
  '9041': {
    description:
      'Üye İşyeri Tanimlanabilecek Maksimum Web Sitesi Sayısına Ulaştınız',
    detail:
      'Üye İşyeri Tanimlanabilecek Maksimum Web Sitesi Sayısına Ulaştınız.',
  },
  '9042': {
    description:
      'Üye İşyerinin 1 Adet Ekstre Tipinde E-Postası Olmak Zorundadır',
    detail: 'Üye İşyerinin 1 Adet Ekstre Tipinde E-Postası Olmak Zorundadır.',
  },
  '9043': {
    description:
      'Üye İşyerine Tanımlanabilecek Maksimum E-Posta Sayısına Ulaştınız',
    detail:
      'Üye İşyerine Tanımlanabilecek Maksimum E-Posta Sayısına Ulaştınız.',
  },
  '9044': {
    description:
      'Üye İşyerinin Sadece 1 Adet Ekstre Tipinde E-Postası Olabilir',
    detail: 'Üye İşyerinin Sadece 1 Adet Ekstre Tipinde E-Postası Olabilir.',
  },
  '9045': {
    description: 'Üye İşyeri E-Posta Adreslerinin E-Posta Tipi Değiştirilemez',
    detail: 'Üye İşyeri E-Posta Adreslerinin E-Posta Tipi Değiştirilemez.',
  },
  '9046': {
    description: 'IP Tipi Bulunamadı',
    detail: 'IP Tipi Bulunamadı.',
  },
  '9047': {
    description: 'IP Hatalıdır',
    detail: 'IP Hatalıdır.',
  },
  '9048': {
    description: 'IP Aralık Sonu Hatalıdır',
    detail: 'IP Aralık Sonu Hatalıdır.',
  },
  '9049': {
    description: 'Banka Bulunamadı',
    detail: 'Banka Bulunamadı.',
  },
  '9050': {
    description: 'Kart Sağlayıcı Alanı Zorunlu',
    detail: 'Kart Sağlayıcı Alanı Zorunlu.',
  },
  '9051': {
    description: 'Bin Boş Bırakılamaz',
    detail: 'Bin Boş Bırakılamaz.',
  },
  '9052': {
    description: 'Bin 6 Karakter Olmalı',
    detail: 'Bin 6 Karakter Olmalı.',
  },
  '9053': {
    description: 'Kart Tipi Boş Bırakılamaz',
    detail: 'Kart Tipi Boş Bırakılamaz.',
  },
  '9054': {
    description: 'Bin Kaydı Zaten Mevcut',
    detail: 'Bin Kaydı Zaten Mevcut.',
  },
  '9055': {
    description: 'Bankaya Ait Bin Bulunamıyor',
    detail: 'Bankaya Ait Bin Bulunamıyor.',
  },
  '9056': {
    description: 'Dosya Boş',
    detail: 'Dosya Boş.',
  },
  '9057': {
    description: 'Zaman 4 Aydan Büyük Olamaz',
    detail: 'Zaman 4 Aydan Büyük Olamaz.',
  },
  '9058': {
    description: 'Tutar Hatalı',
    detail: 'Tutar Hatalı.',
  },
  '9059': {
    description: 'Para Birimi Hatalı',
    detail: 'Para Birimi Hatalı.',
  },
  '9060': {
    description: 'Kredi Kartı Numarası Hatalı',
    detail: 'Kredi Kartı Numarası Hatalı.',
  },
  '9061': {
    description: 'CVV2 Hatalı',
    detail: 'CVV2 Hatalı.',
  },
  '9062': {
    description: 'Brand Hatalı',
    detail: 'Brand Hatalı.',
  },
  '9063': {
    description: 'Son Kullanma Tarihi Hatalı',
    detail: 'Son Kullanma Tarihi Hatalı.',
  },
  '9064': {
    description: 'Referans Transaction Numarası Hatalı',
    detail: 'Referans Transaction Numarası Hatalı.',
  },
  '9065': {
    description: 'Üye İşyeri Bulunamadı',
    detail: 'Üye İşyeri Bulunamadı.',
  },
  '9066': {
    description: 'Üye İşyeri Pasif',
    detail: 'Üye İşyeri Pasif.',
  },
  '9067': {
    description: 'Transaction Numarası Hatalı',
    detail: 'Transaction Numarası Hatalı.',
  },
  '9068': {
    description: 'Sipariş Numarası Hatalı',
    detail: 'Sipariş Numarası Hatalı.',
  },
  '9069': {
    description: 'Sipariş Açıklaması Hatalı',
    detail: 'Sipariş Açıklaması Hatalı.',
  },
  '9070': {
    description: 'IP Adresi Hatalı',
    detail: 'IP Adresi Hatalı.',
  },
  '9071': {
    description: 'Kart Sahibi Hatalı',
    detail: 'Kart Sahibi Hatalı.',
  },
  '9072': {
    description: 'Referans İşlem İade Edilmiştir',
    detail: 'Referans İşlem İade Edilmiştir.',
  },
  '9073': {
    description: 'Ön Provizyon İptal Edilmiş',
    detail: 'Ön Provizyon İptal Edilmiş.',
  },
  '9074': {
    description: 'İşlem Teknik Sebeplerden Dolayı İptal Edilmiş',
    detail: 'İşlem Teknik Sebeplerden Dolayı İptal Edilmiş.',
  },
  '9075': {
    description: 'Referans İşlem Geçersiz',
    detail: 'Referans İşlem Geçersiz.',
  },
  '9076': {
    description: 'Puan ile Satışta Taksit Sayısı Gönderilemez',
    detail: 'Puan ile Satışta Taksit Sayısı Gönderilemez.',
  },
  '9077': {
    description: 'İşlem Zaten İade Edilmiş',
    detail: 'İşlem Zaten İade Edilmiş.',
  },
  '9078': {
    description: 'İşlem Zaten İptal Edilmiş',
    detail: 'İşlem Zaten İptal Edilmiş.',
  },
  '9079': {
    description: 'Geçersiz İade Tutarı',
    detail: 'Geçersiz İade Tutarı.',
  },
  '9080': {
    description: 'Puan Tutarı Hatalı',
    detail: 'Puan Tutarı Hatalı.',
  },
  '9081': {
    description: 'Terminal Bulunamadı',
    detail: 'Terminal Bulunamadı.',
  },
  '9083': {
    description: 'Kullanıcı LDAP Bilgileri Hatalı',
    detail: 'Kullanıcı LDAP Bilgileri Hatalı.',
  },
  '9084': {
    description: 'Tek Kullanımlık Şifre Girişi Yapılmalıdır',
    detail: 'Tek Kullanımlık Şifre Girişi Yapılmalıdır.',
  },
  '9085': {
    description: 'Kullanıcı LDAP Sisteminde Bulunamadı',
    detail: 'Kullanıcı LDAP Sisteminde Bulunamadı.',
  },
  '9086': {
    description: 'Tek Kullanımlık Şifre Bulunamadı',
    detail: 'Tek Kullanımlık Şifre Bulunamadı.',
  },
  '9087': {
    description: 'Girilen Tek Kullanımlık Şifre Yanlış',
    detail: 'Girilen Tek Kullanımlık Şifre Yanlış.',
  },
  '9088': {
    description: 'Tek Kullanımlık Şifrenin Süresi Doldu',
    detail: 'Tek Kullanımlık Şifrenin Süresi Doldu.',
  },
  '9089': {
    description: 'Mesaj Servisi Hata Aldı',
    detail: 'Mesaj Servisi Hata Aldı.',
  },
  '9090': {
    description: 'Hatalı Kullanıcı E-Posta',
    detail: 'Hatalı Kullanıcı E-Posta.',
  },
  '9091': {
    description: 'Puan Kodu Zorunlu',
    detail: 'Puan Kodu Zorunlu.',
  },
  '9092': {
    description: 'Hatalı E-Posta Tipi',
    detail: 'Hatalı E-Posta Tipi.',
  },
  '9093': {
    description:
      'Rol Pasif Yapılamaz. Bu Role Sahip Aktif Kullanıcılar Bulunmaktadır',
    detail:
      'Rol pasif yapılamaz. Bu role sahip aktif kullanıcılar bulunmaktadır.',
  },
  '9094': {
    description: 'Kullanıcı Rolü Aktif Değil Ya Da Silinmiş',
    detail: 'Kullanıcı rolü aktif değil ya da silinmiş.',
  },
  '9095': {
    description:
      'Üye İşyeri Yönetici Rolü Eklemek İçin Üye İşyeri Seçmelisiniz',
    detail: 'Üye işyeri yönetici rolü eklemek için üye işyeri seçmelisiniz.',
  },
  '9097': {
    description: 'Geçersiz Müşteri Bilgisi',
    detail: 'Geçersiz müşteri bilgisi.',
  },
  '9098': {
    description: 'Geçersiz İşlem Tarihi',
    detail: 'Geçersiz işlem tarihi.',
  },
  '9099': {
    description: 'Geçersiz İşlem Tipi',
    detail: 'Geçersiz işlem tipi.',
  },
  '9100': {
    description: 'Geçersiz Tekrar Sayısı',
    detail: 'Geçersiz tekrar sayısı.',
  },
  '9101': {
    description: 'Geçersiz Tekrarlama Aralığı',
    detail: 'Geçersiz tekrarlama aralığı.',
  },
  '9102': {
    description: 'Geçersiz Periyot Tipi',
    detail: 'Geçersiz periyot tipi.',
  },
  '9103': {
    description: 'Kaydın Statüsü Bu İşlem İçin Uygun Değil',
    detail: 'Kaydın statüsü bu işlem için uygun değil.',
  },
  '9104': {
    description: 'City Information Is Not Found',
    detail: 'City Information Is Not Found.',
  },
  '9105': {
    description: 'Town Information Is Not Found',
    detail: 'Town Information Is Not Found.',
  },
  '9106': {
    description: 'Customer Name Information Is Not Found',
    detail: 'Customer Name Information Is Not Found.',
  },
  '9107': {
    description: 'Customer Surname Information Is Not Found',
    detail: 'Customer Surname Information Is Not Found.',
  },
  '9108': {
    description: 'Invalid Customer Number',
    detail: 'Invalid Customer Number.',
  },
  '9109': {
    description: 'Invalid Customer Email Information',
    detail: 'Invalid Customer Email Information.',
  },
  '9110': {
    description: 'Bu Müşteri Numarasına Sahip Zaten Bir Müşteri Mevcut',
    detail: 'Bu müşteri numarasına sahip zaten bir müşteri mevcut.',
  },
  '9111': {
    description:
      'Role Atanan Üye İşyeri Numarası ile Kullanıcıya Atanan Numara Eşleşmiyor',
    detail:
      'Role atanan üye işyeri numarası ile kullanıcıya atanan numara eşleşmiyor.',
  },
  '9112': {
    description: 'İşlem Numarası Zaten Mevcut',
    detail: 'İşlem numarası zaten mevcut.',
  },
  '9113': {
    description: 'Tekrarlama Aralığı Değeri Boş Bırakılamaz',
    detail: 'Tekrarlama aralığı değeri boş bırakılamaz.',
  },
  '9114': {
    description: 'PanCode Zorunlu',
    detail: 'PanCode Zorunlu.',
  },
  '9115': {
    description: 'PanCode Zaten Mevcut',
    detail: 'PanCode Zaten Mevcut.',
  },
  '9116': {
    description: 'Müşteri Ad-Soyad Uzunluğu Hatalı',
    detail: 'Müşteri Ad-Soyad Uzunluğu Hatalı.',
  },
  '9117': {
    description: '3D Secure İşlemlerde ECI Değeri Boş Olamaz',
    detail: '3D Secure İşlemlerde ECI değeri boş olamaz.',
  },
  '9118': {
    description: 'Bu Batch Daha Önce Kapatılmıştır',
    detail: 'Bu batch daha önce kapatılmıştır.',
  },
  '9121': {
    description: 'Lütfen Geçerli Bir Ay Giriniz',
    detail: 'Lütfen geçerli bir ay giriniz.',
  },
  '9122': {
    description: 'Lütfen Geçerli Bir Yıl Giriniz',
    detail: 'Lütfen geçerli bir yıl giriniz.',
  },
  '9200': {
    description: 'Gib Taksit Yetkisi Sadece Gib Üye İşyerlerine Verilebilir',
    detail: 'Gib Taksit Yetkisi Sadece Gib Üye İşyerlerine Verilebilir.',
  },
  '9201': {
    description: 'Girilen Üye İş Yeri Numarası Zaten Sisteme Kayıtlıdır',
    detail: 'Girilen üye işyeri numarası zaten sisteme kayıtlıdır.',
  },
  '9553': {
    description: 'Response Kodu Boş',
    detail: 'Response Kodu Boş.',
  },
  '9578': {
    description: 'Client Request Id Boş',
    detail: 'Client Request Id Boş.',
  },
  '9579': {
    description: 'Client Request Id Çok Uzun',
    detail: 'Client Request Id Çok Uzun.',
  },
  '9580': {
    description: 'Client Id Boş',
    detail: 'Client Id Boş.',
  },
  '9581': {
    description: 'Client Şifre Boş',
    detail: 'Client Şifre Boş.',
  },
  '9582': {
    description: 'Client Şifre Çok Uzun',
    detail: 'Client Şifre Çok Uzun.',
  },
  '9583': {
    description: 'Client Request Zamanı Boş',
    detail: 'Client Request Zamanı Boş.',
  },
  '9587': {
    description: 'Client Id ya da Şifre Hatalı',
    detail: 'Client Id ya da Şifre Hatalı.',
  },
  '9595': {
    description: 'Kayıt Zaten Mevcut',
    detail: 'Kayıt Zaten Mevcut.',
  },
  '9601': {
    description: 'Kayıt Bulunamadı',
    detail: 'Kayıt bulunamadı.',
  },
  '9602': {
    description: 'Yeni Kayıt Silinmiş Olamaz',
    detail: undefined,
  },
  '9603': {
    description: 'Kayıt Bilgisi Boş Olamaz',
    detail: undefined,
  },
  '9612': {
    description: 'Sayfa No En Az 1 Olabilir',
    detail: 'Sayfa No En Az 1 Olabilir.',
  },
  '9614': {
    description: 'Sayfadaki Kayıt Sayısı En Az 1 Olabilir',
    detail: 'Sayfadaki Kayıt Sayısı En Az 1 Olabilir.',
  },
  '9615': {
    description: 'En Fazla 50 Kayıt Listelenebilir',
    detail: 'En Fazla 50 Kayıt Listelenebilir.',
  },
  '9993': {
    description: 'URL Formatı Yanlış',
    detail: 'URL Formatı Yanlış.',
  },
  '9994': {
    description: 'Doküman Başlığı Formatı Yanlış',
    detail: 'Doküman Başlığı Formatı Yanlış.',
  },
  '9995': {
    description: 'Dil Kodu Bilinmiyor',
    detail: 'Dil Kodu Bilinmiyor.',
  },
  '9996': {
    description: 'Geçersiz Doküman',
    detail: undefined,
  },
  '9997': {
    description: 'URL Bulunamadı',
    detail: undefined,
  },
  '9998': {
    description: 'Doküman Başlığı Bulunamadı',
    detail: undefined,
  },
  '9999': {
    description: 'Doküman Açıklaması Bulunamadı',
    detail: undefined,
  },
};
