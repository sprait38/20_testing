(() => {
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const home = document.getElementById('cards-app');
    let app = document.createElement('div');
    const button = document.createElement('button');
    button.classList.add('button');
    button.textContent = 'Сыграть ещё раз?';

    let arrayCards = [];
    let selectedCards = [];
    let timeoutSelect = null;

    const clearSelected = () => {
      clearTimeout(timeoutSelect);
      for (const item of selectedCards) {
        if (item.classList) item.classList.toggle('title-hidden');
      }
      selectedCards = [];
    };

    const checkSelectedCards = () => {
      clearTimeout(timeoutSelect);
      if (selectedCards.length >= 2) {
        if (selectedCards[0].textContent === selectedCards[1].textContent) {
          // eslint-disable-next-line
          arrayCards = arrayCards.filter((item) => item !== parseInt(selectedCards[0].textContent));
          selectedCards = [];
        } else {
          timeoutSelect = setTimeout(clearSelected, 600);
        }
      }
      if (arrayCards.length === 0) {
        app.append(button);
      }
    };

    const createCard = (number) => {
      if (!number) { return; }
      const card = document.createElement('div');
      const title = document.createElement('h5');

      title.textContent = number;
      card.append(title);

      card.classList.add('card');
      title.classList.add('card-title', 'title-hidden');
      card.addEventListener('click', () => {
        if (selectedCards.length >= 2) {
          clearSelected();
        } else if (!title.classList.contains('title-hidden')) {
          return;
        }
        title.classList.remove('title-hidden');
        selectedCards.push(title);
        checkSelectedCards();
      });

      // eslint-disable-next-line consistent-return
      return card;
    };

    const appStart = (horizontCount, verticalCount) => {
      app = document.createElement('div');
      app.classList.add('container');
      home.append(app);

      arrayCards = [];
      selectedCards = [];
      timeoutSelect = null;
      for (let i = 1; i <= ((horizontCount * verticalCount) / 2); i++) {
        arrayCards.push(i);
        arrayCards.push(i);
      }
      shuffle(arrayCards);

      for (let i = 0; i < arrayCards.length;) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < horizontCount; j++) {
          const card = createCard(arrayCards[i]);
          i++;
          row.append(card);
        }
        app.append(row);
      }
    };

    const createForm = () => {
      button.remove();
      app.remove();
      const form = document.createElement('form');
      form.classList.add('form');
      const inputH = document.createElement('input');
      inputH.classList.add('input');
      inputH.classList.add('horizont');
      const inputV = document.createElement('input');
      inputV.classList.add('input');
      inputV.classList.add('vertical');
      const errorLabel = document.createElement('h5');
      errorLabel.classList.add('error');
      errorLabel.textContent = 'Введены не корректные числа';

      const buttonSubmit = document.createElement('button');
      buttonSubmit.classList.add('button');

      inputH.placeholder = 'Кол-во ячеек по горизонтали';
      inputV.placeholder = 'Кол-во ячеек по вертикали';
      buttonSubmit.classList.add('Button');
      buttonSubmit.textContent = 'Играть';

      form.append(inputH);
      form.append(inputV);
      form.append(buttonSubmit);
      home.append(form);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const hValue = inputH.value;
        const vValue = inputV.value;
        if (!!hValue && !!vValue && hValue % 2 === 0 && vValue % 2 === 0) {
          form.remove();
          // eslint-disable-next-line radix
          appStart(parseInt(hValue), parseInt(vValue));
        } else {
          errorLabel.remove();
          form.append(errorLabel);
          inputH.value = 4;
          inputV.value = 4;
          setTimeout(() => {
            form.remove();
            // eslint-disable-next-line radix
            appStart(parseInt(inputH.value), parseInt(inputV.value));
          }, 500);
        }
      });
    };

    button.addEventListener('click', () => {
      createForm();
    });

    createForm();
  });
})();
