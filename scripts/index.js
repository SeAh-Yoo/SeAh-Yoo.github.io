const legacyPost = location.hash.match(/^#\/post\/([a-z0-9-]+)$/i);

if (legacyPost) {
  location.replace(`/posts/${legacyPost[1]}/`);
}

const addPostImageCaptions = () => {
  document.querySelectorAll('.post p > img:only-child').forEach((image) => {
    const caption = image.getAttribute('alt')?.trim();

    if (!caption) {
      return;
    }

    const paragraph = image.parentElement;
    const figure = document.createElement('figure');
    figure.className = 'post-image';

    const figcaption = document.createElement('figcaption');
    figcaption.textContent = caption;

    paragraph.replaceWith(figure);
    figure.append(image, figcaption);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addPostImageCaptions);
} else {
  addPostImageCaptions();
}
