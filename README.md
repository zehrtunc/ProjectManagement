# 🗂️ Project Management Web Application

Bu proje, **ASP.NET Core MVC** mimarisi kullanılarak geliştirilmiş, kullanıcıların görevlerini kolayca yönetebileceği modern bir **Proje Yönetim Sistemi**dir. Arayüzde **jKanban** ile esnek ve sezgisel bir kart sistemi sağlanmıştır.

---

## 🚀 Özellikler

✅ Dinamik Kanban Board  
✅ Görev Ekleme / Güncelleme / Silme  
✅ Sürükle Bırak ile Kolay Taşıma  
✅ Görev Detaylarını Düzenleme Pop-up’ı  
✅ Mobil ve Masaüstü Uyumlu Tasarım  
✅ Dark / Light Mod Desteği  
✅ SQL Server Veritabanı Entegrasyonu  

---

## 🛠️ Kullanılan Teknolojiler

- **Backend:** ASP.NET Core MVC (.NET 8)
- **Frontend:** HTML, CSS, JavaScript, jQuery, jKanban
- **Database:** SQL Server
- **Design:** Bootstrap 5, Tailwind CSS (opsiyonel)
- **Diğer:** Entity Framework Core, ViewComponent, PartialView

---

## 📷 Ekran Görüntüleri

| Kanban Board | Görev Ekleme Popup |
|--------------|--------------------|
| ![Kanban](images/screenshots/Kanban.png) | ![Popup](images/screenshots/Add_Task_popup.png) |

---

## ⚡ Kurulum

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1. Repoyu klonlayın:
    ```bash
    https://github.com/zehrtunc/ProjectManagement.git
    ```

2. Proje klasörüne girin:
    ```bash
    cd ProjectManagement
    ```

3. Gerekli NuGet paketlerini yükleyin:
    ```bash
    dotnet restore
    ```

4. `appsettings.json` dosyasındaki veritabanı bağlantı ayarlarını güncelleyin.

5. Migration ekleyip veritabanını oluşturun:
    ```bash
    dotnet ef migrations add InitialCreate
    dotnet ef database update
    ```

6. Uygulamayı başlatın:
    ```bash
    dotnet run
    ```

7. Tarayıcıdan projeyi görüntüleyin:
    ```
    https://localhost:7080
    ```

---

## 👨‍💻 Katkıda Bulunma

Katkı sağlamak isterseniz lütfen bir **Issue** oluşturun veya direkt **Pull Request** gönderin. Her türlü geri bildirim ve öneriye açığım.

---

## 📩 İletişim

Eğer sorularınız olursa bana ulaşabilirsiniz:

- E-posta: [zehrtunc@gmail.com](mailto:zehrtunc@gmail.com)
- LinkedIn: [linkedin.com/in/zehra-tunc](https://linkedin.com/in/zehra-tunc)

---

## 📝 Lisans

Bu proje **MIT Lisansı** altında paylaşılmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

---
