"use client";

import { useEffect, useState } from 'react';
import DisableDevtool from 'disable-devtool';

export function DisableDevTools() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Tạo một div cho modal
    const createSecurityModal = () => {
      const modalContainer = document.createElement('div');
      modalContainer.style.position = 'fixed';
      modalContainer.style.top = '0';
      modalContainer.style.left = '0';
      modalContainer.style.width = '100%';
      modalContainer.style.height = '100%';
      modalContainer.style.backgroundColor = 'rgba(0,0,0,0.8)';
      modalContainer.style.zIndex = '99999';
      modalContainer.style.display = 'flex';
      modalContainer.style.alignItems = 'center';
      modalContainer.style.justifyContent = 'center';

      const modalContent = document.createElement('div');
      modalContent.style.backgroundColor = '#fff';
      modalContent.style.color = '#000';
      modalContent.style.padding = '20px';
      modalContent.style.borderRadius = '8px';
      modalContent.style.maxWidth = '80%';
      modalContent.style.textAlign = 'center';
      modalContent.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';

      const modalIcon = document.createElement('div');
      modalIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
      
      const modalTitle = document.createElement('h2');
      modalTitle.innerText = 'Cảnh báo bảo mật';
      modalTitle.style.margin = '10px 0';
      modalTitle.style.color = '#ff0000';
      modalTitle.style.fontSize = '24px';

      const modalText = document.createElement('p');
      modalText.innerText = 'Đã phát hiện công cụ kiểm tra. Truy cập website đã bị chặn vì lý do bảo mật.';
      modalText.style.marginBottom = '20px';
      modalText.style.fontSize = '16px';
      
      modalContent.appendChild(modalIcon);
      modalContent.appendChild(modalTitle);
      modalContent.appendChild(modalText);
      modalContainer.appendChild(modalContent);
      
      document.body.appendChild(modalContainer);
      
      // Làm cho trang dừng hoạt động
      // Vô hiệu hóa tất cả các sự kiện click, scroll, mousemove, keydown
      document.addEventListener('click', preventEvent, true);
      document.addEventListener('scroll', preventEvent, true);
      document.addEventListener('mousemove', preventEvent, true);
      document.addEventListener('keydown', preventEvent, true);
      
      // Làm đóng băng trang web
      freezePage();
    };
    
    const preventEvent = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
    };
    
    const freezePage = () => {
      // Làm đơ trình duyệt bằng cách chạy một vòng lặp nặng
      const startTime = Date.now();
      while (Date.now() - startTime < 10000) {
        // Vòng lặp làm trình duyệt bị đơ trong 10 giây
        // Sau đó vòng lặp này sẽ kết thúc nhưng trang vẫn bị vô hiệu hóa
      }
    };

    // Chặn các phím tắt để mở DevTools
    const blockDevToolsShortcuts = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        preventEvent(e);
      }
      
      // Ctrl+Shift+I / Cmd+Option+I
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 73) || (e.metaKey && e.altKey && e.keyCode === 73)) {
        preventEvent(e);
      }
      
      // Ctrl+Shift+J / Cmd+Option+J
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 74) || (e.metaKey && e.altKey && e.keyCode === 74)) {
        preventEvent(e);
      }
      
      // Ctrl+Shift+C / Cmd+Option+C
      if ((e.ctrlKey && e.shiftKey && e.keyCode === 67) || (e.metaKey && e.altKey && e.keyCode === 67)) {
        preventEvent(e);
      }
      
      // Ctrl+U / Cmd+Option+U (Xem nguồn)
      if ((e.ctrlKey && e.keyCode === 85) || (e.metaKey && e.altKey && e.keyCode === 85)) {
        preventEvent(e);
      }
    };
    
    // Chặn chuột phải và hiện thông báo
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      
      // Hiện thông báo nhỏ
      const notification = document.createElement('div');
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.left = '50%';
      notification.style.transform = 'translateX(-50%)';
      notification.style.backgroundColor = 'rgba(255, 0, 0, 0.9)';
      notification.style.color = 'white';
      notification.style.padding = '10px 20px';
      notification.style.borderRadius = '5px';
      notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
      notification.style.zIndex = '9999';
      notification.style.fontSize = '14px';
      notification.style.fontWeight = 'bold';
      notification.innerText = 'Menu chuột phải đã bị vô hiệu hóa vì lý do bảo mật!';
      
      document.body.appendChild(notification);
      
      // Xóa thông báo sau 3 giây
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
      
      return false;
    };
    
    // Đăng ký sự kiện bắt phím và chuột phải
    document.addEventListener('keydown', blockDevToolsShortcuts, true);
    document.addEventListener('contextmenu', handleContextMenu, true);

    DisableDevtool({
      disableMenu: true, // Vô hiệu hóa menu chuột phải
      disableSelect: false, // Không vô hiệu hóa select text
      disableCopy: false, // Không vô hiệu hóa copy
      disableCut: false, // Không vô hiệu hóa cut
      disablePaste: false, // Không vô hiệu hóa paste
      ondevtoolopen: (type) => {
        console.log('DevTools mở với type:', type);
        
        // Hiện modal thông báo và đóng băng trang
        if (!showModal) {
          setShowModal(true);
          createSecurityModal();
          
          // Log ra console một thông báo
          console.error('SECURITY ALERT: Developer tools detected. Page access restricted.');
        }
      }
    });
    
    // Cleanup khi unmount
    return () => {
      document.removeEventListener('keydown', blockDevToolsShortcuts, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
    };
  }, [showModal]);

  return null; // Component không render gì cả
}

export default DisableDevTools; 