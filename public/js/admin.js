document.addEventListener('DOMContentLoaded', async () => {
  const adminStatus = document.getElementById('adminStatus');
  const tableBody = document.querySelector('#messageTable tbody');
  const logoutBtn = document.getElementById('logoutBtn');

  // Handle logout
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      window.location.href = '/login.html';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login.html';
    }
  });

  try {
    // Cookie-authenticated request to admin contacts endpoint.
    const response = await fetch('/api/contacts', { credentials: 'include' });
    
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

    // Render newest messages first for faster admin triage.
    contacts.reverse().forEach(contact => {
      const row = document.createElement('tr');

      const receivedTd = document.createElement('td');
      receivedTd.textContent = new Date(contact.receivedAt).toLocaleString();
      row.appendChild(receivedTd);

      const nameTd = document.createElement('td');
      nameTd.textContent = contact.fullName || '';
      row.appendChild(nameTd);

      const emailTd = document.createElement('td');
      emailTd.textContent = contact.email || '';
      row.appendChild(emailTd);

      const phoneTd = document.createElement('td');
      phoneTd.textContent = contact.phone || '';
      row.appendChild(phoneTd);

      const companyTd = document.createElement('td');
      companyTd.textContent = contact.company || '';
      row.appendChild(companyTd);

      const messageTd = document.createElement('td');
      messageTd.textContent = contact.message || '';
      row.appendChild(messageTd);

      tableBody.appendChild(row);
    });
  } catch (error) {
    adminStatus.textContent = 'Unable to load messages. Please make sure the server is running.';
    console.error('Error:', error);
  }
});
