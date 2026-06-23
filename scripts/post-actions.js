(() => {
  const shareRoot = document.querySelector('[data-post-share]');

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  const openShareWindow = (url) => {
    const width = 720;
    const height = 620;
    const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
    const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
    const popup = window.open(
      url,
      '_blank',
      `popup=yes,noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`,
    );

    if (popup) {
      popup.opener = null;
    }
  };

  const loadKakaoSdk = (() => {
    let sdkPromise;

    return () => {
      if (window.Kakao) {
        return Promise.resolve(window.Kakao);
      }

      if (!sdkPromise) {
        sdkPromise = new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';
          script.crossOrigin = 'anonymous';
          script.onload = () => resolve(window.Kakao);
          script.onerror = () => reject(new Error('카카오 SDK를 불러오지 못했습니다.'));
          document.head.appendChild(script);
        });
      }

      return sdkPromise;
    };
  })();

  if (shareRoot) {
    const openButton = shareRoot.querySelector('[data-share-open]');
    const dialog = shareRoot.querySelector('[data-share-dialog]');
    const closeButton = shareRoot.querySelector('[data-share-close]');
    const status = shareRoot.querySelector('[data-share-status]');
    const title = shareRoot.dataset.shareTitle || document.title;
    const url = shareRoot.dataset.shareUrl || window.location.href;
    const description = shareRoot.dataset.shareDescription || '';
    const image = shareRoot.dataset.shareImage || '';
    const kakaoKey = shareRoot.dataset.kakaoKey || '';

    const setStatus = (message) => {
      if (!status) {
        return;
      }

      status.textContent = message;
      window.clearTimeout(setStatus.timeoutId);
      setStatus.timeoutId = window.setTimeout(() => {
        status.textContent = '';
      }, 3200);
    };

    const openDialog = () => {
      if (!dialog) {
        return;
      }

      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    };

    const closeDialog = () => {
      if (!dialog) {
        return;
      }

      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    };

    const shareWithKakao = async () => {
      if (kakaoKey) {
        try {
          const Kakao = await loadKakaoSdk();

          if (!Kakao.isInitialized()) {
            Kakao.init(kakaoKey);
          }

          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title,
              description,
              imageUrl: image,
              link: {
                mobileWebUrl: url,
                webUrl: url,
              },
            },
            buttons: [
              {
                title: '글 읽기',
                link: {
                  mobileWebUrl: url,
                  webUrl: url,
                },
              },
            ],
          });
          return;
        } catch (error) {
          console.warn(error);
        }
      }

      if (navigator.share) {
        try {
          await navigator.share({ title, text: description || title, url });
          return;
        } catch (error) {
          if (error && error.name === 'AbortError') {
            return;
          }
          console.warn(error);
        }
      }

      await copyText(url);
      setStatus('주소를 복사했습니다. 카카오톡 채팅방에 붙여 넣어 주세요.');
    };

    const shareHandlers = {
      kakao: shareWithKakao,
      telegram: () => openShareWindow(
        `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      ),
      line: () => openShareWindow(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
      ),
      x: () => openShareWindow(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      ),
      threads: () => openShareWindow(
        `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title}\n${url}`)}`,
      ),
      facebook: () => openShareWindow(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      ),
      copy: async () => {
        await copyText(url);
        setStatus('웹페이지 주소를 복사했습니다.');
      },
    };

    openButton?.addEventListener('click', openDialog);
    closeButton?.addEventListener('click', closeDialog);

    dialog?.addEventListener('click', (event) => {
      if (event.target === dialog) {
        closeDialog();
      }
    });

    dialog?.addEventListener('close', () => {
      if (status) {
        status.textContent = '';
      }
    });

    shareRoot.querySelectorAll('[data-share-service]').forEach((button) => {
      button.addEventListener('click', async () => {
        const handler = shareHandlers[button.dataset.shareService];

        if (!handler) {
          return;
        }

        try {
          await handler();
        } catch (error) {
          console.warn(error);
          setStatus('공유 기능을 실행하지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }
      });
    });
  }

  const giscusContainer = document.querySelector('[data-giscus-container]');

  if (giscusContainer) {
    let loaded = false;

    const loadGiscus = () => {
      if (loaded) {
        return;
      }

      loaded = true;
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';

      Object.entries(giscusContainer.dataset).forEach(([key, value]) => {
        if (key === 'giscusContainer') {
          return;
        }

        const attribute = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
        script.setAttribute(`data-${attribute}`, value);
      });

      giscusContainer.appendChild(script);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadGiscus();
        }
      }, { rootMargin: '700px 0px' });

      observer.observe(giscusContainer);
    } else {
      loadGiscus();
    }
  }
})();
