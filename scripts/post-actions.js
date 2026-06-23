(() => {
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

  const shareRoot = document.querySelector('[data-post-share]');

  if (shareRoot) {
    const openButton = shareRoot.querySelector('[data-share-open]');
    const dialog = shareRoot.querySelector('[data-share-dialog]');
    const closeButton = shareRoot.querySelector('[data-share-close]');
    const printButton = shareRoot.querySelector('[data-print-post]');
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
    printButton?.addEventListener('click', () => window.print());

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

  const tocMount = document.querySelector('[data-post-toc-mount]');
  const article = document.querySelector('article.post');

  if (tocMount && article) {
    const normalizeText = (value) => String(value ?? '')
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .trim();
    const declaredSubtitle = normalizeText(tocMount.dataset.postSubtitle);
    const excludedSections = '.post-series, .post-navigation, .post-comments, .post-share-dialog';
    const headings = Array.from(article.querySelectorAll('h2, h3'))
      .filter((heading) => !heading.closest(excludedSections))
      .filter((heading) => !declaredSubtitle || normalizeText(heading.textContent) !== declaredSubtitle);

    if (headings.length < 2) {
      tocMount.remove();
    } else {
      const usedIds = new Set(Array.from(document.querySelectorAll('[id]')).map((element) => element.id));
      const slugify = (value) => String(value)
        .normalize('NFKC')
        .toLocaleLowerCase('ko-KR')
        .replace(/["'’]/g, '')
        .replace(/[^a-z0-9가-힣ぁ-んァ-ヶ一-龯]+/gi, '-')
        .replace(/^-+|-+$/g, '') || 'section';

      headings.forEach((heading, index) => {
        const headingText = normalizeText(heading.textContent);
        heading.dataset.tocTitle = headingText;

        if (!heading.id) {
          const baseId = slugify(headingText);
          let candidateId = baseId;
          let suffix = 2;

          while (usedIds.has(candidateId)) {
            candidateId = `${baseId}-${suffix}`;
            suffix += 1;
          }

          heading.id = candidateId;
          usedIds.add(candidateId);
        }

        heading.classList.add('post-content-heading');
        const anchorButton = document.createElement('button');
        anchorButton.type = 'button';
        anchorButton.className = 'post-heading-link';
        anchorButton.textContent = '#';
        anchorButton.setAttribute('aria-label', `「${headingText}」 위치 링크 복사`);
        anchorButton.title = '이 소제목 링크 복사';
        anchorButton.addEventListener('click', async () => {
          const targetUrl = new URL(window.location.href);
          targetUrl.hash = heading.id;

          try {
            await copyText(targetUrl.toString());
            anchorButton.textContent = '✓';
            window.setTimeout(() => {
              anchorButton.textContent = '#';
            }, 1300);
          } catch (error) {
            console.warn(error);
          }
        });
        heading.append(anchorButton);
        heading.dataset.tocIndex = String(index);
      });

      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const summaryTitle = document.createElement('span');
      const summaryCount = document.createElement('small');
      const list = document.createElement('ol');

      details.className = 'post-toc';
      details.open = !window.matchMedia('(max-width: 900px)').matches;
      summaryTitle.textContent = '목차';
      summaryCount.textContent = `${headings.length}개 항목`;
      summary.append(summaryTitle, summaryCount);

      const tocLinks = headings.map((heading) => {
        const item = document.createElement('li');
        const link = document.createElement('a');

        item.className = heading.tagName === 'H3' ? 'toc-level-3' : 'toc-level-2';
        link.href = `#${encodeURIComponent(heading.id)}`;
        link.textContent = heading.dataset.tocTitle;
        link.dataset.tocLink = heading.id;
        link.addEventListener('click', () => {
          if (window.matchMedia('(max-width: 900px)').matches) {
            window.setTimeout(() => {
              details.open = false;
            }, 220);
          }
        });
        item.append(link);
        list.append(item);
        return link;
      });

      details.append(summary, list);
      tocMount.append(details);

      let frameId = 0;
      const updateActiveTocItem = () => {
        frameId = 0;
        const threshold = Math.min(window.innerHeight * 0.32, 260);
        let activeIndex = 0;

        headings.forEach((heading, index) => {
          if (heading.getBoundingClientRect().top <= threshold) {
            activeIndex = index;
          }
        });

        tocLinks.forEach((link, index) => {
          const active = index === activeIndex;
          link.classList.toggle('is-active', active);
          if (active) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      };

      const scheduleTocUpdate = () => {
        if (!frameId) {
          frameId = window.requestAnimationFrame(updateActiveTocItem);
        }
      };

      window.addEventListener('scroll', scheduleTocUpdate, { passive: true });
      window.addEventListener('resize', scheduleTocUpdate);
      updateActiveTocItem();
    }
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
