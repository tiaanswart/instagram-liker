const findPostButtons = () => {
  return document.querySelectorAll('article > div > section > span > button > svg');
};

let blocked = false;
const checkBlockedStatus = () => {
  if (
    document.querySelectorAll('div[role="presentation"]').length &&
    document.querySelectorAll('div[role="dialog"]').length > 1
  ) {
    blocked = true;
  }
  return blocked;
};

const setup = {
  get defaultSetup() {
    return `${0}-${new Date().toGMTString()}`;
  },
  get localStorage() {
    return localStorage.getItem('instagram-likes-count') || this.defaultSetup;
  },
  get resetDate() {
    let date = this.localStorage;
    date = new Date(date.split('-')[1]);
    return date < new Date();
  },
  get canLike() {
    if (this.resetDate) {
      this.likesCount = 0;
      return true;
    } else return this.likesCount < 60;
  },
  get likesCount() {
    let count = this.localStorage;
    return parseInt(count.split('-')[0]);
  },
  set likesCount(count) {
    let date = new Date();
    date.setTime(date.getTime() + 1 * 60 * 60 * 1000);
    localStorage.setItem('instagram-likes-count', `${count || 0}-${date.toGMTString()}`);
  },
};

const init = () => {
  newButton.disabled = !setup.canLike;
  if (setup.canLike) {
    newButton.innerHTML = `Running (${setup.likesCount})`;
    window.scrollBy({
      top: 250,
      left: 0,
      behavior: 'smooth',
    });
    const postButtons = Array.from(findPostButtons());
    postButtons.forEach((postButton) => {
      if (
        postButton.getAttribute('aria-label') === 'Like' &&
        setup.canLike &&
        !checkBlockedStatus()
      ) {
        const { innerWidth, innerHeight } = window;
        const { clientWidth, clientHeight } = document.documentElement;
        const bounding = postButton.getBoundingClientRect();
        if (
          bounding.top >= 0 &&
          bounding.left >= 0 &&
          bounding.right <= (innerWidth || clientWidth) &&
          bounding.bottom <= (innerHeight || clientHeight)
        ) {
          const article = postButton.closest('article');
          article.setAttribute('style', 'border:2px solid black;');
          postButton.parentNode.click();
          setup.likesCount++;
          newButton.innerHTML = `Running (${setup.likesCount})`;
        }
      }
    });
    setTimeout(() => {
      if (setup.canLike) {
        init();
      } else {
        newButton.innerHTML = `Stopped (${setup.likesCount})`;
      }
    }, 1000);
  } else {
    newButton.innerHTML = `Stopped (${setup.likesCount})`;
  }
};

const mainElement = document.querySelector('main');
const newButton = document.createElement('button');
newButton.innerHTML = 'Start';
newButton.id = 'liker-start-button';
// newButton.disabled = !setup.canLike;
// if (!setup.canLike) newButton.innerHTML = `Stopped (${setup.likesCount})`;
newButton.onclick = init;
newButton.style.position = 'fixed';
newButton.style.width = '100%';
newButton.style.zIndex = 1;
mainElement.insertBefore(newButton, mainElement.firstChild);
