document.addEventListener('DOMContentLoaded', async () => {
  const adminStatus = document.getElementById('adminStatus');
  const tableBody = document.querySelector('#messageTable tbody');
  const logoutBtn = document.getElementById('logoutBtn');

  // Handle logout
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login.html';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login.html';
    }
  });

  try {
    const response = await fetch('/api/contacts');
    
    if (response.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login.html';
      return;
    }

    if (!response.ok) {
      throw new Error('Unable to fetch messages');
    }

    const contacts = await response.json();
    if (!contacts.length) {
      adminStatus.textContent = 'No contact messages have been submitted yet.';
      return;
    }

    contacts.reverse().forEach(contact => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(contact.receivedAt).toLocaleString()}</td>
        <td>${contact.fullName}</td>
        <td>${contact.email}</td>
        <td>${contact.phone}</td>
        <td>${contact.company}</td>
        <td>${contact.message}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    adminStatus.textContent = 'Unable to load messages. Please make sure the server is running.';
    console.error('Error:', error);
  }
});
