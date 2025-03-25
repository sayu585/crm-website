document.getElementById('settingsButton').addEventListener('click', function () {
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('darkModeToggle').addEventListener('change', function () {
    document.body.classList.toggle('dark-mode');
});

document.getElementById('logoutButton').addEventListener('click', function () {
    sessionUser = null;
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
});
