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

  const getPostAnalyticsName = (prefix) => {
    const post = document.querySelector('article.post');
    const postSlug = post?.dataset.analyticsPost;

    return postSlug ? `${prefix}--${postSlug}` : prefix;
  };

  const trackPostEvent = (prefix, title = document.title) => {
    window.siteAnalytics?.trackEvent?.(getPostAnalyticsName(prefix), title);
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
    const campaign = shareRoot.dataset.shareCampaign || 'post-share';

    const getTrackedShareUrl = (source) => {
      try {
        const trackedUrl = new URL(url, window.location.origin);

        if (trackedUrl.origin === window.location.origin) {
          trackedUrl.searchParams.set('utm_source', source);
          trackedUrl.searchParams.set('utm_medium', 'share');
          trackedUrl.searchParams.set('utm_campaign', campaign);
        }

        return trackedUrl.toString();
      } catch (error) {
        return url;
      }
    };

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
      const trackedUrl = getTrackedShareUrl('kakao');

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
                mobileWebUrl: trackedUrl,
                webUrl: trackedUrl,
              },
            },
            buttons: [
              {
                title: '글 읽기',
                link: {
                  mobileWebUrl: trackedUrl,
                  webUrl: trackedUrl,
                },
              },
            ],
          });
          trackPostEvent('share-kakao', title);
          return;
        } catch (error) {
          console.warn(error);
        }
      }

      if (navigator.share) {
        try {
          await navigator.share({ title, text: description || title, url: getTrackedShareUrl('native-share') });
          trackPostEvent('share-native', title);
          return;
        } catch (error) {
          if (error && error.name === 'AbortError') {
            return;
          }
          console.warn(error);
        }
      }

      await copyText(url);
      trackPostEvent('share-copy', title);
      setStatus('주소를 복사했습니다. 카카오톡 채팅방에 붙여 넣어 주세요.');
    };

    const shareHandlers = {
      kakao: shareWithKakao,
      telegram: () => openShareWindow(
        `https://t.me/share/url?url=${encodeURIComponent(getTrackedShareUrl('telegram'))}&text=${encodeURIComponent(title)}`,
      ),
      line: () => openShareWindow(
        `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(getTrackedShareUrl('line'))}`,
      ),
      x: () => openShareWindow(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(getTrackedShareUrl('x'))}&text=${encodeURIComponent(title)}`,
      ),
      threads: () => openShareWindow(
        `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title}\n${getTrackedShareUrl('threads')}`)}`,
      ),
      facebook: () => openShareWindow(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getTrackedShareUrl('facebook'))}`,
      ),
      copy: async () => {
        await copyText(url);
        trackPostEvent('share-copy', title);
        setStatus('웹페이지 주소를 복사했습니다.');
      },
    };

    openButton?.addEventListener('click', () => {
      openDialog();
      trackPostEvent('share-dialog-open', title);
    });
    closeButton?.addEventListener('click', closeDialog);
    printButton?.addEventListener('click', () => {
      trackPostEvent('print-or-pdf', title);
      window.print();
    });

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
          if (button.dataset.shareService !== 'kakao' && button.dataset.shareService !== 'copy') {
            trackPostEvent(`share-${button.dataset.shareService}`, title);
          }
        } catch (error) {
          console.warn(error);
          setStatus('공유 기능을 실행하지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }
      });
    });
  }

  const article = document.querySelector('article.post');
  const quoteCardKicker = article?.dataset.quoteCardKicker || 'THE LITERARY UNDERGROUND';
  const quoteCardLabel = article?.dataset.quoteCardLabel || '문하수도 공개 기록';
  const quoteCardFilenamePrefix = article?.dataset.quoteCardFilenamePrefix || '문하수도-기록';

  const normalizeReaderText = (value) => String(value ?? '')
    .normalize('NFKC')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const getReadingText = (root) => {
    const clone = root.cloneNode(true);
    const excludedContent = [
      '.post-header',
      '.post-category-eyebrow',
      '.post-translations',
      '[data-post-reading-meta]',
      '.post-thesis',
      '.post-view-counter',
      '.post-toc-mount',
      '.post-series',
      '.post-navigation',
      '.post-continuation',
      '[data-post-share]',
      '.post-footer',
      '.post-comments',
      '.footnotes',
      '.quote-card-actions',
      'script',
      'style',
    ].join(', ');

    clone.querySelectorAll(excludedContent).forEach((element) => element.remove());
    return normalizeReaderText(clone.textContent);
  };

  const estimateReadingMinutes = (text) => {
    const cjkCharacters = (text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ一-龯々〆〤]/g) || []).length;
    const latinWords = (text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g) || []).length;
    const estimatedMinutes = (cjkCharacters / 500) + (latinWords / 220);

    return Math.max(1, Math.ceil(estimatedMinutes));
  };

  const setTemporaryTargetState = (target) => {
    target.classList.add('is-footnote-target');
    window.clearTimeout(target.footnoteTargetTimeoutId);
    target.footnoteTargetTimeoutId = window.setTimeout(() => {
      target.classList.remove('is-footnote-target');
    }, 1800);
  };

  const getHashTarget = (href) => {
    if (!href) {
      return null;
    }

    try {
      const targetUrl = new URL(href, window.location.href);

      if (
        targetUrl.origin !== window.location.origin
        || targetUrl.pathname !== window.location.pathname
        || !targetUrl.hash
      ) {
        return null;
      }

      return document.getElementById(decodeURIComponent(targetUrl.hash.slice(1)));
    } catch (error) {
      return null;
    }
  };

  const enhanceEndnotes = (root) => {
    const footnotes = root.querySelector('.footnotes');

    if (!footnotes) {
      return;
    }

    let heading = footnotes.querySelector('.post-endnotes-heading');

    if (!heading) {
      const header = document.createElement('div');
      const eyebrow = document.createElement('p');
      const help = document.createElement('p');

      heading = document.createElement('h2');
      heading.className = 'post-endnotes-heading';
      heading.id = 'post-endnotes';
      heading.textContent = '각주 및 참고 문헌';
      heading.tabIndex = -1;

      header.className = 'post-endnotes-header';
      eyebrow.className = 'post-endnotes-eyebrow';
      eyebrow.textContent = 'NOTES';
      help.className = 'post-endnotes-help';
      help.textContent = '본문의 각주 번호를 선택하면 이곳으로 이동합니다. 참고 문헌 번호 또는 돌아가기 화살표를 선택하면 읽던 위치로 돌아갑니다.';
      header.append(eyebrow, heading, help);
      footnotes.prepend(header);
    }

    footnotes.setAttribute('role', 'doc-endnotes');
    footnotes.setAttribute('aria-labelledby', heading.id);

    const getEndnoteNumber = (link, index) => {
      const matchedNumber = normalizeReaderText(link.textContent).match(/\d+/);

      return matchedNumber ? matchedNumber[0] : String(index + 1);
    };

    const focusHashTarget = (event) => {
      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }

      const target = getHashTarget(event.currentTarget.getAttribute('href'));

      if (!target) {
        return;
      }

      event.preventDefault();
      const hash = `#${encodeURIComponent(target.id)}`;

      if (window.history && typeof window.history.pushState === 'function') {
        window.history.pushState(null, '', hash);
      } else {
        window.location.hash = target.id;
      }

      if (!target.hasAttribute('tabindex')) {
        target.tabIndex = -1;
      }

      try {
        target.focus({ preventScroll: true });
      } catch (error) {
        target.focus();
      }

      target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      });
      setTemporaryTargetState(target);
    };

    root.querySelectorAll('a.footnote').forEach((link, index) => {
      const number = getEndnoteNumber(link, index);

      link.classList.add('post-endnote-reference');
      link.setAttribute('aria-label', `각주 및 참고 문헌 ${number}으로 이동`);
      link.setAttribute('title', `각주 및 참고 문헌 ${number}으로 이동`);
      link.setAttribute('role', 'doc-noteref');
      link.addEventListener('click', focusHashTarget);
    });

    footnotes.querySelectorAll('li').forEach((item, index) => {
      item.setAttribute('role', 'doc-endnote');
      item.setAttribute('aria-label', `각주 및 참고 문헌 ${index + 1}`);
      item.tabIndex = -1;

      const backlink = item.querySelector('a.reversefootnote');

      if (backlink && !item.querySelector('.post-endnote-number-link')) {
        const numberLink = document.createElement('a');

        numberLink.className = 'post-endnote-number-link';
        numberLink.href = backlink.getAttribute('href');
        numberLink.textContent = String(index + 1);
        numberLink.setAttribute('aria-label', `본문의 각주 ${index + 1} 위치로 돌아가기`);
        numberLink.setAttribute('title', `본문의 각주 ${index + 1} 위치로 돌아가기`);
        numberLink.setAttribute('role', 'doc-backlink');
        numberLink.addEventListener('click', focusHashTarget);
        item.prepend(numberLink);
      }
    });

    footnotes.querySelectorAll('a.reversefootnote').forEach((link, index) => {
      const number = getEndnoteNumber(link, index);

      link.classList.add('post-endnote-backlink');
      link.setAttribute('aria-label', `본문의 각주 ${number} 위치로 돌아가기`);
      link.setAttribute('title', `본문의 각주 ${number} 위치로 돌아가기`);
      link.setAttribute('role', 'doc-backlink');
      link.addEventListener('click', focusHashTarget);
    });
  };

  const setupReadingMeta = (root) => {
    const readingTime = root.querySelector('[data-reading-time]');

    if (readingTime) {
      const minutes = estimateReadingMinutes(getReadingText(root));
      const label = `예상 완독 시간: ${minutes}분`;

      readingTime.textContent = label;
      readingTime.setAttribute('aria-label', label);
    }

    const progressRoot = document.querySelector('[data-reading-progress]');
    const progressBar = progressRoot?.querySelector('[data-reading-progress-bar]');

    if (!progressRoot || !progressBar) {
      return;
    }

    const postTitle = normalizeReaderText(root.querySelector('h1')?.textContent || document.title);
    const readingStartedAt = Date.now();
    let frameId = 0;
    let currentProgress = 0;
    let read75Tracked = false;
    let readCompleteTracked = false;
    let completionTimerId = 0;

    const trackReadingCompletion = () => {
      if (readCompleteTracked || currentProgress < 0.9 || Date.now() - readingStartedAt < 30000) {
        return;
      }

      readCompleteTracked = true;
      trackPostEvent('read-complete', postTitle);
    };

    const scheduleReadingCompletion = () => {
      if (readCompleteTracked || completionTimerId || currentProgress < 0.9) {
        return;
      }

      const waitTime = Math.max(0, 30000 - (Date.now() - readingStartedAt));

      if (waitTime === 0) {
        trackReadingCompletion();
        return;
      }

      completionTimerId = window.setTimeout(() => {
        completionTimerId = 0;
        trackReadingCompletion();
      }, waitTime);
    };

    const updateProgress = () => {
      frameId = 0;
      const articleTop = root.getBoundingClientRect().top + window.scrollY;
      const readableHeight = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - articleTop) / readableHeight));

      currentProgress = progress;
      progressBar.style.transform = `scaleX(${progress})`;

      if (!read75Tracked && progress >= 0.75) {
        read75Tracked = true;
        trackPostEvent('read-75', postTitle);
      }

      scheduleReadingCompletion();
    };
    const scheduleProgressUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
    window.addEventListener('resize', scheduleProgressUpdate);
    updateProgress();
  };

  const drawRoundedRect = (context, x, y, width, height, radius) => {
    const corner = Math.min(radius, width / 2, height / 2);

    context.beginPath();
    context.moveTo(x + corner, y);
    context.arcTo(x + width, y, x + width, y + height, corner);
    context.arcTo(x + width, y + height, x, y + height, corner);
    context.arcTo(x, y + height, x, y, corner);
    context.arcTo(x, y, x + width, y, corner);
    context.closePath();
  };

  const wrapCanvasText = (context, text, maxWidth) => {
    const lines = [];
    const paragraphs = String(text || '').split(/\n+/);

    paragraphs.forEach((paragraph, paragraphIndex) => {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      let line = '';

      words.forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;

        if (context.measureText(candidate).width <= maxWidth) {
          line = candidate;
          return;
        }

        if (line) {
          lines.push(line);
          line = '';
        }

        if (context.measureText(word).width <= maxWidth) {
          line = word;
          return;
        }

        let segment = '';
        Array.from(word).forEach((character) => {
          const nextSegment = `${segment}${character}`;

          if (segment && context.measureText(nextSegment).width > maxWidth) {
            lines.push(segment);
            segment = character;
          } else {
            segment = nextSegment;
          }
        });
        line = segment;
      });

      if (line) {
        lines.push(line);
      }

      if (paragraphIndex < paragraphs.length - 1 && lines.length) {
        lines.push('');
      }
    });

    return lines;
  };

  const fitQuoteText = (context, text, maxWidth, maxHeight) => {
    for (let fontSize = 62; fontSize >= 38; fontSize -= 2) {
      const lineHeight = Math.round(fontSize * 1.48);

      context.font = `400 ${fontSize}px "MabinogiClassic", "NanumSquare", serif`;
      const lines = wrapCanvasText(context, text, maxWidth);

      if (lines.length * lineHeight <= maxHeight) {
        return { fontSize, lineHeight, lines, truncated: false };
      }
    }

    const fontSize = 38;
    const lineHeight = Math.round(fontSize * 1.48);
    const allLines = wrapCanvasText(context, text, maxWidth);
    const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));
    const lines = allLines.slice(0, maxLines);

    if (allLines.length > maxLines) {
      let lastLine = lines[lines.length - 1].trim();

      while (lastLine && context.measureText(`${lastLine}…`).width > maxWidth) {
        lastLine = Array.from(lastLine).slice(0, -1).join('');
      }

      lines[lines.length - 1] = `${lastLine}…`;
    }

    return { fontSize, lineHeight, lines, truncated: allLines.length > maxLines };
  };

  const createQuoteCardCanvas = (quoteText, postTitle, postUrl) => {
    const canvas = document.createElement('canvas');
    const width = 1080;
    const height = 1350;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas context is unavailable.');
    }

    canvas.width = width;
    canvas.height = height;

    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, '#32170d');
    background.addColorStop(0.46, '#160d09');
    background.addColorStop(1, '#0b0908');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    const orangeGlow = context.createRadialGradient(120, 80, 0, 120, 80, 630);
    orangeGlow.addColorStop(0, 'rgba(255, 82, 24, 0.42)');
    orangeGlow.addColorStop(1, 'rgba(255, 82, 24, 0)');
    context.fillStyle = orangeGlow;
    context.fillRect(0, 0, width, height);

    const amberGlow = context.createRadialGradient(1000, 1270, 0, 1000, 1270, 650);
    amberGlow.addColorStop(0, 'rgba(255, 164, 92, 0.34)');
    amberGlow.addColorStop(1, 'rgba(255, 164, 92, 0)');
    context.fillStyle = amberGlow;
    context.fillRect(0, 0, width, height);

    const panelX = 72;
    const panelY = 86;
    const panelWidth = width - (panelX * 2);
    const panelHeight = height - (panelY * 2);

    context.save();
    context.shadowColor = 'rgba(0, 0, 0, 0.42)';
    context.shadowBlur = 80;
    context.shadowOffsetY = 24;
    drawRoundedRect(context, panelX, panelY, panelWidth, panelHeight, 54);
    const glass = context.createLinearGradient(panelX, panelY, panelX + panelWidth, panelY + panelHeight);
    glass.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
    glass.addColorStop(0.42, 'rgba(255, 255, 255, 0.075)');
    glass.addColorStop(1, 'rgba(255, 255, 255, 0.045)');
    context.fillStyle = glass;
    context.fill();
    context.restore();

    drawRoundedRect(context, panelX, panelY, panelWidth, panelHeight, 54);
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(255, 224, 201, 0.46)';
    context.stroke();

    context.fillStyle = 'rgba(255, 255, 255, 0.12)';
    drawRoundedRect(context, panelX + 2, panelY + 2, panelWidth - 4, 186, 52);
    context.fill();

    context.fillStyle = '#ffb474';
    context.font = '700 25px Poppins, Arial, sans-serif';
    context.letterSpacing = '0px';
    context.fillText(quoteCardKicker, 136, 174);
    context.fillStyle = 'rgba(229, 236, 248, 0.72)';
    context.font = '600 22px Poppins, Arial, sans-serif';
    context.fillText(quoteCardLabel, 136, 214);

    context.fillStyle = 'rgba(255, 174, 105, 0.92)';
    context.font = '400 116px "MabinogiClassic", "NanumSquare", serif';
    context.fillText('“', 128, 364);

    const quoteLayout = fitQuoteText(context, quoteText, 780, 570);
    const quoteHeight = quoteLayout.lines.length * quoteLayout.lineHeight;
    const quoteStartY = 423 + Math.max(0, (570 - quoteHeight) / 2);

    context.font = `400 ${quoteLayout.fontSize}px "MabinogiClassic", "NanumSquare", serif`;
    context.fillStyle = '#f5f8ff';
    context.textBaseline = 'top';
    quoteLayout.lines.forEach((line, index) => {
      context.fillText(line, 158, quoteStartY + (index * quoteLayout.lineHeight));
    });

    if (quoteLayout.truncated) {
      context.font = '600 20px Poppins, Arial, sans-serif';
      context.fillStyle = 'rgba(229, 236, 248, 0.58)';
      context.fillText('긴 인용문은 카드 안에서 일부만 표시됩니다.', 158, 1012);
    }

    context.beginPath();
    context.moveTo(136, 1064);
    context.lineTo(944, 1064);
    context.lineWidth = 2;
    context.strokeStyle = 'rgba(255, 174, 105, 0.28)';
    context.stroke();

    context.font = '400 28px "MabinogiClassic", "NanumSquare", serif';
    const titleLines = wrapCanvasText(context, normalizeReaderText(postTitle), 730).slice(0, 2);
    context.fillStyle = '#ffffff';
    context.textBaseline = 'top';
    titleLines.forEach((line, index) => {
      context.fillText(line, 136, 1114 + (index * 40));
    });

    const displayUrl = String(postUrl || window.location.href)
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');
    context.font = '600 22px Poppins, Arial, sans-serif';
    context.fillStyle = 'rgba(229, 236, 248, 0.68)';
    context.fillText(displayUrl, 136, 1226);

    return canvas;
  };

  const downloadQuoteCard = (canvas, filename) => {
    const downloadLink = document.createElement('a');

    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = filename;
    downloadLink.rel = 'noopener';
    document.body.append(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  const setupQuoteCards = (root) => {
    const postTitle = normalizeReaderText(root.querySelector('h1')?.textContent || document.title);
    const canonicalUrl = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
    const ignoredQuotes = '.footnotes, .post-series, .post-continuation, .post-comments, .post-share-dialog';

    root.querySelectorAll('blockquote').forEach((quote, index) => {
      if (quote.closest(ignoredQuotes) || quote.closest('.post-quote-card')) {
        return;
      }

      const quoteText = normalizeReaderText(quote.textContent);

      if (!quoteText) {
        return;
      }

      const wrapper = document.createElement('div');
      const controls = document.createElement('div');
      const button = document.createElement('button');
      const status = document.createElement('span');
      const originalLabel = '인용 카드 만들기';

      wrapper.className = 'post-quote-card';
      controls.className = 'quote-card-actions';
      button.className = 'quote-card-button';
      button.type = 'button';
      button.textContent = originalLabel;
      button.setAttribute('aria-label', '이 인용문으로 PNG 인용 카드 만들기');
      status.className = 'quote-card-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');

      quote.parentNode.insertBefore(wrapper, quote);
      wrapper.append(quote, controls);
      controls.append(button, status);

      button.addEventListener('click', async () => {
        button.disabled = true;
        button.textContent = '카드 만드는 중…';

        try {
          if (document.fonts?.load) {
            await document.fonts.load('400 62px "MabinogiClassic"').catch(() => []);
          }

          const canvas = createQuoteCardCanvas(quoteText, postTitle, canonicalUrl);
          const safeTitle = postTitle
            .replace(/[\\/:*?"<>|]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 48) || `quote-${index + 1}`;

          downloadQuoteCard(canvas, `${quoteCardFilenamePrefix}-${safeTitle}.png`);
          trackPostEvent('quote-card-export', postTitle);
          status.textContent = 'PNG 인용 카드를 저장했습니다.';
          button.textContent = 'PNG 저장됨';
        } catch (error) {
          console.warn(error);
          status.textContent = '인용 카드를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.';
          button.textContent = '다시 시도하기';
        }

        window.setTimeout(() => {
          button.disabled = false;
          button.textContent = originalLabel;
        }, 2200);
      });
    });
  };

  if (article) {
    const postActionAnchor = article.querySelector('.footnotes, .post-series, .post-continuation, .post-footer');

    if (shareRoot && postActionAnchor) {
      postActionAnchor.before(shareRoot);
    }

    enhanceEndnotes(article);
    setupQuoteCards(article);
    setupReadingMeta(article);
  }

  const tocMount = document.querySelector('[data-post-toc-mount]');

  if (tocMount && article) {
    const normalizeText = (value) => String(value ?? '')
      .normalize('NFKC')
      .replace(/\s+/g, ' ')
      .trim();
    const declaredSubtitle = normalizeText(tocMount.dataset.postSubtitle);
    const excludedSections = '.footnotes, .post-series, .post-continuation, .post-comments, .post-share-dialog';
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
