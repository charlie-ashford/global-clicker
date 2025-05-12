(() => {
  const countEl = document.getElementById('count');
  const errorEl = document.getElementById('error-message');
  const container = document.getElementById('counter-container');
  const buttons = document.querySelectorAll('.increment-btn');
  let currentCount = 0;
  const API_URL = 'https://api.communitrics.com/counter';

  const updateDisplay = newCount => {
    const oldLength = countEl.innerText.length;
    const newLength = String(newCount).length;
    if (newLength !== oldLength) {
      container.classList.add('expand');
      setTimeout(() => {
        container.classList.remove('expand');
      }, 300);
    }
    countEl.innerText = newCount;
  };

  const fetchCount = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        currentCount = data.count;
        updateDisplay(currentCount);
      })
      .catch(err => console.error('Error fetching count:', err));
  };

  const incrementCount = (amount, button) => {
    button.disabled = true;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'increment',
        amount,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showError(data.error);
        } else {
          currentCount = data.count;
          updateDisplay(currentCount);
          hideError();
        }
      })
      .catch(err => {
        console.error('Error incrementing count:', err);
        showError('An error occurred. Please try again.');
      })
      .finally(() => {
        setTimeout(() => (button.disabled = false), 300);
      });
  };

  const showError = message => {
    errorEl.innerText = message;
    errorEl.classList.remove('opacity-0');
    errorEl.classList.add('fade-in');
  };

  const hideError = () => {
    errorEl.textContent = '';
    errorEl.classList.remove('fade-in');
    errorEl.classList.add('opacity-0');
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.dataset.amount, 10);
      incrementCount(amount, btn);
    });
  });

  fetchCount();
  setInterval(fetchCount, 2000);
})();
