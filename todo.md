[x] Add up status columns for Order and Tickets (PUSCHASED, CANCELLED)  
[ ] Write cancellation logic for Bus tickets with PNR  
[ ] Cancel Bus Ticket is any case of failure in the code.  
[x] Decide on how to process with plane payments. Creating tickets, order and Transaction  
[x] Finish up the whole flow with plane tickets
[ ] Add up Biletim ServiceFee to the trip response

[ ] Integrate Garanti Payment

[ ] Sell tickets with the saved cards

[ ] Update user to verifiations relationship to many-to-one. - **Selver** -> this is needed for ticket cancellation via verification. (Users will receive a text message with a verification code to cancellation)  
[ ] Integrate BullJs with redis for async operations - **Selver**  
[ ] Integrate SMS handling logic - **Selver**  
[ ] Create an event for sending ticket emails and text messages  
[ ] Build up a module to generate PDF files with headless browser - **Nuri**

[ ] Integrate Biletim Guvende API - **Emre**  
[ ] Integrate Seyahet Sigortasi API - **Emre**
[ ] Analyze Hotel dump data to identify which data is usefull in our case - **Emre**

[ ] Unique ticket check - Sayın acentemiz, otobüs seferleri için "SeferTakipNo" (trip tracking number), uçak seferleri için "SeferNo" (flightNumber) parametrelerini kullanabilirsiniz. Yolcu bilgilerinden; TC kimlik numarası, TC kimlik numarası mevcut değilse Pasaport numarası ve Ad-Soyad (Tam Ad) değerleri için kontrol sağlayabilirsiniz. İyi çalışmalar dileriz.
