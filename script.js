// URL parametrelerini al
const urlParams = new URLSearchParams(window.location.search);
const serverIp = urlParams.get('ip') || '212.16.87.26'; // Varsayılan IP
const serverPort = urlParams.get('port') || '27015'; // Varsayılan ports

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Sunucu bilgilerini göster
    document.getElementById('serverIp').textContent = serverIp;
    document.getElementById('serverPort').textContent = serverPort;
    
    // Sayfa başlığını güncelle
    document.title = `${serverIp}:${serverPort} - Fivem Sunucusu`;
});

// Fivem'e bağlanma fonksiyonu
function connectToServer() {
    const connectUrl = `fivem://connect/${serverIp}:${serverPort}`;
    
    // Mobil cihaz kontrolü
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Mobil cihazlarda farklı bir yaklaşım
        window.location.href = connectUrl;
        
        // Alternatif olarak kullanıcıya talimat göster
        setTimeout(() => {
            alert('Fivem uygulaması açılmadıysa, aşağıdaki komutu F8 konsoluna yapıştırın:\n\nconnect ' + serverIp + ':' + serverPort);
        }, 1000);
    } else {
        // Masaüstü cihazlarda doğrudan yönlendir
        window.location.href = connectUrl;
    }
}

// F8 komutunu kopyalama fonksiyonu
function copyConnectCommand() {
    const command = `connect ${serverIp}:${serverPort}`;
    
    // Modern kopyalama yöntemi
    if (navigator.clipboard) {
        navigator.clipboard.writeText(command).then(() => {
            showToast('Komut panoya kopyalandı! 🎉');
        }).catch(err => {
            fallbackCopyCommand(command);
        });
    } else {
        fallbackCopyCommand(command);
    }
}

// Eski tarayıcılar için kopyalama yöntemi
function fallbackCopyCommand(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Komut panoya kopyalandı! 🎉');
        } else {
            showToast('Kopyalama başarısız! Manuel kopyalayın: ' + text);
        }
    } catch (err) {
        showToast('Kopyalama başarısız! Manuel kopyalayın: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Toast mesajı göster
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Sunucu durumu kontrolü (isteğe bağlı)
async function checkServerStatus() {
    try {
        // Bu kısım Fivem sunucu API'sine bağlanarak gerçek durumu kontrol edebilir
        // Örnek: const response = await fetch(`http://${serverIp}:${serverPort}/info.json`);
        // Gerçek implementasyon için FiveM API dokümantasyonuna bakın
        
        // Şimdilik her zaman online gösteriyoruz
        document.getElementById('serverStatus').textContent = 'Çevrimiçi';
        document.getElementById('serverStatus').className = 'status online';
    } catch (error) {
        document.getElementById('serverStatus').textContent = 'Çevrimdışı';
        document.getElementById('serverStatus').className = 'status offline';
    }
}

// Sayfa yüklendiğinde sunucu durumunu kontrol et
checkServerStatus();

// ESC tuşuna basınca komutu kopyala
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        copyConnectCommand();
    }
});
