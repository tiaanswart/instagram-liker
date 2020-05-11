const findPostsToLike = () => {
  return document.querySelectorAll(
    'article > div > section > span > button > svg[aria-label="Like"]'
  );
};

const findPostsToRemove = () => {
  return document.querySelectorAll(
    'article > div > section > span > button > svg[aria-label="Unlike"]:not(.hide)'
  );
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
  newButton.innerHTML = `Running (${setup.likesCount})`;
  newButton.disabled = !setup.canLike;
  let postsToLike = Array.from(findPostsToLike());
  let postsToRemove = Array.from(findPostsToRemove()).reverse();
  if (postsToRemove.length) {
    postsToRemove.forEach((post) => {
      post.classList += ' hide';
      post.closest('article').classList += ' hide';
    });
    setTimeout(() => {
      init();
    }, postsToRemove.length * 500);
  } else if (postsToLike.length) {
    postsToLike.forEach((post, index) => {
      setTimeout(() => {
        if (setup.canLike && !checkBlockedStatus()) {
          let article = post.closest('article');
          article.setAttribute('style', 'border:2px solid black;');
          article.scrollIntoView();
          post.parentNode.click();
          setup.likesCount++;
          if (postsToLike.length - 1 === index) {
            setTimeout(() => {
              init();
            }, 1000);
          }
        } else {
          newButton.innerHTML = `Stopped (${setup.likesCount})`;
          newButton.disabled = !setup.canLike;
        }
      }, (index + 1) * 3000);
    });
  } else {
    document.querySelector('main > section > div > div').scrollIntoView(false);
    setTimeout(() => {
      init();
    }, 1000);
  }
};

const mainElement = document.querySelector('main');
const newButton = document.createElement('button');
newButton.innerHTML = 'Start';
newButton.id = 'liker-start-button';
newButton.disabled = !setup.canLike;
if (!setup.canLike) newButton.innerHTML = `Stopped (${setup.likesCount})`;
newButton.onclick = init;
newButton.style.position = 'fixed';
newButton.style.width = '100%';
newButton.style.zIndex = 1;
mainElement.insertBefore(newButton, mainElement.firstChild);
