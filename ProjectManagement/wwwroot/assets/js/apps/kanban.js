"use strict";

var kanban; // Global değişken

// ? **Kanban Board'a Yeni Kart Ekle (Global)**
function addCardToKanban(card) {
    let boardId = "";

    switch (card.status) {
        case 0:
            boardId = "_open";
            break;
        case 1:
            boardId = "_in_progress";
            break;
        case 2:
            boardId = "_testing";
            break;
        case 3:
            boardId = "_completed";
            break;
        default:
            console.error("Tanımlanmamış Statü");
    }

    // jKanban kütüphanesini kullanarak belirli bir Kanban sütununa yeni bir kart (task) ekle
    kanban.addElement(boardId, {
        id: `${card.id}`,
        title: createCardHTML(card)
    });
}

function titleTemplate(title, count, optionIcon = "more-h") {
    return `
        <div class="kanban-title-content">
            <h6 class="title">${title}</h6>
            <span class="badge badge-pill badge-outline-light text-dark">${count}</span>
        </div>
        <div class="kanban-title-content">
            <div class="dropdown">
                <a href="#" class="dropdown-toggle btn btn-sm btn-icon btn-trigger mr-n1" data-toggle="dropdown">
                    <em class="icon ni ni-${optionIcon}"></em>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <ul class="link-list-opt no-bdr">
                        <li><a href="#"><em class="icon ni ni-edit"></em><span>Edit Board</span></a></li>
                        <li><a href="#"><em class="icon ni ni-plus-sm"></em><span>Add Task</span></a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// ? **Kanban Board'u Başlat**
function initKanban() {
    kanban = new jKanban({ // jKanban kütüphanesi tarafından oluşturulan Kanban board nesnesi
        element: '#kanban',
        gutter: '0',
        widthBoard: '320px',
        boards: [
            { id: '_open', title: titleTemplate("Open", "0"), class: 'kanban-light', item: [] },
            { id: '_in_progress', title: titleTemplate("In Progress", "0"), class: 'kanban-primary', item: [] },
            { id: '_testing', title: titleTemplate("Testing", "0"), class: 'kanban-warning', item: [] },
            { id: '_completed', title: titleTemplate("Completed", "0"), class: 'kanban-success', item: [] }
        ],

        // Kart sürüklenmeye başladığında eski board ID'sini kaydet
        dragEl: function (el) {
            let oldBoard = el.parentElement.closest(".kanban-board"); // Gerçek board'u bul
            if (oldBoard) {
                el.dataset.oldBoard = oldBoard.dataset.id; // Eski board ID'sini kaydet
                console.log("Kart sürükleniyor...");
                console.log("Kaynak board ID:", el.dataset.oldBoard);
            } else {
                console.error("Kaynak board bulunamadı!");
            }
        },

        // Kart bırakıldığında yeni board ID'sini al ve logla
        dropEl: function (el, target, source) {
            console.log("Kart bırakıldı...");

            // Kartın ID'sini data-eid attribute'undan alıyoruz.
            let cardId = el.dataset.eid;
            let oldBoardId = el.dataset.oldBoard; // Eski board ID'si
            let newBoardId = target.parentElement.dataset.id; // Yeni board ID'sini al

            console.log(`Kart ${cardId} ${oldBoardId} board'undan ${newBoardId} board'una taşındı.`);

            let cardStatus;

            switch (newBoardId) {
                case "_open":
                    cardStatus = 0;
                    break;
                case "_in_progress":
                    cardStatus = 1;
                    break;
                case "_testing":
                    cardStatus = 2;
                    break;
                case "_completed":
                    cardStatus = 3;
                    break;
                default:
                    console.error("Tanımlanmamış Card");
            }

            postCardStatusUpdate(cardId, cardStatus, oldBoardId);
        }
    });

    //$(".kanban-board").append('<button class="kanban-add-task btn btn-block"><em class="icon ni ni-plus-sm"></em><span>Add another task</span></button>');

    // Sayfa yüklendiğinde mevcut taskları getir
    fetchTasks();
}

// ? **Yeni Kartın HTML Şablonu**

function createCardHTML(card) {
    return `
        <div class="">
            <!-- Oluşturulma Tarihi -->
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div>
                    <div class="kanban-item-label">Oluşturulma Tarihi</div>
                    <div class="d-flex align-items-center">
                        <em class="icon ni ni-calendar"></em>
                        <span class="ml-1">${new Date(card.createDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="user-avatar sm">
                    <span >${card.createdByAvatar}</span>
                </div>
            </div>

            <div class="kanban-item-title">
                <h5 class="title font-weight-bold text-center">${card.header}</h5>
            </div>

            <div class="kanban-item-text">
                <p>${card.context}</p>
            </div>

            <!-- Son Teslim Tarihi & Menü Butonu -->
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <div class="kanban-item-label">Son Teslim Tarihi</div>
                    <div class="d-flex align-items-center">
                        <em class="icon ni ni-calendar"></em>
                        <span class="ml-1">${new Date(card.deadlineDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="kanban-item-options dropdown">
                    <a href="#" class="btn btn-sm btn-icon" data-toggle="dropdown">
                        <em class="icon ni ni-menu-alt"></em>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <ul class="link-list-opt no-bdr">
                            <li><a href="#"><em class="icon ni ni-edit"></em><span>Card Düzenle</span></a></li>
                            <li><a href="#"><em class="icon ni ni-note-add"></em><span>Not Ekle</span></a></li>
                            <li><a href="#"><em class="icon ni ni-info"></em><span>Detaylar</span></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}



// ? **Mevcut Taskları Fetch Et ve Board'a Ekle**
function fetchTasks() { // KanbanController içindeki GetCard actionuna (endpointine) istek atar (tetikler)
    $.ajax({
        url: '/Kanban/GetCard',
        method: 'POST',
        success: function (data) {
            data.forEach(task => {
                console.log(task);
                addCardToKanban(task);
            });
        },
        error: function (xhr) {
            console.error("Taskları çekerken hata oluştu:", xhr);
        }
    });
}

// ? **Değişen Card Statusunu ve cardın kendı ıdsını backende post etme**
function postCardStatusUpdate(cardId, cardStatus, oldBoardId) {
    console.log(`Id:${cardId} status: ${cardStatus}`);

    var statusChanged = {
        Id: cardId,
        Status: cardStatus
    };

    $.ajax({
        method: "POST",
        url: "/Kanban/UpdateCardStatus",
        data: JSON.stringify(statusChanged), // JavaScript değerini JSON'a çeviriyor.
        contentType: "application/json",
        success: (result) => { // Gönderilen data objesinin isimlerinin eşleşmesi değil, o objenin içindeki property ismiyle modeldeki property isimleri eşleşirse bir bind işlemi olur.
            console.log(result);

            // İşlem başarılı ise toastr success bildirimi 
            ZehraApp.Toast(result.message, 'success', { position: 'bottom-right' }); // return Ok dedigimiz icin mesaj JSon objesinin icinden gelmektedir.

        },
        error: function (error) {
            console.log(error);
            console.log("cardId = " + cardId + " oldBoardId = " + oldBoardId);

            // Önce kartın mevcut verilerini saklayalım.(cardin tum html kodlarini saklariz)
            var $cardElem = $('[data-eid="' + cardId + '"]');
            var cardHTML = $cardElem.length ? $cardElem.html() : createCardHTML({ header: cardId, context: "Kart içeriği", deadlineDate: new Date() });

            // Eğer kart mevcut board'da görünüyorsa, onu kaldır.
            kanban.removeElement(String(cardId));

            // Ardından, eski board'a (örneğin, "_completed") kartı yeniden ekle.
            kanban.addElement(oldBoardId, {
                id: String(cardId),
                title: cardHTML
            });

            ZehraApp.Toast(error.responseJSON.message, 'error', { position: 'bottom-right' });
        }

    });
}

// **Sayfa Yüklendiğinde Kanban'ı Başlat**
$(document).ready(function () {
    initKanban();

        // Dropdown menüdeki Card Düzenle / Not Ekle / Detaylar ögelerine tıklandığında
    $(document).on('click', '.kanban-item-options .dropdown-menu .link-list-opt li a', function (e) {
        e.preventDefault(); // Linkin default davranışını engelle

        // İlgili menu item’inin text'ini okuyalım (ör. "Card Düzenle", "Not Ekle", "Detaylar")
        let menuText = $(this).text().trim();

        // SweetAlert2 ile basit bir popup gösterelim
        // Menüye göre farklı başlık veya içerik göstermek için switch-case de kullanılabilir
        switch (menuText) {
            case 'Card Düzenle':
                Swal.fire({
                    title: 'Card Düzenle',
                    text: 'Burada card düzenleme ekranı açılacak.',
                    icon: 'info'
                });
                break;
            case 'Not Ekle':
                Swal.fire({
                    title: 'Not Ekle',
                    text: 'Burada not ekleme ekranı açılacak.',
                    icon: 'info'
                });
                break;
            case 'Detaylar':
                Swal.fire({
                    title: 'Detaylar',
                    text: 'Burada detay bilgileri gelecek.',
                    icon: 'info'
                });
                break;
            default:
                // Menüde tanımlanmamış bir durum varsa
                Swal.fire('Bilinmeyen Eylem', '', 'warning');
                break;
        }
    });
});
