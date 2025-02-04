export function handleItem(event, open, shrink) {
  event.preventDefault();
  const summary = event.target;
  const details = summary.closest('details');

  details.style.overflow = 'hidden';

  if (details.isClosing || !details.open) {
    open(details);
  } else if (details.isExpanding || details.open) {
    shrink(details, summary);
  }
}

export function shrink(details, summary) {
  details.isClosing = true;

  const startHeight = `${details.offsetHeight}px`;
  const endHeight = `${summary.offsetHeight}px`;

  if (details.animation) {
    details.animation.cancel();
  }

  details.animation = details.animate(
    { height: [startHeight, endHeight] },
    { duration: 200, easing: 'ease-out' }
  );

  details.animation.onfinish = () => onAnimationFinish(details, false);
  details.animation.oncancel = () => (details.isClosing = false);
}

export function open(details) {
  details.style.height = `${details.offsetHeight}px`;
  details.open = true;
  window.requestAnimationFrame(() => expand(details));
}

export function expand(details) {
  details.isExpanding = true;

  const summary = details.querySelector('summary');
  const content = details.querySelector('[data-accordion="content"]')
  const startHeight = `${details.offsetHeight}px`;
  const endHeight = `${summary.offsetHeight + content.offsetHeight}px`;

  if (details.animation) {
    details.animation.cancel();
  }

  details.animation = details.animate(
    { height: [startHeight, endHeight] },
    { duration: 300, easing: 'ease' }
  );

  details.animation.onfinish = () => onAnimationFinish(details, true);
  details.animation.oncancel = () => (details.isExpanding = false);
}

export function onAnimationFinish(details, open) {
  details.open = open;
  details.animation = null;
  details.isClosing = false;
  details.isExpanding = false;
  details.style.height = details.style.overflow = '';
}
